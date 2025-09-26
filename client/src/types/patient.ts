export interface Patient {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  status: PatientStatus;
  street_address: string;
  city: string;
  state_province: string;
  zip_postal_code: string;
  created_at: string;
  updated_at: string;
}

export type PatientStatus = 'Inquiry' | 'Onboarding' | 'Active' | 'Churned';

export interface CreatePatientRequest {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  status: PatientStatus;
  street_address: string;
  city: string;
  state_province: string;
  zip_postal_code: string;
}

export interface UpdatePatientRequest extends CreatePatientRequest {
  id: number;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PatientFormData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  date_of_birth: string;
  status: PatientStatus;
  street_address: string;
  city: string;
  state_province: string;
  zip_postal_code: string;
}

export const STATUS_OPTIONS: Array<{ value: PatientStatus; label: string }> = [
  { value: 'Inquiry', label: 'Inquiry' },
  { value: 'Onboarding', label: 'Onboarding' },
  { value: 'Active', label: 'Active' },
  { value: 'Churned', label: 'Churned' }
];
