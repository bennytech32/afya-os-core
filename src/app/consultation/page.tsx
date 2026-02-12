'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DoctorRoom() {
  const supabase = createClient()
  
  // --- STATE MANAGEMENT ---
  const [queue, setQueue] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [labResults, setLabResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true)
    const { data: patients, error } = await supabase
      .from('patients')
      .select('*')
      .eq('current_department', 'Consultation')
    
    if (!error) setQueue(patients || [])
    setLoading(false)
  }

  const fetchResults = async (pId: string) => {
    if (!pId) return
    const { data } = await supabase
      .from('lab_results')
      .select('*')
      .eq('patient_id', pId)
      .order('created_at', { ascending: false })
    
    setLabResults(data || [])
  }

  // --- EFFECTS ---
  useEffect(() => {
    fetchData()
  }, [])

  // SAFE EFFECT: Only fetch results if 'selected' exists
  useEffect(() => {
    if (selected?.id) {
      fetchResults(selected.id)
    } else {
      setLabResults([])
    }
  }, [selected?.id])

  // --- ACTIONS ---
  const movePatient = async (dept: string) => {
    // GUARD CLAUSE: Stop if no patient is selected
    if (!selected?.id) {
      alert("Please select a patient from the queue first.")
      return
    }

    const { error } = await supabase
      .from('patients')
      .update({ current_department: dept })
      .eq('id', selected.id)

    if (!error) {
      alert(`Patient successfully moved to ${dept}`)
      setSelected(null) // Reset selection to prevent "null" errors
      fetchData() // Refresh the waiting list
    } else {
      alert("Error moving patient: " + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar: Patient Queue */}
      <div className="w-1/4 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm">
        <div className="mb-8">
          <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Clinical Queue</h2>
          <p className="text-2xl font-black text-gray-900 tracking-tighter">Waiting Room</p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-2">
          {loading ? (
            <p className="text-xs font-bold text-gray-400 animate-pulse">Syncing Patients...</p>
          ) : queue.length > 0 ? (
            queue.map(p => (
              <button 
                key={p.id} 
                onClick={() => setSelected(p)} 
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all group ${
                  selected?.id === p.id 
                  ? 'border-blue-600 bg-blue-50 shadow-md' 
                  : 'border-transparent bg-gray-50 hover:bg-white hover:border-blue-200'
                }`}
              >
                <p className={`font-black text-sm ${selected?.id === p.id ? 'text-blue-900' : 'text-gray-700'}`}>
                  {p.full_name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{p.gender}</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Age: {p.age}</span>
                </div>
              </button>
            ))
          ) : (
            <p className="text-sm font-medium text-gray-400 italic">Queue is currently empty.</p>
          )}
        </div>
      </div>

      {/* Main Content: Patient File */}
      <div className="flex-1 p-12">
        {selected ? (
          <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-8">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">{selected.full_name}</h1>
                <p className="text-gray-500 font-medium mt-1">File No: {selected.id.substring(0,8).toUpperCase()}</p>
              </div>
              <button 
                onClick={() => setSelected(null)} 
                className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest"
              >
                Close File &times;
              </button>
            </div>

            {/* Lab Results Section (Vipimo) */}
            <div className="bg-purple-50 p-8 rounded-[2.5rem] border border-purple-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl">🔬</span>
                <h3 className="font-black text-purple-900 uppercase text-xs tracking-widest">Lab Findings (Vipimo)</h3>
              </div>
              
              <div className="space-y-3">
                {labResults.length > 0 ? (
                  labResults.map(r => (
                    <div key={r.id} className="bg-white/60 p-4 rounded-xl border border-purple-200">
                      <p className="text-sm font-bold text-purple-900">{r.result_value}</p>
                      <p className="text-[10px] text-purple-400 font-medium mt-1 uppercase">Recorded: {new Date(r.created_at).toLocaleString()}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-4 px-2 border-2 border-dashed border-purple-200 rounded-2xl text-center">
                    <p className="text-xs italic text-purple-400 font-medium">No lab results available for this patient yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation / Action Buttons */}
            <div className="grid grid-cols-2 gap-6 pt-4">
              <button 
                onClick={() => movePatient('Laboratory')} 
                className="group flex flex-col items-center gap-2 bg-white border-2 border-purple-200 p-6 rounded-[2rem] hover:bg-purple-600 hover:border-purple-600 transition-all shadow-sm"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">🔬</span>
                <span className="font-black text-xs uppercase tracking-widest text-purple-600 group-hover:text-white">Order Lab Tests</span>
              </button>

              <button 
                onClick={() => movePatient('Pharmacy')} 
                className="group flex flex-col items-center gap-2 bg-white border-2 border-green-200 p-6 rounded-[2rem] hover:bg-green-600 hover:border-green-600 transition-all shadow-sm"
              >
                <span className="text-2xl group-hover:scale-125 transition-transform">💊</span>
                <span className="font-black text-xs uppercase tracking-widest text-green-600 group-hover:text-white">Prescribe Drugs</span>
              </button>
            </div>

            <button 
              onClick={() => movePatient('Discharged')} 
              className="w-full bg-gray-900 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-black shadow-xl shadow-gray-200 transition-all"
            >
              ✅ Complete & Discharge Patient
            </button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-3xl animate-bounce">🩺</div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900 tracking-tight">Clinical Workspace</p>
              <p className="text-sm text-gray-400 font-medium">Please select a patient from the queue to start the session.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}