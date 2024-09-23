import React from 'react';
import { Button } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <Button
      color="inherit"
      onClick={logout}
      startIcon={<LogoutIcon />}
      sx={{
        color: '#FFFFFF',
        '&:hover': { backgroundColor: '#4CAF50' },
        textTransform: 'none',
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
