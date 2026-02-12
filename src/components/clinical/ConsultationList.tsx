'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ConsultationListProps {
  patientId: string
  refreshKey?: number
}

export function ConsultationList({ patientId, refreshKey }: ConsultationListProps) {
  const supabase = createClient()
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notes:', error)
      } else {
        setNotes(data || [])
      }
      setLoading(false)
    }

    fetchNotes()
  }, [patientId, refreshKey])

  const openPrintReport = (id: string) => {
    window.open(`/print/report/${id}`, '_blank', 'width=800,height=900')
  }

  if (loading) return <div className="text-xs text-gray-500 mt-4 animate-pulse">Loading clinical history...</div>
  
  if (notes.length === 0) {
    return (
      <div className="text-sm text-gray-400 mt-8 italic text-center py-10 border-2 border-dashed border-gray-100 rounded-lg">
        No consultation records found for this patient.
      </div>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {notes.map((note) => (
        <div key={note.id} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden">
          <div className="flex justify-between items-center bg-gray-50 px-4 py-2 border-b border-gray-100">
             <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
              Visit: {new Date(note.created_at).toLocaleDateString()}
            </span>
            <button 
              onClick={() => openPrintReport(note.id)}
              className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
              title="Print Medical Report"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </button>
          </div>
          
          <div className="p-4 space-y-3">
            <div>
              <h4 className="font-black text-gray-900 text-base">{note.chief_complaint}</h4>
              {note.diagnosis && (
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-bold text-blue-600">Diagnosis:</span> {note.diagnosis}
                </p>
              )}
            </div>

            {note.prescription && (
              <div className="bg-green-50 p-3 rounded-lg text-green-800 border border-green-100">
                <span className="font-bold block text-xs uppercase text-green-600 mb-1 tracking-widest">
                  Rx / Treatment Plan:
                </span>
                <p className="text-sm font-medium whitespace-pre-wrap">{note.prescription}</p>
              </div>
            )}
            
            {note.notes && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded italic">
                {note.notes}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}