export const dynamic = 'force-dynamic'

'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DoctorRoom() {
  const supabase = createClient()
  const [queue, setQueue] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [labResults, setLabResults] = useState<any[]>([])

  const fetchData = async () => {
    const { data } = await supabase.from('patients').select('*').eq('current_department', 'Consultation')
    setQueue(data || [])
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (selected?.id) {
      const fetchResults = async () => {
        const { data } = await supabase.from('lab_results').select('*').eq('patient_id', selected.id).order('created_at', { ascending: false })
        setLabResults(data || [])
      }
      fetchResults()
    }
  }, [selected?.id])

  const movePatient = async (dept: string) => {
    if (!selected?.id) return
    await supabase.from('patients').update({ current_department: dept }).eq('id', selected.id)
    setSelected(null); fetchData(); alert(`Patient moved to ${dept}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-1/4 bg-white border-r p-6">
        <h2 className="font-black text-blue-800 mb-6">Doctor's Queue</h2>
        {queue.map(p => (
          <button key={p.id} onClick={() => setSelected(p)} className={`w-full text-left p-4 mb-2 rounded-2xl border-2 transition-all ${selected?.id === p.id ? 'border-blue-600 bg-blue-50' : 'border-transparent bg-gray-50'}`}>
            <p className="font-bold">{p.full_name}</p>
          </button>
        ))}
      </div>
      <div className="flex-1 p-10">
        {selected ? (
          <div className="max-w-2xl space-y-6">
            <h1 className="text-3xl font-black">{selected.full_name}</h1>
            <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
              <h3 className="font-black text-purple-800 text-xs uppercase mb-2">Vipimo / Lab Results</h3>
              {labResults.map(r => <p key={r.id} className="text-sm font-bold">🔬 {r.test_name}: {r.result_value}</p>)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => movePatient('Laboratory')} className="bg-purple-600 text-white py-4 rounded-2xl font-black">Order Lab</button>
              <button onClick={() => movePatient('Pharmacy')} className="bg-green-600 text-white py-4 rounded-2xl font-black">Send to Pharmacy</button>
            </div>
          </div>
        ) : <p className="text-gray-400 font-bold">Select a patient to begin.</p>}
      </div>
    </div>
  )
}