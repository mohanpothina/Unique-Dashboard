// src/components/ShippingInfoModal.js

import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import api from '../api';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

const ShippingInfoModal = ({
    open,
    handleClose,
    shipping, // The current shipping info being edited (null if adding)
    refreshShipping, // Function to refresh shipping info data in Dashboard
    setNotification, // Function to set notifications in Dashboard
}) => {
    const [formData, setFormData] = useState({
        orderId: '',
        fullName: '',
        phoneNumber: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
        status: 'ON_TRACK', // Default status
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Populate form data when editing an existing shipping info
    useEffect(() => {
        if (shipping) {
            setFormData({
                orderId: shipping.orderId || '',
                fullName: shipping.fullName || '',
                phoneNumber: shipping.phoneNumber || '',
                email: shipping.email || '',
                address: shipping.address || '',
                city: shipping.city || '',
                postalCode: shipping.postalCode || '',
                country: shipping.country || '',
                status: shipping.status || 'ON_TRACK',
            });
        } else {
            // Reset form when adding new shipping info
            setFormData({
                orderId: '',
                fullName: '',
                phoneNumber: '',
                email: '',
                address: '',
                city: '',
                postalCode: '',
                country: '',
                status: 'ON_TRACK',
            });
        }
    }, [shipping]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle status change
    const handleStatusChange = (e) => {
        setFormData((prevData) => ({ ...prevData, status: e.target.value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic form validation
        if (
            !formData.orderId ||
            !formData.fullName ||
            !formData.phoneNumber ||
            !formData.email ||
            !formData.address ||
            !formData.city ||
            !formData.postalCode ||
            !formData.country
        ) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        // Prepare payload
        const payload = {
            orderId: formData.orderId,
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            status: formData.status,
        };

        try {
            if (shipping) {
                // Update existing shipping info
                await api.put(`/shippings/${shipping.id}`, payload);
                setNotification({
                    open: true,
                    message: 'Shipping information updated successfully.',
                    severity: 'success',
                });
            } else {
                // Create new shipping info
                await api.post('/shippings/save', payload);
                setNotification({
                    open: true,
                    message: 'Shipping information added successfully.',
                    severity: 'success',
                });
            }
            refreshShipping(); // Refresh shipping info data in Dashboard
            handleClose(); // Close the modal
        } catch (err) {
            console.error('Error saving shipping information:', err);
            setError('Failed to save shipping information. Please try again.');
            setNotification({
                open: true,
                message: 'Failed to save shipping information.',
                severity: 'error',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom>
                    {shipping ? 'Edit Shipping Information' : 'Add New Shipping Information'}
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Order ID"
                        name="orderId"
                        value={formData.orderId}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                        disabled={!!shipping} // Disable editing Order ID if updating
                    />
                    <TextField
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Postal Code"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleStatusChange}
                            required
                        >
                            <MenuItem value="DELIVERED">Delivered</MenuItem>
                            <MenuItem value="ON_TRACK">On Track</MenuItem>
                            <MenuItem value="FAILED">Failed</MenuItem>
                            <MenuItem value="CANCELLED">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                        }}
                    >
                        <Button
                            onClick={handleClose}
                            color="secondary"
                            sx={{ mr: 2 }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                'Save'
                            )}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Modal>
    )
    };

    export default ShippingInfoModal;
