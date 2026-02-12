'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ReportsPage() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    patientCount: 0,
    pendingInvoices: 0,
    dispensedCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const today = new Date().toISOString().split('T')[0] // Get YYYY-MM-DD

      // 1. Get Revenue (Paid Invoices)
      const { data: revenueData } = await supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'paid')
        .gte('created_at', today)

      // 2. Get Patient Count
      const { count: pCount } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

      // 3. Get Pending Invoices
      const { count: iCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // 4. Get Pharmacy Count
      const { count: dCount } = await supabase
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .eq('dispensing_status', 'dispensed')
        .gte('created_at', today)

      const total = revenueData?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0

      setStats({
        totalRevenue: total,
        patientCount: pCount || 0,
        pendingInvoices: iCount || 0,
        dispensedCount: dCount || 0
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  if (loading) return <div className="p-8 text-center">Calculating daily reports...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hospital Reports</h1>
            <p className="text-gray-500">Performance data for today, {new Date().toLocaleDateString()}</p>
          </div>
          <Link href="/dashboard" className="text-blue-600 hover:underline text-sm font-medium">
            &larr; Back to Dashboard
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase">Today's Revenue</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {stats.totalRevenue.toLocaleString()} <span className="text-xs font-normal">TZS</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase">New Patients</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.patientCount}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase">Pending Bills</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingInvoices}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase">Meds Dispensed</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">{stats.dispensedCount}</p>
          </div>

        </div>

        {/* Informational Message */}
        <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-2">Management Insight</h2>
            <p className="text-blue-100 max-w-lg">
              {stats.totalRevenue > 50000 
                ? "Revenue targets are being met today. Ensure pharmacy stock is updated." 
                : "Awaiting more patient transactions for a full daily projection."}
            </p>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-20">
             {/* Mock icon/design element */}
             <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          </div>
        </div>

      </div>
    </div>
  )
}