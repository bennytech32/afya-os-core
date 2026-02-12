'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function StaffManager() {
  const supabase = createClient()
  const [staff, setStaff] = useState<any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    role: 'Doctor',
    phone: ''
  })
  const [loading, setLoading] = useState(false)

  const fetchStaff = async () => {
    const { data } = await supabase.from('staff').select('*').order('created_at', { ascending: false })
    setStaff(data || [])
  }

  useEffect(() => { fetchStaff() }, [])

  const addStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.from('staff').insert([{ 
      full_name: formData.name, 
      role: formData.role,
      phone_number: formData.phone,
      is_active: true, // Force active on creation
      status: 'online'  // Show as online initially
    }])

    if (!error) {
      setFormData({ name: '', role: 'Doctor', phone: '' })
      fetchStaff()
    }
    setLoading(false)
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold mb-4 text-gray-800">Hospital Team</h3>
      
      <form onSubmit={addStaff} className="space-y-3 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
        <input 
          placeholder="Full Name (e.g. Dr. Salim Juma)" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})}
          className="w-full p-2 border rounded text-sm"
          required
        />
        <div className="grid grid-cols-2 gap-2">
          <input 
            placeholder="Phone Number" 
            value={formData.phone} 
            onChange={e => setFormData({...formData, phone: e.target.value})}
            className="p-2 border rounded text-sm"
          />
          <select 
            value={formData.role} 
            onChange={e => setFormData({...formData, role: e.target.value})} 
            className="p-2 border rounded text-sm bg-white"
          >
            <option>Doctor</option>
            <option>Nurse</option>
            <option>Pharmacist</option>
            <option>Cashier</option>
            <option>Admin</option>
          </select>
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded font-bold text-sm hover:bg-blue-700 transition-colors">
          {loading ? 'Adding...' : '+ Register Staff Member'}
        </button>
      </form>

      <div className="space-y-3">
        {staff.map(s => (
          <div key={s.id} className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-100 hover:border-blue-200 transition-all">
            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div className={`w-3 h-3 rounded-full ${s.is_active ? 'bg-green-500' : 'bg-gray-300'} shadow-sm animate-pulse`}></div>
              <div>
                <p className="font-bold text-sm text-gray-900">{s.full_name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{s.role} • {s.phone_number || 'No Phone'}</p>
              </div>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
              {s.is_active ? 'ACTIVE' : 'INACTIVE'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}