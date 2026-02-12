'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface ConsultationFormProps {
  patientId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ConsultationForm({ patientId, onSuccess, onCancel }: ConsultationFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    chief_complaint: '',
    diagnosis: '',
    prescription: '',
    notes: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      patient_id: patientId,
      ...formData
    }

    const { error } = await supabase.from('consultations').insert([payload])

    if (error) {
      alert('Error saving consultation: ' + error.message)
    } else {
      alert('Consultation Saved!')
      if (onSuccess) onSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-green-100 shadow-lg mt-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">New Consultation</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Chief Complaint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint (Required)</label>
          <input 
            name="chief_complaint" 
            required
            placeholder="e.g. Severe headache and fever" 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none" 
            onChange={handleChange} 
          />
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
          <input 
            name="diagnosis" 
            placeholder="e.g. Malaria PF+" 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none" 
            onChange={handleChange} 
          />
        </div>

        {/* Prescription */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prescription / Plan</label>
          <textarea 
            name="prescription" 
            rows={3}
            placeholder="e.g. ALU 6 tabs, Paracetamol 1g TDS" 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none" 
            onChange={handleChange} 
          />
        </div>

        {/* Internal Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Clinical Notes</label>
          <textarea 
            name="notes" 
            rows={2}
            placeholder="Additional observations..." 
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 outline-none" 
            onChange={handleChange} 
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 text-sm font-medium bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : 'Finalize Consultation'}
          </button>
        </div>
      </form>
    </div>
  )
}