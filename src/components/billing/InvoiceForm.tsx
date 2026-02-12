'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface InvoiceFormProps {
  patientId: string
  onSuccess?: () => void
}

export function InvoiceForm({ patientId, onSuccess }: InvoiceFormProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: '',
    description: 'Consultation Fee',
    payment_method: 'cash'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.from('invoices').insert([{
      patient_id: patientId,
      amount: parseFloat(formData.amount),
      description: formData.description,
      payment_method: formData.payment_method,
      status: 'pending'
    }])

    if (error) {
      alert('Error creating invoice: ' + error.message)
    } else {
      alert('Invoice Generated!')
      setFormData({ amount: '', description: 'Consultation Fee', payment_method: 'cash' }) // Reset
      if (onSuccess) onSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-yellow-200 mt-4">
      <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Generate Bill</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        
        <div>
          <label className="block text-xs font-medium text-gray-500">Service Description</label>
          <input 
            type="text" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-500">Amount (TZS)</label>
            <input 
              type="number" 
              required
              placeholder="e.g. 10000"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full p-2 border rounded text-sm font-semibold"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500">Method</label>
            <select 
              value={formData.payment_method}
              onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
              className="w-full p-2 border rounded text-sm bg-white"
            >
              <option value="cash">Cash</option>
              <option value="mobile_money">M-Pesa / Tigo</option>
              <option value="insurance">Insurance</option>
              <option value="nhif">NHIF</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded text-sm transition-colors"
        >
          {loading ? 'Generating...' : 'Create Invoice'}
        </button>
      </form>
    </div>
  )
}