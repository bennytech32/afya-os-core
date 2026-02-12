'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function ReceptionPage() {
  const supabase = createClient()
  const router = useRouter()
  const [formData, setFormData] = useState({ full_name: '', age: '', gender: 'Male', address: '', phone_number: '' })

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('patients').insert([{ 
      ...formData, 
      age: parseInt(formData.age), 
      current_department: 'Consultation' 
    }])
    if (!error) { router.push('/dashboard') }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100">
        <h1 className="text-4xl font-black text-gray-900 mb-8 tracking-tighter">Reception <span className="text-blue-600">Intake</span></h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input placeholder="Full Name" className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-blue-600"
            onChange={e => setFormData({...formData, full_name: e.target.value})} required />
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Age" type="number" className="p-4 bg-gray-50 rounded-2xl outline-none ring-1 ring-gray-100"
              onChange={e => setFormData({...formData, age: e.target.value})} required />
            <select className="p-4 bg-gray-50 rounded-2xl outline-none ring-1 ring-gray-100"
              onChange={e => setFormData({...formData, gender: e.target.value})}>
              <option>Male</option><option>Female</option>
            </select>
          </div>
          <input placeholder="Physical Address" className="w-full p-4 bg-gray-50 rounded-2xl outline-none ring-1 ring-gray-100"
            onChange={e => setFormData({...formData, address: e.target.value})} />
          <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black text-lg shadow-lg shadow-blue-100 transition-all active:scale-95">
            Register & Send to Doctor
          </button>
        </form>
      </div>
    </div>
  )
}