import React, { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper
} from '@mui/material';

export default function CreatePost() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please login to create a post');
            return;
        }

        try {
            await axios.post('http://localhost:3001/posts', {
                title,
                content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Post created!');
            router.push('/');
        } catch (err) {
            console.error(err);
            alert('Failed to create post');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 6,
            }}
        >
            <Container maxWidth="sm">
                <Paper elevation={5} sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Create New Post
                    </Typography>
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        label="Content"
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        sx={{ mb: 3 }}
                    />
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        fullWidth
                        sx={{
                            backgroundColor: '#1976d2',
                            '&:hover': { backgroundColor: '#115293' },
                            color: '#fff',
                            py: 1.2
                        }}
                    >
                        Submit Post
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}
