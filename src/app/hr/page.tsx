'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function HRPage() {
  const supabase = createClient()
  const [staffList, setStaffList] = useState<any[]>([])
  const [rosters, setRosters] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: staff } = await supabase.from('staff').select('*')
      const { data: rosterData } = await supabase.from('rosters').select('*, staff(full_name, role)')
      setStaffList(staff || [])
      setRosters(rosterData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-gray-900">HR & <span className="text-blue-600">Rosters</span></h1>
          <Link href="/dashboard" className="text-sm font-bold text-gray-400 hover:text-black transition-all uppercase tracking-widest">
            &larr; Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Duty Roster Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Current Weekly Roster</h3>
              <button className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold">Assign Shift</button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase">
                <tr>
                  <th className="px-6 py-4">Staff Member</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Shift</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rosters.map(r => (
                  <tr key={r.id} className="text-sm">
                    <td className="px-6 py-4 font-bold">{r.staff.full_name}</td>
                    <td className="px-6 py-4">{r.department}</td>
                    <td className="px-6 py-4">
                       <span className={`px-2 py-1 rounded-md text-[10px] font-black ${r.shift_type === 'Night' ? 'bg-indigo-100 text-indigo-700' : 'bg-orange-100 text-orange-700'}`}>
                         {r.shift_type.toUpperCase()}
                       </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{r.shift_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Attendance View */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-6">Attendance (Today)</h3>
            <div className="space-y-4">
              {staffList.map(s => (
                <div key={s.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm font-bold text-gray-700">{s.full_name}</span>
                  </div>
                  <span className="text-[10px] font-black text-gray-400">08:00 AM</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}