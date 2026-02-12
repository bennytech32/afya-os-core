'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { PatientList } from '@/components/patients/PatientList'
import Link from 'next/link'

export default function DashboardPage() {
  const supabase = createClient()
  const router = useRouter()
  
  const [userName, setUserName] = useState<string>('Staff Member')
  const [userRole, setUserRole] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: staffData } = await supabase
          .from('staff')
          .select('full_name, role')
          .eq('user_id', user.id)
          .single()
        
        if (staffData) {
          setUserName(staffData.full_name)
          setUserRole(staffData.role)
        }
      }
      setLoading(false)
    }
    getUserProfile()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 shadow-2xl fixed h-full">
        <div className="mb-10">
          <h1 className="text-2xl font-black tracking-tighter">Afya<span className="text-blue-500">OS</span></h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Smart Health Suite</p>
        </div>
        
        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Clinical Flow</p>
          <Link href="/dashboard" className="flex items-center gap-3 p-3 bg-blue-600 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20">
            🏠 Dashboard
          </Link>
          <Link href="/register" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-all">
            📝 Reception
          </Link>
          <Link href="/consultation" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-all">
            🩺 Doctor Room
          </Link>
          <Link href="/lab" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-all">
            🔬 Laboratory
          </Link>
          <Link href="/pharmacy" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-all">
            💊 Pharmacy
          </Link>
          <Link href="/billing" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-all">
            💰 Billing
          </Link>

          <div className="pt-6">
            <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">Management</p>
            <Link href="/hr" className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-xl font-bold text-sm text-gray-400 hover:text-white transition-all">
              👥 HR & Roster
            </Link>
            
            {/* Super Admin Restricted Settings */}
            {userRole?.toLowerCase() === 'admin' && (
              <Link 
                href="/settings" 
                className="flex items-center gap-3 p-3 mt-4 bg-red-600/10 text-red-500 border border-red-900/20 rounded-xl font-black text-xs uppercase tracking-widest animate-pulse hover:bg-red-600 hover:text-white transition-all"
              >
                🛡️ System Config
              </Link>
            )}
          </div>
        </nav>

        <div className="pt-6 border-t border-gray-800">
          <button 
            onClick={handleLogout} 
            className="w-full text-left p-3 text-gray-500 text-xs font-bold hover:text-white transition-all"
          >
            Logout Securely
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header & Personalized Greeting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">System Live</p>
              </div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Welcome, {userName}</h2>
              <p className="text-gray-500 font-medium">Here is what's happening in AfyaOS today.</p>
            </div>
            
            <Link 
              href="/register" 
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span className="text-xl">+</span> New Patient Intake
            </Link>
          </div>

          {/* Department Pipeline Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-blue-500 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-xl">📝</div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-full">RECEPTION</span>
              </div>
              <h3 className="text-3xl font-black text-gray-800">12</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Patients in Waiting</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-purple-500 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 rounded-2xl text-xl">🩺</div>
                <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-full">DOCTOR</span>
              </div>
              <h3 className="text-3xl font-black text-gray-800">4</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">In Consultations</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-indigo-500 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-2xl text-xl">🔬</div>
                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">LABORATORY</span>
              </div>
              <h3 className="text-3xl font-black text-gray-800">8</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Tests Pending</p>
            </div>

            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-green-500 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 rounded-2xl text-xl">💊</div>
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full">PHARMACY</span>
              </div>
              <h3 className="text-3xl font-black text-gray-800">15</h3>
              <p className="text-xs text-gray-400 font-medium mt-1">Ready for Dispensing</p>
            </div>
          </div>

          {/* Main Content: The Live Patient Queue */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-md">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Active Patient Queue</h3>
                <p className="text-xs text-gray-400 mt-1 italic">Real-time clinical monitoring across all wards</p>
              </div>
              <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all">
                Export Data
              </button>
            </div>
            <div className="p-4">
              <PatientList />
            </div>
          </div>

        </div>

        {/* Branding Footer */}
        <footer className="mt-12 max-w-6xl mx-auto flex justify-between items-center text-[10px] text-gray-400 font-mono uppercase tracking-[0.3em] px-4 opacity-60">
          <p>AfyaOS CORE v1.3.2 // ENTERPRISE BUILD</p>
          <p>© 2026 AfyaOS Technologies Ltd.</p>
        </footer>
      </div>
    </main>
  )
}