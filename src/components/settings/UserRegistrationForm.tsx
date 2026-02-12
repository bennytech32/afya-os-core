'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function UserRegistrationForm() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'Doctor',
    phone: ''
  })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // 1. Create the Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    })

    if (authError) {
      alert("Auth Error: " + authError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      // 2. Create the Staff Profile linked to the new Auth ID
      const { error: staffError } = await supabase.from('staff').insert([{
        user_id: authData.user.id,
        full_name: formData.fullName,
        role: formData.role,
        phone_number: formData.phone,
        is_active: true,
        status: 'offline'
      }])

      if (staffError) {
        alert("Profile Error: " + staffError.message)
      } else {
        alert("Staff Member Registered Successfully!")
        setFormData({ email: '', password: '', fullName: '', role: 'Doctor', phone: '' })
      }
    }
    setLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4 italic">Add New Staff Member</h3>
      
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
          <input 
            required
            value={formData.fullName}
            onChange={e => setFormData({...formData, fullName: e.target.value})}
            className="w-full p-2.5 border rounded-lg mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Dr. Jane Doe"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Work Email</label>
            <input 
              type="email" required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full p-2.5 border rounded-lg mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Initial Password</label>
            <input 
              type="password" required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full p-2.5 border rounded-lg mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Role</label>
            <select 
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full p-2.5 border rounded-lg mt-1 text-sm bg-white"
            >
              <option>Doctor</option>
              <option>Nurse</option>
              <option>Pharmacist</option>
              <option>Cashier</option>
              <option>Admin</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
            <input 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full p-2.5 border rounded-lg mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+255..."
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 mt-2"
        >
          {loading ? 'Processing Registration...' : 'Authorize & Create Account'}
        </button>
      </form>
    </div>
  )
}