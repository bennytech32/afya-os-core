// src/types/index.ts
export interface Patient {
  id?: string;
  nida_number: string; // The Unique ID
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'Male' | 'Female';
  phone_number: string;
  created_at?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}