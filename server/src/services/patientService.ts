import { Database } from 'sqlite3';
import { Patient, CreatePatientRequest, PatientStatus } from '../types/patient';
import { PatientRow } from '../types/database';

export class PatientService {
  constructor(private db: Database) {}

  public async getAllPatients(): Promise<Patient[]> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM patients ORDER BY created_at DESC';
      this.db.all(sql, [], (err, rows: PatientRow[]) => {
        if (err) {
          reject(err);
          return;
        }
        const patients: Patient[] = rows.map(this.mapRowToPatient);
        resolve(patients);
      });
    });
  }

  public async getPatientById(id: number): Promise<Patient | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM patients WHERE id = ?';
      this.db.get(sql, [id], (err, row: PatientRow) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          resolve(null);
          return;
        }
        resolve(this.mapRowToPatient(row));
      });
    });
  }

  public async createPatient(patientData: CreatePatientRequest): Promise<number> {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO patients (
        first_name, middle_name, last_name, date_of_birth, status,
        street_address, city, state_province, zip_postal_code
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      this.db.run(sql, [
        patientData.first_name,
        patientData.middle_name || null,
        patientData.last_name,
        patientData.date_of_birth,
        patientData.status,
        patientData.street_address,
        patientData.city,
        patientData.state_province,
        patientData.zip_postal_code
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }

  public async updatePatient(id: number, patientData: CreatePatientRequest): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE patients SET 
        first_name = ?, middle_name = ?, last_name = ?, date_of_birth = ?, status = ?,
        street_address = ?, city = ?, state_province = ?, zip_postal_code = ?,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`;

      this.db.run(sql, [
        patientData.first_name,
        patientData.middle_name || null,
        patientData.last_name,
        patientData.date_of_birth,
        patientData.status,
        patientData.street_address,
        patientData.city,
        patientData.state_province,
        patientData.zip_postal_code,
        id
      ], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  public async deletePatient(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM patients WHERE id = ?';
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.changes > 0);
      });
    });
  }

  public validatePatientStatus(status: string): status is PatientStatus {
    const validStatuses: PatientStatus[] = ['Inquiry', 'Onboarding', 'Active', 'Churned'];
    return validStatuses.includes(status as PatientStatus);
  }

  private mapRowToPatient(row: PatientRow): Patient {
    return {
      id: row.id,
      first_name: row.first_name,
      middle_name: row.middle_name || undefined,
      last_name: row.last_name,
      date_of_birth: row.date_of_birth,
      status: row.status as PatientStatus,
      street_address: row.street_address,
      city: row.city,
      state_province: row.state_province,
      zip_postal_code: row.zip_postal_code,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}
