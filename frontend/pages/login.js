import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:3001/login', { username, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', username);
            router.push('/');
        } catch {
            setError('Invalid username or password');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#e3f2fd',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
            }}
        >
            <Container
                maxWidth="xs"
                sx={{
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 3,
                    padding: 4,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Login
                </Typography>
                <TextField
                    label="Username" fullWidth margin="normal"
                    value={username} onChange={e => setUsername(e.target.value)}
                />
                <TextField
                    label="Password" type="password" fullWidth margin="normal"
                    value={password} onChange={e => setPassword(e.target.value)}
                />
                {error && <Typography color="error">{error}</Typography>}
                <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>
                    Login
                </Button>
            </Container>
        </Box>
    );
}
