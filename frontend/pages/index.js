import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Container, Typography, Button, Box, Paper, Stack } from '@mui/material';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    axios.get(`${baseURL}/posts`)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err));

    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to delete a post');
      return;
    }

    try {
      await axios.delete(`${baseURL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(prev => prev.filter(post => post.id !== id));
      alert('Post deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err.response?.data || err.message);
      alert('Failed to delete post. You may not be the author.');
    }
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center', color: '#fff' }}>
          Blog Posts
        </Typography>

        {isLoggedIn && (
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Link href="/create-post" passHref>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#ff4081',
                  '&:hover': { backgroundColor: '#f50057' },
                  color: '#fff',
                }}
              >
                Create Post
              </Button>
            </Link>
          </Box>
        )}

        {posts.length === 0 && (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 4, color: '#fff' }}>
            No posts available.
          </Typography>
        )}

        {posts.map(post => (
          <Paper
            key={post.id}
            elevation={4}
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: '#fff',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {post.title}
            </Typography>
            <Typography sx={{ mb: 2 }}>{post.content}</Typography>
            <Typography variant="caption" color="text.secondary">
              Author: {post.author}
            </Typography>

            {isLoggedIn && (
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </Button>
                <Link href={`/edit-post/${post.id}`} passHref>
                  <Button variant="outlined" color="primary">Edit</Button>
                </Link>
              </Stack>

            )}
          </Paper>
        ))}
      </Container>
    </Box>
  );
}
