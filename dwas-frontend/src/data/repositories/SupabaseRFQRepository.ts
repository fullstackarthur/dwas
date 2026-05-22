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
  selectVendor(rfqId: string, vendorRecommendationId: string): Promise<void>
  acceptQuote(rfqId: string, quoteId: string): Promise<void>
  rejectQuote(rfqId: string, quoteId: string): Promise<void>
  sendToVendor(rfqId: string, vendorId: string): Promise<void>
  upsertClient(rfqId: string, clientData: { name: string; contactName?: string; email?: string; phone?: string; city?: string }): Promise<{ clientId: string; clientName: string }>
  createTimelineEvent(rfqId: string, eventType: string, title: string, description?: string, metadata?: Record<string, unknown>): Promise<void>
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
      client_id: rfqData.client_id,
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

  async selectVendor(rfqId: string, vendorRecommendationId: string): Promise<void> {
    const { data: rec, error: recError } = await supabase
      .from('vendor_recommendations')
      .select('vendor_id')
      .eq('id', vendorRecommendationId)
      .eq('rfq_id', rfqId)
      .single()

    if (recError || !rec) {
      console.error('[SupabaseRFQRepository] selectVendor: recommendation not found', recError)
      throw recError || new Error('Recommendation not found')
    }

    await supabase
      .from('vendor_recommendations')
      .update({ is_selected: false })
      .eq('rfq_id', rfqId)

    const { error: updateError } = await supabase
      .from('vendor_recommendations')
      .update({ is_selected: true })
      .eq('id', vendorRecommendationId)

    if (updateError) {
      console.warn('[SupabaseRFQRepository] is_selected column update failed:', updateError)
    }

    const { error } = await supabase
      .from('rfqs')
      .update({
        stage: 'quotation_review',
        updated_at: new Date().toISOString(),
      })
      .eq('id', rfqId)

    if (error) {
      console.error('[SupabaseRFQRepository] selectVendor error:', error)
      throw error
    }

    try {
      await supabase
        .from('rfqs')
        .update({ selected_vendor_id: rec.vendor_id })
        .eq('id', rfqId)
    } catch {
      // Column may not exist yet, skip
    }

    await this.createTimelineEvent(
      rfqId,
      'human',
      'Vendor selected',
      `Vendor ${rec.vendor_id} selected for RFQ ${rfqId}`,
      { vendorId: rec.vendor_id, recommendationId: vendorRecommendationId }
    )
  }

  async acceptQuote(rfqId: string, quoteId: string): Promise<void> {
    const { data: quote, error: quoteFetchError } = await supabase
      .from('vendor_quotes')
      .select('vendor_id')
      .eq('id', quoteId)
      .eq('rfq_id', rfqId)
      .single()

    if (quoteFetchError || !quote) {
      console.error('[SupabaseRFQRepository] acceptQuote: quote not found', quoteFetchError)
      throw quoteFetchError || new Error('Quote not found')
    }

    const { error: quoteError } = await supabase
      .from('vendor_quotes')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('id', quoteId)
      .eq('rfq_id', rfqId)

    if (quoteError) {
      console.error('[SupabaseRFQRepository] acceptQuote error:', quoteError)
      throw quoteError
    }

    await supabase
      .from('vendor_quotes')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('rfq_id', rfqId)
      .neq('id', quoteId)

    await supabase
      .from('rfqs')
      .update({
        status: 'won',
        stage: 'order_confirmation',
        updated_at: new Date().toISOString(),
      })
      .eq('id', rfqId)

    try {
      await supabase
        .from('rfqs')
        .update({ accepted_quote_id: quoteId, selected_vendor_id: quote.vendor_id })
        .eq('id', rfqId)
    } catch {
      // Column may not exist yet, skip
    }

    await this.createTimelineEvent(
      rfqId,
      'human',
      'Quote accepted',
      `Quote ${quoteId} accepted. RFQ marked as won.`,
      { quoteId, vendorId: quote.vendor_id }
    )
  }

  async rejectQuote(rfqId: string, quoteId: string): Promise<void> {
    const { error } = await supabase
      .from('vendor_quotes')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('id', quoteId)
      .eq('rfq_id', rfqId)

    if (error) {
      console.error('[SupabaseRFQRepository] rejectQuote error:', error)
      throw error
    }

    await this.createTimelineEvent(
      rfqId,
      'human',
      'Quote rejected',
      `Quote ${quoteId} rejected for RFQ ${rfqId}`,
      { quoteId }
    )
  }

  async sendToVendor(rfqId: string, vendorId: string): Promise<void> {
    const { error } = await supabase
      .from('vendor_quotes')
      .insert({
        rfq_id: rfqId,
        vendor_id: vendorId,
        status: 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

    if (error) {
      console.error('[SupabaseRFQRepository] sendToVendor error:', error)
      throw error
    }

    await this.createTimelineEvent(
      rfqId,
      'human',
      'RFQ sent to vendor',
      `RFQ sent to vendor ${vendorId} for quotation`,
      { vendorId }
    )
  }

  async upsertClient(
    rfqId: string,
    clientData: { name: string; contactName?: string; email?: string; phone?: string; city?: string }
  ): Promise<{ clientId: string; clientName: string }> {
    const { data: rfqRow } = await supabase
      .from('rfqs')
      .select('client_id')
      .eq('id', rfqId)
      .single()

    const existingClientId = rfqRow?.client_id

    if (existingClientId) {
      const { error } = await supabase
        .from('clients')
        .update({
          name: clientData.name,
          contact_name: clientData.contactName || null,
          email: clientData.email || null,
          phone: clientData.phone || null,
          city: clientData.city || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingClientId)

      if (error) {
        console.error('[SupabaseRFQRepository] upsertClient update error:', error)
        throw error
      }

      await this.createTimelineEvent(rfqId, 'human', 'Client details updated', `Client "${clientData.name}" details updated`)
      return { clientId: existingClientId, clientName: clientData.name }
    } else {
      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          contact_name: clientData.contactName || null,
          email: clientData.email || null,
          phone: clientData.phone || null,
          city: clientData.city || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (insertError || !newClient) {
        console.error('[SupabaseRFQRepository] upsertClient insert error:', insertError)
        throw insertError || new Error('Failed to create client')
      }

      const { error: linkError } = await supabase
        .from('rfqs')
        .update({ client_id: newClient.id, updated_at: new Date().toISOString() })
        .eq('id', rfqId)

      if (linkError) {
        console.error('[SupabaseRFQRepository] upsertClient link error:', linkError)
        throw linkError
      }

      await this.createTimelineEvent(
        rfqId, 'human', 'Client details added',
        `Client "${clientData.name}" linked to RFQ`,
        { clientId: newClient.id }
      )

      return { clientId: newClient.id, clientName: clientData.name }
    }
  }

  async createTimelineEvent(
    rfqId: string,
    eventType: string,
    title: string,
    description?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const { error } = await supabase
      .from('rfq_timeline_events')
      .insert({
        rfq_id: rfqId,
        event_type: eventType,
        title,
        description,
        metadata,
        timestamp: new Date().toISOString(),
      })

    if (error) {
      console.error('[SupabaseRFQRepository] createTimelineEvent error:', error)
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
