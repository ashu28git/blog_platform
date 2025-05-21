import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box } from '@mui/material';

export default function EditPost() {
    const router = useRouter();
    const { id } = router.query;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (!id) return;
        axios.get('http://localhost:3001/posts')
            .then(res => {
                const post = res.data.find(p => p.id == id);
                if (post) {
                    setTitle(post.title);
                    setContent(post.content);
                }
            });
    }, [id]);

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to edit.');
            return;
        }

        try {
            await axios.put(`http://localhost:3001/posts/${id}`, {
                title,
                content
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Post updated successfully!');
            router.push('/');
        } catch (err) {
            console.error(err.response?.data || err.message);
            alert('Failed to update post.');
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 6 }}>
            <Typography variant="h4" gutterBottom>Edit Post</Typography>
            <TextField
                label="Title"
                fullWidth
                value={title}
                onChange={e => setTitle(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                label="Content"
                fullWidth
                multiline
                minRows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button variant="contained" onClick={handleUpdate}>Update</Button>
        </Container>
    );
}
