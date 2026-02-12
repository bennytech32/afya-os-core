'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface VitalsFormProps {
  patientId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function VitalsForm({ patientId, onSuccess, onCancel }: VitalsFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    heart_rate: '',
    temperature: '',
    weight: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Convert strings to numbers for the DB
    const payload = {
      patient_id: patientId,
      systolic: formData.systolic ? parseInt(formData.systolic) : null,
      diastolic: formData.diastolic ? parseInt(formData.diastolic) : null,
      heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
      temperature: formData.temperature ? parseFloat(formData.temperature) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
    }

    const { error } = await supabase.from('vitals').insert([payload])

    if (error) {
      alert('Error saving vitals: ' + error.message)
    } else {
      alert('Vitals Recorded Successfully!')
      if (onSuccess) onSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-blue-100 shadow-lg mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Record New Vitals</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {/* Blood Pressure */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase">BP Systolic</label>
            <input name="systolic" type="number" placeholder="120" className="w-full p-2 border rounded" onChange={handleChange} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase">BP Diastolic</label>
            <input name="diastolic" type="number" placeholder="80" className="w-full p-2 border rounded" onChange={handleChange} />
          </div>

          {/* Heart Rate */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase">Heart Rate</label>
            <input name="heart_rate" type="number" placeholder="BPM" className="w-full p-2 border rounded" onChange={handleChange} />
          </div>

          {/* Temp */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase">Temp (°C)</label>
            <input name="temperature" type="number" step="0.1" placeholder="36.5" className="w-full p-2 border rounded" onChange={handleChange} />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase">Weight (kg)</label>
            <input name="weight" type="number" step="0.1" placeholder="70.5" className="w-full p-2 border rounded" onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Vitals'}
          </button>
        </div>
      </form>
    </div>
  )
}