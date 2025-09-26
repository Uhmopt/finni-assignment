import axios, { AxiosResponse } from 'axios';
import { Patient, CreatePatientRequest } from '../types/patient';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const patientAPI = {
  // Get all patients
  getAll: (): Promise<AxiosResponse<Patient[]>> => api.get('/patients'),
  
  // Get patient by ID
  getById: (id: number): Promise<AxiosResponse<Patient>> => api.get(`/patients/${id}`),
  
  // Create new patient
  create: (patientData: CreatePatientRequest): Promise<AxiosResponse<{ id: number; message: string }>> => 
    api.post('/patients', patientData),
  
  // Update patient
  update: (id: number, patientData: CreatePatientRequest): Promise<AxiosResponse<{ message: string }>> => 
    api.put(`/patients/${id}`, patientData),
  
  // Delete patient
  delete: (id: number): Promise<AxiosResponse<{ message: string }>> => api.delete(`/patients/${id}`),
};

export default api;
