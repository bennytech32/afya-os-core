'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LabInterface() {
  const supabase = createClient()
  
  const [queue, setQueue] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([]) // For templates
  const [selected, setSelected] = useState<any>(null)
  
  // Form State
  const [testName, setTestName] = useState('')
  const [testPrice, setTestPrice] = useState(0)
  const [findings, setFindings] = useState('')

  const loadData = async () => {
    const { data: p } = await supabase.from('patients').select('*').eq('current_department', 'Laboratory')
    const { data: s } = await supabase.from('lab_services').select('*').order('test_name')
    setQueue(p || [])
    setServices(s || [])
  }

  useEffect(() => { loadData() }, [])

  // When a template is picked, update the name and price automatically
  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const service = services.find(s => s.test_name === e.target.value)
    if (service) {
      setTestName(service.test_name)
      setTestPrice(service.price)
    }
  }

  const submitResults = async () => {
    if (!selected?.id || !testName) return

    // 1. Save Lab Result with Price
    const { error: labError } = await supabase.from('lab_results').insert([{ 
      patient_id: selected.id, 
      test_name: testName, 
      result_value: findings,
      cost: testPrice,
      status: 'completed'
    }])

    // 2. Auto-generate Invoice for this test
    await supabase.from('invoices').insert([{
      patient_id: selected.id,
      total_amount: testPrice,
      status: 'unpaid'
    }])

    // 3. Move back to Consultation
    await supabase.from('patients').update({ current_department: 'Consultation' }).eq('id', selected.id)

    if (!labError) {
      alert(`Results for ${testName} sent! Bill of TZS ${testPrice.toLocaleString()} generated.`);
      setFindings(''); setSelected(null); loadData()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r p-6">
        <h2 className="text-xl font-black text-purple-700 mb-6 uppercase tracking-tighter">🔬 Lab Queue</h2>
        <div className="space-y-2">
          {queue.map(p => (
            <button key={p.id} onClick={() => setSelected(p)} className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selected?.id === p.id ? 'border-purple-600 bg-purple-50' : 'border-transparent bg-gray-50'}`}>
              <p className="font-bold text-sm">{p.full_name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Workspace */}
      <div className="flex-1 p-12">
        {selected ? (
          <div className="max-w-xl space-y-6">
            <h1 className="text-3xl font-black">Laboratory <span className="text-purple-600">Entry</span></h1>
            
            <div className="space-y-4">
              {/* Template Selection */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Test Template</label>
                <select onChange={handleTemplateChange} className="w-full mt-1 p-4 bg-white ring-1 ring-gray-200 rounded-2xl font-bold focus:ring-2 focus:ring-purple-600 outline-none">
                  <option value="">-- Choose a Standard Test --</option>
                  {services.map(s => <option key={s.id} value={s.test_name}>{s.test_name} (TZS {s.price.toLocaleString()})</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Investigation Findings</label>
                <textarea 
                  placeholder="Enter findings here..." 
                  className="w-full h-40 p-4 bg-white ring-1 ring-gray-200 rounded-2xl font-medium focus:ring-2 focus:ring-purple-600 outline-none"
                  value={findings} onChange={e => setFindings(e.target.value)}
                />
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 flex justify-between items-center">
                <span className="text-xs font-bold text-purple-800 uppercase">Service Charge:</span>
                <span className="text-lg font-black text-purple-900">TZS {testPrice.toLocaleString()}</span>
              </div>
            </div>

            <button onClick={submitResults} className="w-full bg-purple-600 text-white py-5 rounded-3xl font-black shadow-lg shadow-purple-100 transition-all active:scale-95">
              Confirm & Send to Doctor
            </button>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center border-2 border-dashed rounded-[3rem] text-gray-400 font-bold">
            Select a patient to begin investigation
          </div>
        )}
      </div>
    </div>
  )
}