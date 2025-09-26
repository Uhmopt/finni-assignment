import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { Save, Cancel } from '@mui/icons-material';
import { patientAPI } from '../services/api';
import { PatientFormData, STATUS_OPTIONS, PatientStatus } from '../types/patient';

const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState<PatientFormData>({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: '',
    status: 'Inquiry',
    street_address: '',
    city: '',
    state_province: '',
    zip_postal_code: ''
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (isEdit && id) {
      loadPatient(parseInt(id));
    }
  }, [id, isEdit]);

  const loadPatient = async (patientId: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await patientAPI.getById(patientId);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load patient data');
      console.error('Error loading patient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData((prev: PatientFormData) => ({
      ...prev,
      [name as keyof PatientFormData]: value as string
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent<PatientStatus>): void => {
    const { name, value } = event.target;
    setFormData((prev: PatientFormData) => ({
      ...prev,
      [name as keyof PatientFormData]: value as PatientStatus
    }));
  };

  const validateForm = (): boolean => {
    const required = ['first_name', 'last_name', 'date_of_birth', 'status', 'street_address', 'city', 'state_province', 'zip_postal_code'];
    const missing = required.filter(field => !formData[field as keyof PatientFormData]);
    
    if (missing.length > 0) {
      setError(`Please fill in all required fields: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (isEdit && id) {
        await patientAPI.update(parseInt(id), formData);
        setSuccess('Patient updated successfully!');
      } else {
        await patientAPI.create(formData);
        setSuccess('Patient created successfully!');
        setFormData({
          first_name: '',
          middle_name: '',
          last_name: '',
          date_of_birth: '',
          status: 'Inquiry',
          street_address: '',
          city: '',
          state_province: '',
          zip_postal_code: ''
        });
      }

      setTimeout(() => {
        navigate('/patients');
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred');
      console.error('Error saving patient:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = (): void => {
    navigate('/patients');
  };

  if (loading && isEdit) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Edit Patient' : 'Add New Patient'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Name Fields */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Patient Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="First Name *"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Middle Name"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Last Name *"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth *"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                label="Status"
              >
                {STATUS_OPTIONS.map((option: { value: PatientStatus; label: string }) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Address Fields */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Address Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Street Address *"
              name="street_address"
              value={formData.street_address}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="City *"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="State/Province *"
              name="state_province"
              value={formData.state_province}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="ZIP/Postal Code *"
              name="zip_postal_code"
              value={formData.zip_postal_code}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEdit ? 'Update Patient' : 'Add Patient')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PatientForm;
