// src/pages/Dashboard.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
    AppBar,
    Toolbar,
    Typography,
    Tabs,
    Tab,
    Container,
    Box,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    IconButton,
    Button,
} from '@mui/material';
import {
    LocalShipping,
    Inventory,
    ShoppingCart,
    Brightness4,
    Brightness7,
    Edit,
    Delete,
    Add,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import LogoutButton from '../components/LogoutButton';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';
import ShippingInfoModal from '../components/ShippingInfoModal';
import NotificationSnackbar from '../components/NotificationSnackbar'; // Import Snackbar
import logo from '../assets/logo.png'; // Ensure this path is correct

// Custom colors
const colors = {
    navbarBackground: '#059212',
    navbarText: '#FFFFFF',
    navbarHover: '#4CAF50',
    background: '#FFF8E8',
    cardBackground: '#FFFFFF',
    summaryBackground: '#FFF455',
};

// Summary Card Component
const SummaryCard = ({ title, value, icon }) => (
    <Card
        sx={{
            backgroundColor: colors.summaryBackground,
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            boxShadow: 3,
        }}
    >
        <Box sx={{ mr: 2 }}>{icon}</Box>
        <Box>
            <Typography variant="subtitle1" color="textSecondary">
                {title}
            </Typography>
            <Typography variant="h6">{value}</Typography>
        </Box>
    </Card>
);

const Dashboard = ({ toggleColorMode, mode }) => {
    const [carts, setCarts] = useState([]);
    const [products, setProducts] = useState([]);
    const [shippingInfo, setShippingInfo] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Modal States
    const [openProductModal, setOpenProductModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const [openCartModal, setOpenCartModal] = useState(false);
    const [currentCart, setCurrentCart] = useState(null);

    const [openShippingModal, setOpenShippingModal] = useState(false);
    const [currentShipping, setCurrentShipping] = useState(null);

    // Notification States
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success', // 'success' | 'error' | 'warning' | 'info'
    });

    // Fetch Data from API
    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const cartsResponse = await api.get('/cart');
            const productsResponse = await api.get('/products');
            const shippingInfoResponse = await api.get('/shippings');

            setCarts(cartsResponse.data);
            setProducts(productsResponse.data);
            setShippingInfo(shippingInfoResponse.data);
        } catch (error) {
            console.error('Error fetching data', error);
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
        } else {
            fetchData();
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Handler Functions

    // Products Handlers
    const handleAddProduct = () => {
        setCurrentProduct(null);
        setOpenProductModal(true);
    };

    const handleEditProduct = (product) => {
        setCurrentProduct(product);
        setOpenProductModal(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${productId}`);
                setNotification({
                    open: true,
                    message: 'Product deleted successfully.',
                    severity: 'success',
                });
                fetchData(); // Refresh data after deletion
            } catch (err) {
                console.error('Error deleting product', err);
                setNotification({
                    open: true,
                    message: 'Failed to delete product.',
                    severity: 'error',
                });
            }
        }
    };

    // Carts (Orders) Handlers
    const handleAddCart = () => {
        setCurrentCart(null);
        setOpenCartModal(true);
    };

    const handleEditCart = (cart) => {
        setCurrentCart(cart);
        setOpenCartModal(true);
    };

    const handleDeleteCart = async (cartId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await api.delete(`/cart/${cartId}`);
                setNotification({
                    open: true,
                    message: 'Order deleted successfully.',
                    severity: 'success',
                });
                fetchData(); // Refresh data after deletion
            } catch (err) {
                console.error('Error deleting order', err);
                setNotification({
                    open: true,
                    message: 'Failed to delete order.',
                    severity: 'error',
                });
            }
        }
    };

    // ShippingInfo Handlers
    const handleAddShipping = () => {
        setCurrentShipping(null);
        setOpenShippingModal(true);
    };

    const handleEditShipping = (shipping) => {
        setCurrentShipping(shipping);
        setOpenShippingModal(true);
    };

    const handleDeleteShipping = async (shippingId) => {
        if (window.confirm('Are you sure you want to delete this shipping information?')) {
            try {
                await api.delete(`/shippings/${shippingId}`);
                setNotification({
                    open: true,
                    message: 'Shipping information deleted successfully.',
                    severity: 'success',
                });
                fetchData(); // Refresh data after deletion
            } catch (err) {
                console.error('Error deleting shipping information', err);
                setNotification({
                    open: true,
                    message: 'Failed to delete shipping information.',
                    severity: 'error',
                });
            }
        }
    };

    // Define columns for DataGrid with action buttons
    const productColumns = [
        { field: 'id', headerName: 'Product ID', width: 150 },
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'price',
            headerName: 'Price',
            width: 150,
            type: 'number',
            renderCell: (params) => (
                <Typography variant="body2">${params.value.toFixed(2)}</Typography>
            ),
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 300,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ paddingLeft: 1 }}>
                    {params.value}
                </Typography>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => handleEditProduct(params.row)}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        color="secondary"
                        onClick={() => handleDeleteProduct(params.row.id)}
                    >
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    const cartColumns = [
        { field: 'orderId', headerName: 'Order ID', width: 150 },
        { field: 'itemName', headerName: 'Item Name', width: 200 },
        {
            field: 'price',
            headerName: 'Price',
            width: 130,
            type: 'number',
            renderCell: (params) => (
                <Typography variant="body2">${params.value.toFixed(2)}</Typography>
            ),
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            width: 100,
            type: 'number',
            renderCell: (params) => (
                <Typography variant="body2">{params.value}</Typography>
            ),
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => handleEditCart(params.row)}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        color="secondary"
                        onClick={() => handleDeleteCart(params.row.id)}
                    >
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    const shippingColumns = [
        { field: 'orderId', headerName: 'Order ID', width: 150 },
        { field: 'fullName', headerName: 'Full Name', width: 200 },
        { field: 'phoneNumber', headerName: 'Phone Number', width: 150 },
        { field: 'email', headerName: 'Email', width: 300 },
        { field: 'address', headerName: 'Address', width: 350 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'postalCode', headerName: 'Postal Code', width: 130 },
        { field: 'country', headerName: 'Country', width: 150 },
        { field: 'status', headerName: 'Status', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <>
                    <IconButton
                        color="primary"
                        onClick={() => handleEditShipping(params.row)}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        color="secondary"
                        onClick={() => handleDeleteShipping(params.row.id)}
                    >
                        <Delete />
                    </IconButton>
                </>
            ),
        },
    ];

    // Prepare rows for DataGrid
    const cartRows = carts.flatMap((cart) =>
        cart.items.map((item) => ({
            id: `${cart.orderId}-${item.id}`, // Unique ID for DataGrid
            orderId: cart.orderId,
            itemName: item.name,
            price: item.price,
            quantity: item.quantity,
        }))
    );

    const productRows = products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
    }));

    const shippingRows = shippingInfo.map((info) => ({
        id: info.id,
        orderId: info.orderId,
        fullName: info.fullName,
        phoneNumber: info.phoneNumber,
        email: info.email,
        address: info.address,
        city: info.city,
        postalCode: info.postalCode,
        country: info.country,
        status: info.status, // Ensure status is included
    }));

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {/* Navbar */}
            <AppBar position="static" sx={{ background: colors.navbarBackground }}>
                <Toolbar>
                    <img src={logo} alt="Company Logo" style={{ height: '40px', marginRight: '16px' }} />
                    <Typography variant="h6" sx={{ flexGrow: 1, color: colors.navbarText }}>
                        Unique Agrisciences Dashboard
                    </Typography>
                    <IconButton sx={{ ml: 1 }} onClick={toggleColorMode} color="inherit">
                        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                    <LogoutButton />
                </Toolbar>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                >
                    <Tab label="Products" icon={<Inventory />} />
                    <Tab label="Orders" icon={<ShoppingCart />} />
                    <Tab label="Shipping Info" icon={<LocalShipping />} />
                </Tabs>
            </AppBar>

            {/* Summary Cards */}
            <Container maxWidth="xl" sx={{ padding: 3, backgroundColor: colors.background }}>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                        <SummaryCard
                            title="Total Products"
                            value={products.length}
                            icon={<Inventory color="primary" sx={{ fontSize: 40 }} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SummaryCard
                            title="Total Orders"
                            value={carts.length}
                            icon={<ShoppingCart color="primary" sx={{ fontSize: 40 }} />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SummaryCard
                            title="Total Shipping Info"
                            value={shippingInfo.length}
                            icon={<LocalShipping color="primary" sx={{ fontSize: 40 }} />}
                        />
                    </Grid>
                </Grid>

                {/* Main Content */}
                <Card variant="outlined" sx={{ backgroundColor: colors.cardBackground, padding: 2, boxShadow: 3 }}>
                    <CardContent>
                        {/* Products Section */}
                        {tabValue === 0 && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="h5">Products</Typography>
                                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddProduct}>
                                        Add Product
                                    </Button>
                                </Box>
                                <DataGrid
                                    rows={productRows}
                                    columns={productColumns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10, 25, 50]}
                                    autoHeight
                                    disableSelectionOnClick
                                    sx={{
                                        '& .MuiDataGrid-root': {
                                            border: 'none',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            borderBottom: 'none',
                                            padding: '16px', // Increased padding for spacing
                                        },
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: colors.summaryBackground,
                                            borderBottom: 'none',
                                        },
                                        '& .MuiDataGrid-footerContainer': {
                                            borderTop: 'none',
                                        },
                                        '& .MuiDataGrid-row:nth-of-type(even)': {
                                            backgroundColor: '#FAFAFA',
                                        },
                                        '& .MuiDataGrid-row:hover': {
                                            backgroundColor: '#F1F1F1',
                                        },
                                    }}
                                />
                            </Box>
                        )}

                        {/* Orders Section */}
                        {tabValue === 1 && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 4 }}>
                                    <Typography variant="h5">Orders</Typography>
                                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddCart}>
                                        Add Order
                                    </Button>
                                </Box>
                                <DataGrid
                                    rows={cartRows}
                                    columns={cartColumns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10, 25, 50]}
                                    autoHeight
                                    disableSelectionOnClick
                                    sx={{
                                        '& .MuiDataGrid-root': {
                                            border: 'none',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            borderBottom: 'none',
                                            padding: '16px', // Increased padding for spacing
                                        },
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: colors.summaryBackground,
                                            borderBottom: 'none',
                                        },
                                        '& .MuiDataGrid-footerContainer': {
                                            borderTop: 'none',
                                        },
                                        '& .MuiDataGrid-row:nth-of-type(even)': {
                                            backgroundColor: '#FAFAFA',
                                        },
                                        '& .MuiDataGrid-row:hover': {
                                            backgroundColor: '#F1F1F1',
                                        },
                                    }}
                                />
                            </Box>
                        )}

                        {/* Shipping Information Section */}
                        {tabValue === 2 && (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, mt: 4 }}>
                                    <Typography variant="h5">Shipping Information</Typography>
                                    <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleAddShipping}>
                                        Add Shipping Info
                                    </Button>
                                </Box>
                                <DataGrid
                                    rows={shippingRows}
                                    columns={shippingColumns}
                                    pageSize={10}
                                    rowsPerPageOptions={[10, 25, 50]}
                                    autoHeight
                                    disableSelectionOnClick
                                    sx={{
                                        '& .MuiDataGrid-root': {
                                            border: 'none',
                                        },
                                        '& .MuiDataGrid-cell': {
                                            borderBottom: 'none',
                                            padding: '16px', // Increased padding for spacing
                                        },
                                        '& .MuiDataGrid-columnHeaders': {
                                            backgroundColor: colors.summaryBackground,
                                            borderBottom: 'none',
                                        },
                                        '& .MuiDataGrid-footerContainer': {
                                            borderTop: 'none',
                                        },
                                        '& .MuiDataGrid-row:nth-of-type(even)': {
                                            backgroundColor: '#FAFAFA',
                                        },
                                        '& .MuiDataGrid-row:hover': {
                                            backgroundColor: '#F1F1F1',
                                        },
                                    }}
                                />
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Container>

            {/* Render Modals */}
            <ProductModal
                open={openProductModal}
                handleClose={() => setOpenProductModal(false)}
                product={currentProduct}
                refreshProducts={fetchData}
                setNotification={setNotification} // Pass setNotification
            />

            <CartModal
                open={openCartModal}
                handleClose={() => setOpenCartModal(false)}
                cart={currentCart}
                refreshCarts={fetchData}
                setNotification={setNotification} // Pass setNotification
            />

            <ShippingInfoModal
                open={openShippingModal}
                handleClose={() => setOpenShippingModal(false)}
                shipping={currentShipping}
                refreshShipping={fetchData}
                setNotification={setNotification} // Pass setNotification
            />

            {/* Notification Snackbar */}
            <NotificationSnackbar
                open={notification.open}
                onClose={() => setNotification({ ...notification, open: false })}
                message={notification.message}
                severity={notification.severity}
            />
        </>
    )
    };

    export default Dashboard;
