import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Edit, Delete, Add } from '@mui/icons-material';
import { patientAPI } from '../services/api';
import { Patient, PatientStatus } from '../types/patient';

const getStatusColor = (status: PatientStatus): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
  switch (status) {
    case 'Inquiry': return 'default';
    case 'Onboarding': return 'primary';
    case 'Active': return 'success';
    case 'Churned': return 'error';
    default: return 'default';
  }
};

const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; patient: Patient | null }>({ 
    open: false, 
    patient: null 
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await patientAPI.getAll();
      setPatients(response.data);
    } catch (err) {
      setError('Failed to load patients');
      console.error('Error loading patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: number): void => {
    navigate(`/patients/${id}/edit`);
  };

  const handleDelete = (patient: Patient): void => {
    setDeleteDialog({ open: true, patient });
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deleteDialog.patient) return;
    
    try {
      await patientAPI.delete(deleteDialog.patient.id);
      setPatients(prev => prev.filter(p => p.id !== deleteDialog.patient!.id));
      setDeleteDialog({ open: false, patient: null });
    } catch (err) {
      setError('Failed to delete patient');
      console.error('Error deleting patient:', err);
    }
  };

  const cancelDelete = (): void => {
    setDeleteDialog({ open: false, patient: null });
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatAddress = (patient: Patient): string => {
    return `${patient.street_address}, ${patient.city}, ${patient.state_province} ${patient.zip_postal_code}`;
  };

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      sortable: false,
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const { first_name, middle_name, last_name } = params.row;
        const fullName = [first_name, middle_name, last_name].filter(Boolean).join(' ');
        return <Typography variant="body2">{fullName}</Typography>;
      },
    },
    {
      field: 'date_of_birth',
      headerName: 'Date of Birth',
      width: 130,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2">{formatDate(params.value)}</Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'address',
      headerName: 'Address',
      width: 300,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
          {formatAddress(params.row)}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row.id)}
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row)}
            color="error"
          >
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Patient Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/patients/new')}
        >
          Add New Patient
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={patients}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          disableColumnMenu
          sx={{
            '& .MuiDataGrid-cell': {
              borderBottom: '1px solid #e0e0e0',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
            },
          }}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={cancelDelete}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete patient "{deleteDialog.patient?.first_name} {deleteDialog.patient?.last_name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PatientList;
