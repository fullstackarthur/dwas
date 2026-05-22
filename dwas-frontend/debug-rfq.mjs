import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://plszjvdswsksskbnexbw.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsc3pqdmRzd3Nrc3NrYm5leGJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM0MDg4NywiZXhwIjoyMDk0OTE2ODg3fQ.aLYXXVrG6szxHIRwu9ZS8PglFOk8fpmfbB9kZkaEYZ0'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function main() {
  console.log('\n========== RAW rfqs TABLE ==========')
  const { data: rfqsRaw, error: rfqsErr } = await supabase
    .from('rfqs')
    .select('*')
    .order('created_at', { ascending: false })

  if (rfqsErr) {
    console.error('ERROR fetching rfqs table:', rfqsErr)
  } else {
    console.log(`Total rows in rfqs table: ${rfqsRaw.length}`)
    rfqsRaw.forEach((r, i) => {
      console.log(`\n[${i + 1}] id=${r.id} | rfq_number=${r.rfq_number} | stage=${r.stage} | status=${r.status} | priority=${r.priority} | reporter_id=${r.reporter_id} | assignee_id=${r.assignee_id}`)
    })
  }

  console.log('\n========== rfq_summary VIEW ==========')
  const { data: summaryData, error: summaryErr } = await supabase
    .from('rfq_summary')
    .select('*')
    .order('created_at', { ascending: false })

  if (summaryErr) {
    console.error('ERROR fetching rfq_summary view:', JSON.stringify(summaryErr, null, 2))
    console.log('\n>>> rfq_summary view may not exist or has an error.')
  } else {
    console.log(`Total rows in rfq_summary view: ${summaryData.length}`)
    summaryData.forEach((r, i) => {
      console.log(`\n[${i + 1}] id=${r.id} | rfq_number=${r.rfq_number} | client_name=${r.client_name} | stage=${r.stage} | status=${r.status} | priority=${r.priority} | reporter_id=${r.reporter_id} | reporter_name=${r.reporter_name} | sla_status=${r.sla_status} | recommendation_count=${r.recommendation_count}`)
    })

    if (summaryData.length > 0) {
      console.log('\n--- First row full detail (column names check) ---')
      console.log(JSON.stringify(summaryData[0], null, 2))
    }
  }

  console.log('\n========== rfq_summary COLUMN NAMES ==========')
  if (!summaryErr && summaryData.length > 0) {
    console.log('Columns present in rfq_summary:', Object.keys(summaryData[0]).join(', '))
  }

  console.log('\n========== EXPECTED COLUMNS (by mapper) ==========')
  const expectedCols = ['id','rfq_number','client_name','reporter_id','reporter_name','assignee_id','assignee_name','priority','stage','status','sla_status','sla_deadline','total_quantity','delivery_location','ai_confidence_score','recommendation_count','unread_updates','created_at','updated_at','last_activity_at','selected_vendor_id','accepted_quote_id']
  console.log('Expected:', expectedCols.join(', '))

  if (!summaryErr && summaryData.length > 0) {
    const actualCols = Object.keys(summaryData[0])
    const missing = expectedCols.filter(c => !actualCols.includes(c))
    const extra = actualCols.filter(c => !expectedCols.includes(c))
    console.log('\nMISSING from view (mapper will get undefined):', missing.length ? missing.join(', ') : 'none')
    console.log('EXTRA in view (unused):', extra.length ? extra.join(', ') : 'none')
  }
}

main().catch(console.error)
