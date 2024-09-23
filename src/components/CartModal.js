// src/components/CartModal.js

import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
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

const CartModal = ({
    open,
    handleClose,
    cart, // The current cart being edited (null if adding)
    refreshCarts, // Function to refresh carts data in Dashboard
    setNotification, // Function to set notifications in Dashboard
}) => {
    const [formData, setFormData] = useState({
        orderId: '',
        itemName: '',
        price: '',
        quantity: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Populate form data when editing an existing cart
    useEffect(() => {
        if (cart) {
            setFormData({
                orderId: cart.orderId || '',
                itemName: cart.itemName || '',
                price: cart.price || '',
                quantity: cart.quantity || '',
            });
        } else {
            // Reset form when adding a new cart
            setFormData({
                orderId: '',
                itemName: '',
                price: '',
                quantity: '',
            });
        }
    }, [cart]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic form validation
        if (
            !formData.orderId ||
            !formData.itemName ||
            !formData.price ||
            !formData.quantity
        ) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        // Prepare payload
        const payload = {
            orderId: formData.orderId,
            itemName: formData.itemName,
            price: parseFloat(formData.price),
            quantity: parseInt(formData.quantity, 10),
        };

        try {
            if (cart) {
                // Update existing cart
                const response = await api.put(`/cart/${cart.id}`, payload);
                setNotification({
                    open: true,
                    message: 'Order updated successfully.',
                    severity: 'success',
                });
            } else {
                // Create new cart
                const response = await api.post('/cart/add', payload);
                setNotification({
                    open: true,
                    message: 'Order added successfully.',
                    severity: 'success',
                });
            }
            refreshCarts(); // Refresh carts data in Dashboard
            handleClose(); // Close the modal
        } catch (err) {
            console.error('Error saving cart:', err);
            setError('Failed to save order. Please try again.');
            setNotification({
                open: true,
                message: 'Failed to save order.',
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
                    {cart ? 'Edit Order' : 'Add New Order'}
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
                        disabled={!!cart} // Disable editing Order ID if updating
                    />
                    <TextField
                        label="Item Name"
                        name="itemName"
                        value={formData.itemName}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Price"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ step: '0.01' }}
                    />
                    <TextField
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                        inputProps={{ min: '1' }}
                    />
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
    );
};

export default CartModal;
