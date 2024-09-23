import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook
import { 
    Container, 
    Typography, 
    TextField, 
    Button, 
    Box, 
    Alert 
} from '@mui/material';
import { green,blue, pink } from '@mui/material/colors';

const Login = () => {
    const { login } = useAuth(); // Extract login function from context
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            window.location.href = '/dashboard';  // Redirect to the dashboard after login
        } catch (err) {
            setError('Login failed. Please check your credentials.');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ padding: 4 }}>
            <Typography 
                variant="h4" 
                component="h1" 
                align="center" 
                gutterBottom 
                sx={{ color: green[600] }}  // Light green color
            >
                Admin Login
            </Typography>
            <Box
                component="form"
                onSubmit={handleLogin}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', padding: 3, borderRadius: 2, boxShadow: 3 }}
            >
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <Alert severity="error" sx={{ width: '100%', marginTop: 2 }}>{error}</Alert>}
                <Button
                    type="submit"
                    variant="contained"
                    sx={{ 
                        marginTop: 3, 
                        backgroundColor: blue[500],  // Peach color
                        color: 'white',
                        '&:hover': {
                            backgroundColor: pink[400],
                        },
                    }}
                >
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default Login;
