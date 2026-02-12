'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Patient } from '@/types'
import { useParams } from 'next/navigation'
import Link from 'next/link'

// Import Clinical Components
import { VitalsForm } from '@/components/clinical/VitalsForm'
import { VitalsList } from '@/components/clinical/VitalsList'
import { ConsultationForm } from '@/components/clinical/ConsultationForm'
import { ConsultationList } from '@/components/clinical/ConsultationList'
import { InvoiceForm } from '@/components/billing/InvoiceForm' // <--- New Import

export default function PatientProfile() {
  const params = useParams()
  const supabase = createClient()
  
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  // State for Vitals
  const [showVitalsForm, setShowVitalsForm] = useState(false)
  const [vitalsRefreshTrigger, setVitalsRefreshTrigger] = useState(0)

  // State for Consultations
  const [showConsultForm, setShowConsultForm] = useState(false)
  const [consultRefreshTrigger, setConsultRefreshTrigger] = useState(0)
  
  // State for Billing
  const [showInvoiceForm, setShowInvoiceForm] = useState(false)

  useEffect(() => {
    const fetchPatient = async () => {
      if (!params.id) return

      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) {
        console.error('Error fetching patient:', error)
      } else {
        setPatient(data)
      }
      setLoading(false)
    }

    fetchPatient()
  }, [params.id])

  // Handlers
  const handleVitalsSaved = () => {
    setShowVitalsForm(false)
    setVitalsRefreshTrigger(prev => prev + 1)
  }

  const handleConsultationSaved = () => {
    setShowConsultForm(false)
    setConsultRefreshTrigger(prev => prev + 1)
  }

  const handleInvoiceCreated = () => {
    setShowInvoiceForm(false)
    // Optional: Add logic to refresh a list of invoices if you show them here
  }

  if (loading) return <div className="p-8 text-center">Loading patient file...</div>
  if (!patient) return <div className="p-8 text-center text-red-600">Patient not found</div>

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-gray-500">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Patient File</span>
        </div>

        {/* Patient Header Card */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8 border-l-4 border-blue-600">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold text-gray-900">
              {patient.first_name} {patient.last_name}
            </h1>
            <p className="text-sm text-gray-500 mb-4">NIDA: {patient.nida_number}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-gray-500 text-xs uppercase">Gender</span>
                <span className="font-medium">{patient.gender}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-gray-500 text-xs uppercase">Phone</span>
                <span className="font-medium">{patient.phone_number}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <span className="block text-gray-500 text-xs uppercase">DOB</span>
                <span className="font-medium">{patient.date_of_birth || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Vitals & Billing */}
          <div className="space-y-6">
            
            {/* Vitals Card */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Vitals & Triage
              </h3>
              
              {!showVitalsForm ? (
                <button 
                  onClick={() => setShowVitalsForm(true)}
                  className="w-full bg-blue-50 text-blue-600 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors border border-blue-200"
                >
                  + Record Vitals
                </button>
              ) : (
                <VitalsForm 
                  patientId={patient.id!} 
                  onSuccess={handleVitalsSaved} 
                  onCancel={() => setShowVitalsForm(false)}
                />
              )}
              
              <VitalsList patientId={patient.id!} refreshKey={vitalsRefreshTrigger} />
            </div>

            {/* Billing Card (New) */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Billing & Invoices
              </h3>

              {!showInvoiceForm ? (
                <button 
                  onClick={() => setShowInvoiceForm(true)}
                  className="w-full bg-yellow-50 text-yellow-700 py-2 rounded-md text-sm font-medium hover:bg-yellow-100 transition-colors border border-yellow-200"
                >
                  + Create Invoice
                </button>
              ) : (
                <InvoiceForm 
                  patientId={patient.id!} 
                  onSuccess={handleInvoiceCreated}
                />
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Doctor's Consultation */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 lg:col-span-2 h-fit">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Doctor's Notes
              </h3>
            </div>

            {!showConsultForm ? (
              <button 
                onClick={() => setShowConsultForm(true)}
                className="mb-6 bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 shadow-sm transition-all flex items-center gap-2"
              >
                <span>+ Start New Consultation</span>
              </button>
            ) : (
              <ConsultationForm 
                patientId={patient.id!} 
                onSuccess={handleConsultationSaved} 
                onCancel={() => setShowConsultForm(false)}
              />
            )}

            <div className="border-t border-gray-100 pt-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Previous Visits</h4>
              <ConsultationList patientId={patient.id!} refreshKey={consultRefreshTrigger} />
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}