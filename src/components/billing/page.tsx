'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function CashierDashboard() {
  const supabase = createClient()
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInvoices = async () => {
    // Fetch invoices + patient details
    const { data, error } = await supabase
      .from('invoices')
      .select(`*, patients (first_name, last_name)`)
      .eq('status', 'pending') // Only show unpaid bills
      .order('created_at', { ascending: false })

    if (error) console.error(error)
    else setInvoices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  const handleMarkPaid = async (id: string) => {
    const { error } = await supabase
      .from('invoices')
      .update({ status: 'paid' })
      .eq('id', id)

    if (error) {
      alert('Error updating invoice')
    } else {
      // Remove from list
      setInvoices(prev => prev.filter(inv => inv.id !== id))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Cashier Dashboard (Malipo)</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
        </div>

        {loading ? <p>Loading pending bills...</p> : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center text-gray-400">No pending bills.</td></tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {inv.patients.first_name} {inv.patients.last_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{inv.description}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        {inv.amount.toLocaleString()} TZS
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 capitalize">{inv.payment_method.replace('_', ' ')}</td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleMarkPaid(inv.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors"
                        >
                          Confirm Payment
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}