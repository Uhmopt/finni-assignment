# Healthcare Patient Management System

A modern, web-based application that allows healthcare providers to efficiently manage critical patient data. Built with React frontend and Node.js backend with SQLite database, fully written in TypeScript for enhanced type safety and developer experience.

## Features

- **Patient Data Management**: Add, view, edit, and delete patient records
- **Comprehensive Patient Information**: 
  - Names (First, Middle, Last)
  - Date of Birth
  - Status (Inquiry, Onboarding, Active, Churned)
  - Complete Address Information
- **Modern UI**: Clean, intuitive interface built with Material-UI
- **Data Grid**: Sortable, searchable patient list with actions
- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Full TypeScript implementation for better code quality and developer experience
- **Shared Types**: Common type definitions between frontend and backend

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Professional UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web application framework
- **SQLite3** - Lightweight database
- **CORS** - Cross-origin resource sharing


## Project Structure

```
healthcare-patient-management/
├── client/                 # React frontend (TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components (.tsx)
│   │   ├── services/      # API service layer (.ts)
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx        # Main app component
│   ├── package.json
│   └── tsconfig.json
├── server/                 # Node.js backend (TypeScript)
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   ├── types/         # TypeScript type definitions
│   │   └── index.ts       # Express server
│   ├── dist/              # Compiled JavaScript
│   ├── patients.db        # SQLite database (created on first run)
│   ├── package.json
│   └── tsconfig.json
├── package.json           # Root package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm (comes with Node.js)
- TypeScript knowledge (helpful but not required)

### Installation

1. **Clone or download the project**
   ```bash
   # If you have git
   git clone <repository-url>
   cd healthcare-patient-management
   
   # Or extract the project files to a directory
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```
   This command will install dependencies for the root project, server, client, and shared types.

3. **Build the shared types (optional)**
   ```bash
   cd shared
   npm run build
   cd ..
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Alternative: Manual Setup

If the above doesn't work, you can set up each part manually:

1. **Install root dependencies**
   ```bash
   npm install
   ```


2. **Install server dependencies**
   ```bash
   cd server
   npm install
   npm run build
   cd ..
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

5. **In a new terminal, start the frontend**
   ```bash
   cd client
   npm start
   ```

## Usage

1. **Access the Application**
   - Open your browser and go to `http://localhost:3000`
   - The backend API runs on `http://localhost:5000`

2. **Add a New Patient**
   - Click "Add New Patient" button or the "Add Patient" tab
   - Fill in the required information:
     - First Name (required)
     - Last Name (required)
     - Date of Birth (required)
     - Status (required) - Select from dropdown
     - Street Address (required)
     - City (required)
     - State/Province (required)
     - ZIP/Postal Code (required)
   - Middle Name is optional
   - Click "Add Patient" to save

3. **View Patients**
   - The main page shows all patients in a data grid
   - You can see patient information, status, and address
   - Use the pagination controls to navigate through patients

4. **Edit Patient**
   - Click the edit icon (pencil) next to any patient
   - Modify the information as needed
   - Click "Update Patient" to save changes

5. **Delete Patient**
   - Click the delete icon (trash) next to any patient
   - Confirm the deletion in the dialog box

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Get All Patients
```http
GET /api/patients
```
Returns a list of all patients.

**Response:**
```json
[
  {
    "id": 1,
    "first_name": "John",
    "middle_name": "Michael",
    "last_name": "Doe",
    "date_of_birth": "1990-01-15",
    "status": "Active",
    "street_address": "123 Main St",
    "city": "Anytown",
    "state_province": "CA",
    "zip_postal_code": "12345",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Get Patient by ID
```http
GET /api/patients/:id
```
Returns a specific patient by ID.

#### Create New Patient
```http
POST /api/patients
Content-Type: application/json

{
  "first_name": "Jane",
  "middle_name": "Elizabeth",
  "last_name": "Smith",
  "date_of_birth": "1985-05-20",
  "status": "Onboarding",
  "street_address": "456 Oak Ave",
  "city": "Springfield",
  "state_province": "IL",
  "zip_postal_code": "62701"
}
```

#### Update Patient
```http
PUT /api/patients/:id
Content-Type: application/json

{
  "first_name": "Jane",
  "middle_name": "Elizabeth",
  "last_name": "Smith",
  "date_of_birth": "1985-05-20",
  "status": "Active",
  "street_address": "456 Oak Ave",
  "city": "Springfield",
  "state_province": "IL",
  "zip_postal_code": "62701"
}
```

#### Delete Patient
```http
DELETE /api/patients/:id
```

#### Health Check
```http
GET /api/health
```

### Status Values
The `status` field accepts one of these values:
- `Inquiry`
- `Onboarding`
- `Active`
- `Churned`

## Database Schema

The SQLite database contains a single `patients` table with the following structure:

```sql
CREATE TABLE patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  middle_name TEXT,
  last_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Inquiry', 'Onboarding', 'Active', 'Churned')),
  street_address TEXT NOT NULL,
  city TEXT NOT NULL,
  state_province TEXT NOT NULL,
  zip_postal_code TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Development

### Available Scripts

**Root Level:**
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run install-all` - Install all dependencies

**Server (TypeScript):**
- `npm start` - Start the server in production mode (compiled JS)
- `npm run dev` - Start the server with ts-node (TypeScript)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:watch` - Watch mode for TypeScript compilation

**Client (React 18 + Vite):**
- `npm run dev` - Start the Vite development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint


### Environment Variables

You can set the following environment variables:

- `PORT` - Backend server port (default: 5000)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Make sure ports 3000 and 5000 are available
   - Kill any processes using these ports

2. **Database connection issues**
   - The SQLite database is created automatically on first run
   - Check that the server directory has write permissions

3. **CORS errors**
   - The backend is configured to allow requests from localhost:3000
   - If you change ports, update the CORS configuration in `server/index.js`

4. **Module not found errors**
   - Run `npm run install-all` to ensure all dependencies are installed
   - Check that you're running commands from the correct directory

## Production Deployment

For production deployment:

1. **Build the backend:**
   ```bash
   cd server
   npm run build
   cd ..
   ```

2. **Build the frontend:**
   ```bash
   cd client
   npm run build
   cd ..
   ```

3. **Start the backend:**
   ```bash
   cd server
   npm start
   ```

4. **Serve the frontend:**
   - Copy the `client/build` folder contents to your web server
   - Configure your web server to serve the React app
   - Ensure the backend API is accessible from your frontend domain

## TypeScript Benefits

This project is fully converted to TypeScript, providing:

- **Type Safety**: Catch errors at compile time rather than runtime
- **Better IDE Support**: Enhanced autocomplete, refactoring, and navigation
- **Self-Documenting Code**: Types serve as documentation
- **Easier Refactoring**: Safe renaming and restructuring of code
- **Shared Contracts**: Common types between frontend and backend ensure API consistency
- **Better Developer Experience**: IntelliSense, error highlighting, and more

### TypeScript Configuration

- **Strict Mode**: All TypeScript strict checks are enabled
- **Shared Types**: Common interfaces in the `shared/` directory
- **Proper Imports**: Type-safe imports and exports
- **Interface Segregation**: Well-defined interfaces for different concerns

## License

MIT License - feel free to use this project for educational or commercial purposes.
