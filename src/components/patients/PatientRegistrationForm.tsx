'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Patient } from '@/types'

// CHANGED: Using named export 'export function' instead of 'export default'
export function PatientRegistrationForm() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  
  // Initial state for the form
  const [formData, setFormData] = useState<Patient>({
    nida_number: '',
    first_name: '',
    last_name: '',
    date_of_birth: '', // Initialize as empty string
    gender: 'Male',
    phone_number: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Data cleaning: Convert empty date string to NULL and uppercase NIDA
    const payload = {
      ...formData,
      nida_number: formData.nida_number.toUpperCase(),
      date_of_birth: formData.date_of_birth === '' ? null : formData.date_of_birth
    }

    // Send to Supabase
    const { data, error } = await supabase
      .from('patients')
      .insert([payload])
      .select()

    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Patient Registered Successfully!')
      // Reset form
      setFormData({
        nida_number: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: 'Male',
        phone_number: ''
      })
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Register New Patient</h2>
      
      {/* NIDA ID Field */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">NIDA Number</label>
        <input
          type="text"
          name="nida_number"
          value={formData.nida_number}
          placeholder="e.g., 19901212-12345-12345-12"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onChange={handleChange}
        />
      </div>

      {/* Names */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* DOB & Gender */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          name="phone_number"
          value={formData.phone_number}
          placeholder="+255..."
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
          ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md'}`}
      >
        {loading ? 'Registering...' : 'Register Patient'}
      </button>
    </form>
  )
}