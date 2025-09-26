import { Database } from 'sqlite3';

export interface DatabaseConfig {
  path: string;
}

export interface DatabaseConnection {
  db: Database;
  close: () => Promise<void>;
}

export interface PatientRow {
  id: number;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  date_of_birth: string;
  status: string;
  street_address: string;
  city: string;
  state_province: string;
  zip_postal_code: string;
  created_at: string;
  updated_at: string;
}
