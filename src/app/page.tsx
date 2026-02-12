import Link from 'next/link'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-lg space-y-6">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <span className="font-bold text-gray-700">AfyaOS</span>
          <div className="flex gap-4 text-sm font-medium">
            <Link 
              href="/dashboard" 
              className="text-gray-600 hover:text-blue-600 hover:underline transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/pharmacy" 
              className="text-gray-600 hover:text-green-600 hover:underline transition-colors"
            >
              Pharmacy
            </Link>
          </div>
        </div>

        {/* The Registration Form Component */}
        <PatientRegistrationForm />
        
        <p className="text-center text-xs text-gray-400 mt-8">
          &copy; 2026 AfyaOS System. Authorized Personnel Only.
        </p>
      </div>
    </main>
  )
}