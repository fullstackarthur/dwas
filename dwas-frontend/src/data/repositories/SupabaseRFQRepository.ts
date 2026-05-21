import { supabase } from '../../lib/supabase'
import type { RFQ, RFQTimelineEvent } from '../../core/types/rfq'
import {
  mapCompleteRfqJsonToRFQ,
  mapRfqSummaryRowToRFQ,
  mapDbTimelineEvent,
  mapDbUserToUser,
} from '../mappers/rfqMapper'

function generateFallbackTimeline(json: Record<string, unknown>): RFQTimelineEvent[] {
  const events: RFQTimelineEvent[] = []
  const id = (json.id as string) || ''
  const createdAt = json.createdAt || json.created_at
  const stage = json.stage as string

  events.push({
    id: `${id}-created`,
    rfqId: id,
    type: 'system',
    title: 'RFQ Created',
    timestamp: createdAt ? new Date(createdAt as string).toISOString() : new Date().toISOString(),
  })

  if (stage && stage !== 'new') {
    events.push({
      id: `${id}-stage`,
      rfqId: id,
      type: 'workflow_transition',
      title: `Stage changed to ${stage.replace(/_/g, ' ')}`,
      previousStage: 'new',
      newStage: stage as RFQTimelineEvent['newStage'],
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    })
  }

  const recCount = (json.recommendations as unknown[])?.length || 0
  if (recCount > 0) {
    events.push({
      id: `${id}-ai-match`,
      rfqId: id,
      type: 'ai',
      title: `AI identified ${recCount} vendor match${recCount > 1 ? 'es' : ''}`,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    })
  }

  return events
}

export interface RFQRepository {
  fetchAllRfqs(): Promise<RFQ[]>
  fetchRfqById(id: string): Promise<RFQ | null>
  updateRfqStage(rfqId: string, stage: string): Promise<void>
  markAsRead(rfqId: string): Promise<void>
  subscribeToRfqChanges(callback: (rfqs: RFQ[]) => void): () => void
}

export class SupabaseRFQRepository implements RFQRepository {
  async fetchAllRfqs(): Promise<RFQ[]> {
    const { data, error } = await supabase
      .from('rfq_summary')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[SupabaseRFQRepository] fetchAllRfqs error:', error)
      throw error
    }

    return (data || []).map(mapRfqSummaryRowToRFQ)
  }

  async fetchRfqById(id: string): Promise<RFQ | null> {
    let json: Record<string, unknown> | null = null

    try {
      const { data, error } = await supabase.rpc('get_rfq_complete', { p_rfq_id: id })

      if (error) {
        console.warn('[SupabaseRFQRepository] get_rfq_complete RPC error, falling back:', error)
      } else if (data) {
        json = typeof data === 'string' ? JSON.parse(data) : data
      }
    } catch (e) {
      console.warn('[SupabaseRFQRepository] get_rfq_complete threw exception, falling back:', e)
    }

    if (!json) {
      json = await this.fetchRfqCompleteFallback(id)
      if (!json) {
        console.error('[SupabaseRFQRepository] Fallback also returned null')
        return null
      }
    }

    const reporterId = json.reporterId || json.reporter_id
    const assigneeId = json.assigneeId || json.assignee_id

    const [reporterData, assigneeData, timelineData, metadataData, rfqBaseData] = await Promise.all([
      supabase.from('users').select('*').eq('id', reporterId).single(),
      assigneeId ? supabase.from('users').select('*').eq('id', assigneeId).maybeSingle() : Promise.resolve({ data: null }),
      supabase
        .from('rfq_timeline_events')
        .select('*')
        .eq('rfq_id', id)
        .order('timestamp', { ascending: false }),
      supabase.from('rfq_metadata').select('key, value').eq('rfq_id', id),
      supabase.from('rfqs').select('unread_updates, due_date').eq('id', id).single(),
    ])

    const reporter = reporterData.data ? mapDbUserToUser(reporterData.data) : undefined
    const assignee = assigneeData.data ? mapDbUserToUser(assigneeData.data) : undefined

    let timeline: ReturnType<typeof mapDbTimelineEvent>[] = []
    if (timelineData.data && timelineData.data.length > 0) {
      timeline = timelineData.data.map(mapDbTimelineEvent)
      console.log('[SupabaseRFQRepository] Loaded', timeline.length, 'timeline events from table')
    } else {
      const rawTimeline = json.timeline as Record<string, unknown>[] | undefined
      if (rawTimeline && rawTimeline.length > 0) {
        timeline = rawTimeline.map(mapDbTimelineEvent)
        console.log('[SupabaseRFQRepository] Loaded', timeline.length, 'timeline events from RPC json')
      } else {
        timeline = generateFallbackTimeline(json)
        console.log('[SupabaseRFQRepository] Generated', timeline.length, 'fallback timeline events for RFQ', id)
      }
    }

    const metadata: Record<string, string | number | boolean> = {}
    if (metadataData.data) {
      for (const row of metadataData.data) {
        metadata[row.key] = row.value
      }
    }

    const unreadUpdates = Number(rfqBaseData.data?.unread_updates ?? 0)
    const dueDate = rfqBaseData.data?.due_date

    if (dueDate) {
      json.dueDate = dueDate
    }

    if (!reporter) {
      console.error('[SupabaseRFQRepository] Reporter user not found for RFQ', id)
      throw new Error(`Reporter user not found for RFQ ${id}`)
    }

    const result = mapCompleteRfqJsonToRFQ(json, reporter, assignee, timeline, metadata, unreadUpdates)

    return result
  }

  private async fetchRfqCompleteFallback(id: string): Promise<Record<string, unknown> | null> {
    const { data: rfqData, error: rfqError } = await supabase
      .from('rfqs')
      .select('*, clients(name, contact_name, email)')
      .eq('id', id)
      .single()

    if (rfqError || !rfqData) {
      console.error('[SupabaseRFQRepository] Fallback RFQ query failed:', rfqError)
      return null
    }

    const client = rfqData.clients as { name: string; contact_name: string | null; email: string | null } | null

    const [itemsData, tagsData, docsData, reqsData, recsData, quotesData, timelineData] = await Promise.all([
      supabase.from('rfq_items').select('*').eq('rfq_id', id).order('line_number'),
      supabase.from('rfq_tags').select('tag_name').eq('rfq_id', id),
      supabase.from('rfq_documents').select('*').eq('rfq_id', id),
      supabase.from('rfq_requirements').select('*').eq('rfq_id', id),
      supabase.from('vendor_recommendations').select('*, vendors(name, location)').eq('rfq_id', id).order('ranking'),
      supabase.from('vendor_quotes').select('*, vendors(name)').eq('rfq_id', id),
      supabase.from('rfq_timeline_events').select('*').eq('rfq_id', id).order('timestamp', { ascending: false }),
    ])

    console.log('[SupabaseRFQRepository] Fallback recsData:', recsData.data?.length ?? 0, 'records')

    return {
      id: rfqData.id,
      rfqNumber: rfqData.rfq_number,
      clientName: client?.name,
      clientContact: client?.contact_name,
      clientEmail: client?.email,
      reporterId: rfqData.reporter_id,
      assigneeId: rfqData.assignee_id,
      priority: rfqData.priority,
      stage: rfqData.stage,
      status: rfqData.status,
      slaStatus: rfqData.sla_status,
      slaDeadline: rfqData.sla_deadline,
      deliveryLocation: rfqData.delivery_location,
      totalQuantity: rfqData.total_quantity,
      quantityUnit: rfqData.quantity_unit,
      aiConfidenceScore: rfqData.ai_confidence_score,
      notes: rfqData.notes,
      createdAt: rfqData.created_at,
      updatedAt: rfqData.updated_at,
      lastActivityAt: rfqData.last_activity_at,
      items: itemsData.data || [],
      tags: (tagsData.data || []).map((t: { tag_name: string }) => t.tag_name),
      documents: docsData.data || [],
      requirements: reqsData.data || [],
      recommendations: (recsData.data || []).map((r: Record<string, unknown>) => ({
        ...r,
        vendorName: (r.vendors as { name: string })?.name || 'Unknown',
        vendorLocation: (r.vendors as { location: string })?.location || '',
      })),
      quotes: (quotesData.data || []).map((q: Record<string, unknown>) => ({
        ...q,
        vendorName: (q.vendors as { name: string })?.name || 'Unknown',
      })),
      timeline: timelineData.data || [],
    }
  }

  async updateRfqStage(rfqId: string, stage: string): Promise<void> {
    const { error } = await supabase
      .from('rfqs')
      .update({ stage, updated_at: new Date().toISOString() })
      .eq('id', rfqId)

    if (error) {
      console.error('[SupabaseRFQRepository] updateRfqStage error:', error)
      throw error
    }
  }

  async markAsRead(rfqId: string): Promise<void> {
    const { error } = await supabase
      .from('rfqs')
      .update({ unread_updates: 0, updated_at: new Date().toISOString() })
      .eq('id', rfqId)

    if (error) {
      console.error('[SupabaseRFQRepository] markAsRead error:', error)
      throw error
    }
  }

  subscribeToRfqChanges(callback: (rfqs: RFQ[]) => void): () => void {
    const channel = supabase
      .channel('rfq-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rfqs' },
        async () => {
          const rfqs = await this.fetchAllRfqs()
          callback(rfqs)
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vendor_quotes' },
        async () => {
          const rfqs = await this.fetchAllRfqs()
          callback(rfqs)
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rfq_timeline_events' },
        async () => {
          const rfqs = await this.fetchAllRfqs()
          callback(rfqs)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }
}

export const rfqRepository = new SupabaseRFQRepository()
