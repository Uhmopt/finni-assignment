import { Router } from 'express';
import { PatientController } from '../controllers/patientController';
import { PatientService } from '../services/patientService';
import { Database } from 'sqlite3';

export function createPatientRoutes(db: Database): Router {
  const router = Router();
  const patientService = new PatientService(db);
  const patientController = new PatientController(patientService);

  // GET /api/patients - Get all patients
  router.get('/', patientController.getAllPatients);

  // GET /api/patients/:id - Get patient by ID
  router.get('/:id', patientController.getPatientById);

  // POST /api/patients - Create new patient
  router.post('/', patientController.createPatient);

  // PUT /api/patients/:id - Update patient
  router.put('/:id', patientController.updatePatient);

  // DELETE /api/patients/:id - Delete patient
  router.delete('/:id', patientController.deletePatient);

  return router;
}
