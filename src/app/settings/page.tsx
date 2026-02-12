'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StaffManager } from '@/components/settings/StaffManager'
import { UserRegistrationForm } from '@/components/settings/UserRegistrationForm'
import Link from 'next/link'

export default function SettingsPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userRole, setUserRole] = useState<string>('')
  
  const [settings, setSettings] = useState({
    hospital_name: '',
    address: '',
    phone: '',
    email: '',
    currency: 'TZS',
    logo_url: ''
  })

  useEffect(() => {
    const checkAccessAndFetch = async () => {
      // 1. Check Role Security
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: staff } = await supabase.from('staff').select('role').eq('user_id', user.id).single()
        setUserRole(staff?.role || '')
      }

      // 2. Fetch System Data
      const { data } = await supabase.from('system_settings').select('*').eq('id', 1).single()
      if (data) {
        setSettings({
          hospital_name: data.hospital_name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          currency: data.currency || 'TZS',
          logo_url: data.logo_url || ''
        })
      }
      setLoading(false)
    }
    checkAccessAndFetch()
  }, [])

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('system_settings').update(settings).eq('id', 1)
    if (error) alert(error.message)
    else alert('Global system settings updated!')
    setSaving(false)
  }

  // --- SECURITY GATEKEEPER ---
  if (!loading && userRole !== 'Admin') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl">🔒</div>
          <h1 className="text-3xl font-black">ACCESS DENIED</h1>
          <p className="text-gray-400 text-sm">You do not have Super Admin privileges to access System Configuration. This attempt has been logged.</p>
          <Link href="/dashboard" className="inline-block bg-white text-black px-8 py-3 rounded-xl font-bold">Return to Dashboard</Link>
        </div>
      </div>
    )
  }

  if (loading) return <div className="p-20 text-center font-bold animate-pulse">Checking Security Credentials...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900">System <span className="text-red-600">Config</span></h1>
            <p className="text-gray-500 font-medium">Restricted to Super Admin access only.</p>
          </div>
          <Link href="/dashboard" className="bg-white border border-gray-200 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
            &larr; Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: Hospital Branding */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-red-50 rounded-3xl border-2 border-dashed border-red-200 flex items-center justify-center relative overflow-hidden mb-6">
                {settings.logo_url ? (
                  <img src={settings.logo_url} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <span className="text-red-400 text-xs font-black uppercase tracking-tighter">System<br/>Logo</span>
                )}
              </div>
              
              <form onSubmit={saveSettings} className="w-full space-y-4 text-left">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hospital Identity</label>
                  <input 
                    value={settings.hospital_name} 
                    onChange={e => setSettings({...settings, hospital_name: e.target.value})}
                    className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location / Address</label>
                  <input 
                    value={settings.address} 
                    onChange={e => setSettings({...settings, address: e.target.value})}
                    className="w-full p-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-bold mt-1"
                  />
                </div>
                <button disabled={saving} className="w-full bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-100 text-xs uppercase tracking-widest">
                  {saving ? 'Updating System...' : 'Update Clinic Branding'}
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: New Staff Authorization */}
          <div className="lg:col-span-1">
            <UserRegistrationForm />
          </div>

          {/* Column 3: Team Roster Management */}
          <div className="lg:col-span-1">
            <StaffManager />
          </div>

        </div>
      </div>
      <footer className="text-center text-[10px] text-gray-400 uppercase tracking-[0.4em] font-black mt-16 opacity-50">
        AfyaOS Enterprise Security Infrastructure
      </footer>
    </div>
  )
}