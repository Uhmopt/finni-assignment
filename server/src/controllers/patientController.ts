import { Request, Response } from 'express';
import { PatientService } from '../services/patientService';
import { CreatePatientRequest } from '../types/patient';

export class PatientController {
  constructor(private patientService: PatientService) {}

  public getAllPatients = async (req: Request, res: Response): Promise<void> => {
    try {
      const patients = await this.patientService.getAllPatients();
      res.json(patients);
    } catch (error) {
      console.error('Error getting patients:', error);
      res.status(500).json({ error: 'Failed to retrieve patients' });
    }
  };

  public getPatientById = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({ error: 'Patient ID is required' });
        return;
      }
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid patient ID' });
        return;
      }

      const patient = await this.patientService.getPatientById(id);
      if (!patient) {
        res.status(404).json({ error: 'Patient not found' });
        return;
      }

      res.json(patient);
    } catch (error) {
      console.error('Error getting patient:', error);
      res.status(500).json({ error: 'Failed to retrieve patient' });
    }
  };

  public createPatient = async (req: Request, res: Response): Promise<void> => {
    try {
      const patientData: CreatePatientRequest = req.body;

      // Validate required fields
      const requiredFields = [
        'first_name', 'last_name', 'date_of_birth', 'status',
        'street_address', 'city', 'state_province', 'zip_postal_code'
      ];
      
      const missingFields = requiredFields.filter(field => !patientData[field as keyof CreatePatientRequest]);
      if (missingFields.length > 0) {
        res.status(400).json({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        });
        return;
      }

      // Validate status
      if (!this.patientService.validatePatientStatus(patientData.status)) {
        res.status(400).json({ 
          error: 'Invalid status. Must be one of: Inquiry, Onboarding, Active, Churned' 
        });
        return;
      }

      const patientId = await this.patientService.createPatient(patientData);
      res.status(201).json({ 
        id: patientId, 
        message: 'Patient created successfully' 
      });
    } catch (error) {
      console.error('Error creating patient:', error);
      res.status(500).json({ error: 'Failed to create patient' });
    }
  };

  public updatePatient = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({ error: 'Patient ID is required' });
        return;
      }
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid patient ID' });
        return;
      }

      const patientData: CreatePatientRequest = req.body;

      // Validate required fields
      const requiredFields = [
        'first_name', 'last_name', 'date_of_birth', 'status',
        'street_address', 'city', 'state_province', 'zip_postal_code'
      ];
      
      const missingFields = requiredFields.filter(field => !patientData[field as keyof CreatePatientRequest]);
      if (missingFields.length > 0) {
        res.status(400).json({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        });
        return;
      }

      // Validate status
      if (!this.patientService.validatePatientStatus(patientData.status)) {
        res.status(400).json({ 
          error: 'Invalid status. Must be one of: Inquiry, Onboarding, Active, Churned' 
        });
        return;
      }

      const updated = await this.patientService.updatePatient(id, patientData);
      if (!updated) {
        res.status(404).json({ error: 'Patient not found' });
        return;
      }

      res.json({ message: 'Patient updated successfully' });
    } catch (error) {
      console.error('Error updating patient:', error);
      res.status(500).json({ error: 'Failed to update patient' });
    }
  };

  public deletePatient = async (req: Request, res: Response): Promise<void> => {
    try {
      const idParam = req.params.id;
      if (!idParam) {
        res.status(400).json({ error: 'Patient ID is required' });
        return;
      }
      const id = parseInt(idParam);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid patient ID' });
        return;
      }

      const deleted = await this.patientService.deletePatient(id);
      if (!deleted) {
        res.status(404).json({ error: 'Patient not found' });
        return;
      }

      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      console.error('Error deleting patient:', error);
      res.status(500).json({ error: 'Failed to delete patient' });
    }
  };
}
