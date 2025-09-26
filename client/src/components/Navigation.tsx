import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, Tab, Box } from '@mui/material';
import { People, PersonAdd } from '@mui/icons-material';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = (): number => {
    if (location.pathname === '/patients/new') return 1;
    if (location.pathname.startsWith('/patients/') && location.pathname.includes('/edit')) return 1;
    return 0;
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    if (newValue === 0) {
      navigate('/patients');
    } else if (newValue === 1) {
      navigate('/patients/new');
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={getCurrentTab()} onChange={handleTabChange} aria-label="navigation tabs">
        <Tab 
          icon={<People />} 
          label="View Patients" 
          iconPosition="start"
        />
        <Tab 
          icon={<PersonAdd />} 
          label="Add Patient" 
          iconPosition="start"
        />
      </Tabs>
    </Box>
  );
};

export default Navigation;
