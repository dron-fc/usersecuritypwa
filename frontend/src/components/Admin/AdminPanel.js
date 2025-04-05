import React from 'react';
import { Typography, Box } from '@mui/material';
import AdminUsersPanel from './AdminUsersPanel';

const AdminPanel = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        User Management
      </Typography>
      <AdminUsersPanel />
    </Box>
  );
};

export default AdminPanel;
