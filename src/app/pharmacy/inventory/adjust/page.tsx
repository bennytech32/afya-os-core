'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function StockAdjustmentPage() {
  const supabase = createClient()
  const router = useRouter()
  const [inventory, setInventory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const [adjustment, setAdjustment] = useState({
    item_id: '',
    quantity: '',
    reason: 'Damaged' // 'Expired', 'Damaged', 'Correction'
  })

  useEffect(() => {
    const fetchItems = async () => {
      const { data } = await supabase.from('inventory').select('id, item_name, stock_quantity')
      setInventory(data || [])
    }
    fetchItems()
  }, [])

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const selectedItem = inventory.find(i => i.id === adjustment.item_id)
    if (!selectedItem) return

    const newQuantity = selectedItem.stock_quantity - parseInt(adjustment.quantity)

    const { error } = await supabase
      .from('inventory')
      .update({ stock_quantity: newQuantity })
      .eq('id', adjustment.item_id)

    if (!error) {
      alert(`Stock adjusted! ${selectedItem.item_name} reduced by ${adjustment.quantity}`)
      router.push('/pharmacy/inventory')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Stock <span className="text-red-600">Adjustment</span></h1>
        
        <form onSubmit={handleAdjust} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-red-50 space-y-6">
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold leading-relaxed">
            ⚠️ Warning: Adjustments are logged. Use this for expired, damaged, or lost inventory only.
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Medication</label>
            <select 
              required
              className="w-full mt-1 p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm"
              value={adjustment.item_id}
              onChange={e => setAdjustment({...adjustment, item_id: e.target.value})}
            >
              <option value="">Choose item...</option>
              {inventory.map(item => (
                <option key={item.id} value={item.id}>{item.item_name} (Current: {item.stock_quantity})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity to Remove</label>
              <input 
                type="number" required
                className="w-full mt-1 p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm"
                value={adjustment.quantity}
                onChange={e => setAdjustment({...adjustment, quantity: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Reason</label>
              <select 
                className="w-full mt-1 p-4 bg-gray-50 border-none rounded-2xl outline-none font-bold text-sm"
                value={adjustment.reason}
                onChange={e => setAdjustment({...adjustment, reason: e.target.value})}
              >
                <option>Expired</option>
                <option>Damaged</option>
                <option>Theft/Lost</option>
                <option>Stock Correction</option>
              </select>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black shadow-lg hover:bg-black transition-all"
          >
            {loading ? 'Processing...' : 'CONFIRM STOCK DEDUCTION'}
          </button>
        </form>
      </div>
    </div>
  )
}