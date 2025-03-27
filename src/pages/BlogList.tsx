import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { blogService } from '../services/blogService';
import { BlogPost, BlogCreateRequest } from '../types/blog';
import { ApiResponse } from '../types/api';
import Navigation from '../components/Navigation';

const ITEMS_PER_PAGE = 10;

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<BlogCreateRequest>({
    title: '',
    content: '',
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogList(page, ITEMS_PER_PAGE);
      console.log('Fetch posts response:', response);
      if (response.status === 'success' && response.data) {
        setPosts(response.data.posts);
        setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE));
      } else {
        setError(response.message || '블로그 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Fetch posts error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('블로그 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleOpenDialog = () => {
    if (!user) {
      setError('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ title: '', content: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    try {
      setLoading(true);
      console.log('Calling createBlogPost...');
      const response = await blogService.createBlogPost(formData);
      console.log('Create blog response:', response);
      if (response.status === 'success' && response.data) {
        setPosts([response.data, ...posts]);
        handleCloseDialog();
        setError(null);
      } else {
        setError(response.message || '게시물 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('Create blog error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('게시물 작성에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading && page === 1) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            블로그
          </Typography>
          {user && (
            <Button variant="contained" onClick={handleOpenDialog}>
              글쓰기
            </Button>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {posts.map((post) => (
            <Paper
              key={post.id}
              sx={{ p: 2, cursor: 'pointer' }}
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <Typography variant="h6" component="h2">
                {post.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                작성자: {post.author.name} | 작성일: {new Date(post.created_at).toLocaleDateString()}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={pageNum === page ? 'contained' : 'outlined'}
              onClick={() => handlePageChange(pageNum)}
              sx={{ mx: 0.5 }}
            >
              {pageNum}
            </Button>
          ))}
        </Box>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>새 게시물 작성</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="제목"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="내용"
              name="content"
              value={formData.content}
              onChange={handleChange}
              margin="normal"
              required
              multiline
              rows={10}
            />
          </DialogContent>
          <DialogActions>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              작성
            </Button>
            <Button
              variant="outlined"
              onClick={handleCloseDialog}
            >
              취소
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default BlogList; 