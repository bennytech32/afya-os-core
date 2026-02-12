'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface VitalsListProps {
  patientId: string
  refreshKey?: number // This helps us trigger a reload when new data is added
}

export function VitalsList({ patientId, refreshKey }: VitalsListProps) {
  const supabase = createClient()
  const [vitals, setVitals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVitals = async () => {
      const { data, error } = await supabase
        .from('vitals')
        .select('*')
        .eq('patient_id', patientId)
        .order('recorded_at', { ascending: false }) // Newest on top

      if (error) {
        console.error('Error fetching vitals:', error)
      } else {
        setVitals(data || [])
      }
      setLoading(false)
    }

    fetchVitals()
  }, [patientId, refreshKey]) // Re-run when patientId OR refreshKey changes

  if (loading) return <div className="text-xs text-gray-500 mt-4">Loading history...</div>
  
  if (vitals.length === 0) {
    return <div className="text-sm text-gray-400 mt-4 italic">No history recorded.</div>
  }

  return (
    <div className="mt-6">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent History</h4>
      <div className="space-y-3">
        {vitals.map((record) => (
          <div key={record.id} className="bg-gray-50 border border-gray-100 rounded p-3 text-sm hover:bg-gray-100 transition-colors">
            <div className="flex justify-between text-gray-400 text-xs mb-1">
              <span>{new Date(record.recorded_at).toLocaleDateString()}</span>
              <span>{new Date(record.recorded_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-1">
              {record.systolic && (
                <div>
                  <span className="text-gray-500 text-xs">BP:</span> 
                  <span className="font-semibold text-gray-800 ml-1">
                    {record.systolic}/{record.diastolic}
                  </span>
                </div>
              )}
              
              {record.temperature && (
                <div>
                  <span className="text-gray-500 text-xs">Temp:</span>
                  <span className={`font-semibold ml-1 ${record.temperature > 37.5 ? 'text-red-600' : 'text-gray-800'}`}>
                    {record.temperature}°C
                  </span>
                </div>
              )}

              {record.heart_rate && (
                <div>
                  <span className="text-gray-500 text-xs">HR:</span>
                  <span className="font-semibold text-gray-800 ml-1">{record.heart_rate} bpm</span>
                </div>
              )}

              {record.weight && (
                 <div>
                  <span className="text-gray-500 text-xs">Wt:</span>
                  <span className="font-semibold text-gray-800 ml-1">{record.weight} kg</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}