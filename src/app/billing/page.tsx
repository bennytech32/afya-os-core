export const dynamic = 'force-dynamic'

'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BillingPage() {
  const supabase = createClient()
  const [bills, setBills] = useState<any[]>([])

  const fetchBills = async () => {
    const { data } = await supabase.from('invoices').select('*, patients(full_name)').eq('status', 'unpaid')
    setBills(data || [])
  }

  useEffect(() => { fetchBills() }, [])

  const pay = async (id: string, pId: string) => {
    await supabase.from('invoices').update({ status: 'paid' }).eq('id', id)
    await supabase.from('patients').update({ current_department: 'Discharged' }).eq('id', pId)
    fetchBills(); alert("Payment Received!")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-black mb-8">Unpaid Invoices</h1>
      <div className="grid gap-4">
        {bills.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-2xl flex justify-between items-center shadow-sm border">
            <div>
              <p className="font-bold text-lg">{b.patients?.full_name}</p>
              <p className="text-blue-600 font-black">TZS {b.total_amount.toLocaleString()}</p>
            </div>
            <button onClick={() => pay(b.id, b.patient_id)} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold">Collect Cash</button>
          </div>
        ))}
      </div>
    </div>
  )
}