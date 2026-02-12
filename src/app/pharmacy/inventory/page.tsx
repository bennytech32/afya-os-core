'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function StockManagerPage() {
  const supabase = createClient()
  const [inventory, setInventory] = useState<any[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newItem, setNewItem] = useState({ item_name: '', category: 'Tablet', stock_quantity: 0, unit_price: 0 })

  const fetchInventory = async () => {
    const { data } = await supabase.from('inventory').select('*').order('item_name', { ascending: true })
    setInventory(data || [])
  }

  useEffect(() => { fetchInventory() }, [])

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('inventory').insert([newItem])
    if (!error) {
      setNewItem({ item_name: '', category: 'Tablet', stock_quantity: 0, unit_price: 0 })
      setIsAdding(false)
      fetchInventory()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Pharmacy <span className="text-green-600">Inventory</span></h1>
          <div className="flex gap-4">
            <Link href="/pharmacy" className="text-sm font-bold text-gray-500 hover:text-black py-2">Back to Dispensing</Link>
            <button 
              onClick={() => setIsAdding(!isAdding)}
              className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-green-100"
            >
              {isAdding ? 'Close Form' : '+ Add New Stock'}
            </button>
          </div>
        </div>

        {isAdding && (
          <form onSubmit={handleAddItem} className="bg-white p-8 rounded-3xl border border-green-100 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Medication Name</label>
              <input required value={newItem.item_name} onChange={e => setNewItem({...newItem, item_name: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none border-none text-sm font-bold" placeholder="e.g. Panadol" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Quantity</label>
              <input type="number" required value={newItem.stock_quantity} onChange={e => setNewItem({...newItem, stock_quantity: parseInt(e.target.value)})} className="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none border-none text-sm font-bold" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (TZS)</label>
              <input type="number" required value={newItem.unit_price} onChange={e => setNewItem({...newItem, unit_price: parseFloat(e.target.value)})} className="w-full mt-1 p-3 bg-gray-50 rounded-xl outline-none border-none text-sm font-bold" />
            </div>
            <button className="bg-gray-900 text-white py-3 rounded-xl font-bold text-sm uppercase">Add to Warehouse</button>
          </form>
        )}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">Medication</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Stock Level</th>
                <th className="px-8 py-4">Unit Price</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5 font-bold text-gray-900">{item.item_name}</td>
                  <td className="px-8 py-5 text-gray-500 text-sm">{item.category}</td>
                  <td className="px-8 py-5 font-mono text-sm">{item.stock_quantity} units</td>
                  <td className="px-8 py-5 font-bold text-sm">TZS {Number(item.unit_price).toLocaleString()}</td>
                  <td className="px-8 py-5">
                    {item.stock_quantity < 10 ? (
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Low Stock</span>
                    ) : (
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">Healthy</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}