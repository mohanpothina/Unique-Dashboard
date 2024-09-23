


// src/components/NotificationSnackbar.js

import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationSnackbar = ({ open, onClose, message, severity }) => {
    return (
        <Snackbar 
            open={open} 
            autoHideDuration={6000} 
            onClose={onClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationSnackbar;
