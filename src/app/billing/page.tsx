'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function BillingInterface() {
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
    fetchBills(); alert("Malipo yamefanikiwa! Mgonjwa ameruhusiwa kurejea nyumbani.")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-4xl font-black mb-10 tracking-tighter italic">Billing & <span className="text-yellow-600">Payments</span></h1>
      <div className="grid gap-4">
        {bills.map(b => (
          <div key={b.id} className="bg-white p-8 rounded-[2.5rem] flex justify-between items-center shadow-xl shadow-gray-200/50 border border-gray-100">
            <div>
              <p className="font-bold text-xl">{b.patients.full_name}</p>
              <p className="text-gray-400 font-mono text-sm tracking-widest">INV#{b.id.substring(0,6).toUpperCase()}</p>
            </div>
            <div className="flex items-center gap-10">
              <p className="text-2xl font-black text-gray-900">TZS {b.total_amount.toLocaleString()}</p>
              <button onClick={() => pay(b.id, b.patient_id)} className="bg-gray-900 text-white px-10 py-4 rounded-3xl font-black transition-all hover:bg-black active:scale-95">Collect Payment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}