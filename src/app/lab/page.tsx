export const dynamic = 'force-dynamic'

'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LabPage() {
  const supabase = createClient()
  const [queue, setQueue] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [testName, setTestName] = useState('')
  const [testPrice, setTestPrice] = useState(0)
  const [findings, setFindings] = useState('')

  const loadData = async () => {
    const { data: p } = await supabase.from('patients').select('*').eq('current_department', 'Laboratory')
    const { data: s } = await supabase.from('lab_services').select('*')
    setQueue(p || []); setServices(s || [])
  }

  useEffect(() => { loadData() }, [])

  const submitResults = async () => {
    if (!selected?.id) return
    await supabase.from('lab_results').insert([{ patient_id: selected.id, test_name: testName, result_value: findings, cost: testPrice }])
    await supabase.from('invoices').insert([{ patient_id: selected.id, total_amount: testPrice, status: 'unpaid' }])
    await supabase.from('patients').update({ current_department: 'Consultation' }).eq('id', selected.id)
    setSelected(null); setFindings(''); loadData(); alert("Results sent!")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-1/4 bg-white border-r p-6">
        <h2 className="font-black text-purple-700 mb-6 uppercase text-xs">Lab Queue</h2>
        {queue.map(p => (
          <button key={p.id} onClick={() => setSelected(p)} className="w-full text-left p-4 mb-2 bg-gray-50 rounded-2xl font-bold">{p.full_name}</button>
        ))}
      </div>
      <div className="flex-1 p-10">
        {selected && (
          <div className="max-w-xl space-y-4">
            <h1 className="text-2xl font-black">Record Findings: {selected.full_name}</h1>
            <select className="w-full p-4 rounded-xl ring-1 ring-gray-200" onChange={e => {
              const s = services.find(x => x.test_name === e.target.value);
              setTestName(s?.test_name || ''); setTestPrice(s?.price || 0);
            }}>
              <option>Select Test...</option>
              {services.map(s => <option key={s.id} value={s.test_name}>{s.test_name} (TZS {s.price})</option>)}
            </select>
            <textarea placeholder="Matokeo..." className="w-full h-40 p-4 rounded-xl ring-1 ring-gray-200" value={findings} onChange={e => setFindings(e.target.value)} />
            <button onClick={submitResults} className="w-full bg-purple-600 text-white py-4 rounded-xl font-black">Submit & Back to Doctor</button>
          </div>
        )}
      </div>
    </div>
  )
}