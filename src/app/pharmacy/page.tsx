export const dynamic = 'force-dynamic'

'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PharmacyPage() {
  const supabase = createClient()
  const [queue, setQueue] = useState<any[]>([])
  const [inventory, setInventory] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [drugId, setDrugId] = useState('')

  const loadData = async () => {
    const { data: p } = await supabase.from('patients').select('*').eq('current_department', 'Pharmacy')
    const { data: i } = await supabase.from('inventory').select('*')
    setQueue(p || []); setInventory(i || [])
  }

  useEffect(() => { loadData() }, [])

  const dispense = async () => {
    const drug = inventory.find(d => d.id === drugId)
    if (!drug || !selected) return
    await supabase.from('inventory').update({ stock_quantity: drug.stock_quantity - 1 }).eq('id', drug.id)
    await supabase.from('invoices').insert([{ patient_id: selected.id, total_amount: drug.unit_price, status: 'unpaid' }])
    await supabase.from('patients').update({ current_department: 'Billing' }).eq('id', selected.id)
    setSelected(null); loadData(); alert("Dispensed & Billed!")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="w-1/4 bg-white border-r p-6">
        <h2 className="font-black text-green-700 mb-6 uppercase text-xs">Pharmacy Queue</h2>
        {queue.map(p => (
          <button key={p.id} onClick={() => setSelected(p)} className="w-full text-left p-4 mb-2 bg-gray-50 rounded-2xl font-bold">{p.full_name}</button>
        ))}
      </div>
      <div className="flex-1 p-10">
        {selected && (
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-black">Dispense for: {selected.full_name}</h1>
            <select className="w-full p-4 rounded-xl ring-1 ring-gray-200" onChange={e => setDrugId(e.target.value)}>
              <option>Select Drug...</option>
              {inventory.map(d => <option key={d.id} value={d.id}>{d.item_name} (Stock: {d.stock_quantity})</option>)}
            </select>
            <button onClick={dispense} className="w-full bg-green-600 text-white py-4 rounded-xl font-black">Confirm Dispense</button>
          </div>
        )}
      </div>
    </div>
  )
}