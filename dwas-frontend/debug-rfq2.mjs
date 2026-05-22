import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://plszjvdswsksskbnexbw.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsc3pqdmRzd3Nrc3NrYm5leGJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM0MDg4NywiZXhwIjoyMDk0OTE2ODg3fQ.aLYXXVrG6szxHIRwu9ZS8PglFOk8fpmfbB9kZkaEYZ0'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function main() {
  console.log('\n=== CURRENT rfq_summary VIEW DEFINITION ===')
  const { data: viewDef, error: viewErr } = await supabase.rpc('get_view_definition', { view_name: 'rfq_summary' }).single()
  if (viewErr) {
    // Try direct pg_get_viewdef
    const { data, error } = await supabase
      .from('information_schema.views')
      .select('view_definition')
      .eq('table_name', 'rfq_summary')
      .single()
    if (error) {
      console.error('Could not get view def via info schema:', error)
    } else {
      console.log(data?.view_definition)
    }
  } else {
    console.log(viewDef)
  }

  console.log('\n=== clients TABLE SCHEMA ===')
  const { data: clients, error: clientsErr } = await supabase
    .from('clients')
    .select('*')
    .limit(3)
  if (clientsErr) {
    console.error('clients table error:', clientsErr)
  } else {
    console.log('Sample clients:', JSON.stringify(clients, null, 2))
    if (clients.length > 0) {
      console.log('Client columns:', Object.keys(clients[0]).join(', '))
    }
  }

  console.log('\n=== ORPHANED RFQs (missing client) ===')
  const { data: orphaned, error: orphanedErr } = await supabase
    .from('rfqs')
    .select('id, rfq_number, client_id, stage, status, priority, created_at')
    .order('created_at', { ascending: false })
  if (!orphanedErr && orphaned) {
    // Get all client ids that exist
    const { data: clientIds } = await supabase.from('clients').select('id')
    const existingIds = new Set((clientIds || []).map(c => c.id))
    const missing = orphaned.filter(r => !existingIds.has(r.client_id))
    console.log(`${missing.length} RFQs with missing client records:`)
    missing.forEach((r, i) => {
      console.log(`  [${i+1}] rfq_number=${r.rfq_number} | client_id=${r.client_id} | stage=${r.stage}`)
    })
  }
}

main().catch(console.error)
