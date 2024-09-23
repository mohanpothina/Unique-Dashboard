// src/components/ProductModal.js

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

const ProductModal = ({
    open,
    handleClose,
    product, // The current product being edited (null if adding)
    refreshProducts, // Function to refresh products data in Dashboard
    setNotification, // Function to set notifications in Dashboard
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        productInformation: '',
        detailDescription2: '',
        images: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Populate form data when editing an existing product
    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                productInformation: product.productInformation || '',
                detailDescription2: product.detailDescription2 || '',
                images: product.images ? product.images.join(', ') : '',
            });
        } else {
            // Reset form when adding a new product
            setFormData({
                name: '',
                description: '',
                price: '',
                productInformation: '',
                detailDescription2: '',
                images: '',
            });
        }
    }, [product]);

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
            !formData.name ||
            !formData.description ||
            !formData.price ||
            !formData.productInformation ||
            !formData.images
        ) {
            setError('Please fill in all required fields.');
            setLoading(false);
            return;
        }

        // Prepare payload
        const payload = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price),
            productInformation: formData.productInformation,
            detailDescription2: formData.detailDescription2,
            images: formData.images.split(',').map((img) => img.trim()),
        };

        try {
            if (product) {
                // Update existing product
                await api.put(`/products/${product.id}`, payload);
                setNotification({
                    open: true,
                    message: 'Product updated successfully.',
                    severity: 'success',
                });
            } else {
                // Create new product
                await api.post('/products/add', payload);
                setNotification({
                    open: true,
                    message: 'Product added successfully.',
                    severity: 'success',
                });
            }
            refreshProducts(); // Refresh products data in Dashboard
            handleClose(); // Close the modal
        } catch (err) {
            console.error('Error saving product:', err);
            setError('Failed to save product. Please try again.');
            setNotification({
                open: true,
                message: 'Failed to save product.',
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
                    {product ? 'Edit Product' : 'Add New Product'}
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
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
                        inputProps={{ step: "0.01" }}
                    />
                    <TextField
                        label="Product Information"
                        name="productInformation"
                        value={formData.productInformation}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        label="Detail Description 2"
                        name="detailDescription2"
                        value={formData.detailDescription2}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={2}
                    />
                    <TextField
                        label="Images (comma separated URLs)"
                        name="images"
                        value={formData.images}
                        onChange={handleInputChange}
                        fullWidth
                        margin="normal"
                        required
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

export default ProductModal;
