'use client'

export function MedicalReportPrint({ patient, vitals, consultation }: { patient: any, vitals: any, consultation: any }) {
  return (
    <div className="bg-white p-10 border shadow-sm max-w-2xl mx-auto mt-4">
      <div className="flex justify-between items-start border-b-2 border-blue-600 pb-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-800">AFYAOS CLINICAL REPORT</h1>
          <p className="text-sm text-gray-600">Confidential Medical Record</p>
        </div>
        <div className="text-right text-xs">
          <p>Date: {new Date().toLocaleDateString()}</p>
          <p>Ref: {patient.nida_number}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mb-8">
        <div><strong>Patient Name:</strong> {patient.first_name} {patient.last_name}</div>
        <div><strong>Gender:</strong> {patient.gender}</div>
        <div><strong>Phone:</strong> {patient.phone_number}</div>
        <div><strong>DOB:</strong> {patient.date_of_birth}</div>
      </div>

      <div className="mb-6">
        <h3 className="bg-gray-100 p-1 text-sm font-bold uppercase mb-2">Vitals Triage</h3>
        <p className="text-sm">
          BP: {vitals?.systolic}/{vitals?.diastolic} mmHg | 
          Temp: {vitals?.temperature}°C | 
          Weight: {vitals?.weight}kg
        </p>
      </div>

      <div className="mb-6">
        <h3 className="bg-gray-100 p-1 text-sm font-bold uppercase mb-2">Clinical Findings</h3>
        <p className="text-sm"><strong>Chief Complaint:</strong> {consultation?.chief_complaint}</p>
        <p className="text-sm mt-2"><strong>Diagnosis:</strong> {consultation?.diagnosis}</p>
      </div>

      <div className="mb-8">
        <h3 className="bg-gray-100 p-1 text-sm font-bold uppercase mb-2">Prescription & Plan</h3>
        <p className="text-sm italic border p-3 rounded">{consultation?.prescription}</p>
      </div>

      <div className="mt-12 flex justify-between">
        <div className="border-t border-black w-48 text-center text-xs pt-1">Doctor's Signature</div>
        <div className="border-t border-black w-48 text-center text-xs pt-1">Hospital Stamp</div>
      </div>
      
      <button 
        onClick={() => window.print()}
        className="mt-8 no-print bg-blue-600 text-white px-6 py-2 rounded"
      >
        Print Report
      </button>
    </div>
  )
}