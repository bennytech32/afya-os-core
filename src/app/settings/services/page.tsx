export const dynamic = 'force-dynamic'

'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ServiceManager() {
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<'lab' | 'pharmacy'>('lab')
  const [labItems, setLabItems] = useState<any[]>([])
  const [drugItems, setDrugItems] = useState<any[]>([])
  
  // Form State
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')

  const loadData = async () => {
    const { data: lab } = await supabase.from('lab_services').select('*').order('test_name')
    const { data: drugs } = await supabase.from('inventory').select('*').order('item_name')
    setLabItems(lab || [])
    setDrugItems(drugs || [])
  }

  useEffect(() => { loadData() }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === 'lab') {
      await supabase.from('lab_services').insert([{ test_name: itemName, price: parseFloat(itemPrice) }])
    } else {
      await supabase.from('inventory').insert([{ item_name: itemName, unit_price: parseFloat(itemPrice), stock_quantity: 0 }])
    }
    setItemName(''); setItemPrice(''); loadData()
    alert(`${itemName} added successfully!`)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tighter italic">Admin <span className="text-blue-600">Service Manager</span></h1>
            <p className="text-gray-500 font-medium text-sm">Configure pricing and inventory templates</p>
          </div>
          <Link href="/dashboard" className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest">Back to Dashboard</Link>
        </header>

        {/* Tab Switcher */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => setActiveTab('lab')} className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'lab' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white text-gray-400 border'}`}>🔬 Lab Tests</button>
          <button onClick={() => setActiveTab('pharmacy')} className={`px-8 py-3 rounded-2xl font-black text-sm transition-all ${activeTab === 'pharmacy' ? 'bg-green-600 text-white shadow-lg shadow-green-200' : 'bg-white text-gray-400 border'}`}>💊 Pharmacy Drugs</button>
        </div>

        {/* Quick Add Form */}
        <form onSubmit={handleAdd} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Name (Test or Drug)</label>
            <input required value={itemName} onChange={e => setItemName(e.target.value)} className="w-full mt-1 p-4 bg-gray-50 rounded-2xl outline-none ring-1 ring-gray-100 focus:ring-2 focus:ring-blue-600" placeholder="e.g. Malaria mRDT" />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (TZS)</label>
            <input required type="number" value={itemPrice} onChange={e => setItemPrice(e.target.value)} className="w-full mt-1 p-4 bg-gray-50 rounded-2xl outline-none ring-1 ring-gray-100 focus:ring-2 focus:ring-blue-600" placeholder="5000" />
          </div>
          <button className={`py-4 rounded-2xl font-black text-white shadow-lg transition-all ${activeTab === 'lab' ? 'bg-purple-600' : 'bg-green-600'}`}>+ Add Service</button>
        </form>

        {/* Data Table */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-4">Service Name</th>
                <th className="px-8 py-4">Unit Price (TZS)</th>
                <th className="px-8 py-4">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(activeTab === 'lab' ? labItems : drugItems).map((item: any) => (
                <tr key={item.id}>
                  <td className="px-8 py-5 font-bold text-gray-900">{item.test_name || item.item_name}</td>
                  <td className="px-8 py-5 font-black text-blue-600">{Number(item.price || item.unit_price).toLocaleString()}</td>
                  <td className="px-8 py-5 text-gray-400 text-xs font-bold uppercase">{activeTab.toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}