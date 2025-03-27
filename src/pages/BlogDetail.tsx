import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { BlogPost, BlogCreateRequest, BlogUpdateRequest } from '../types/blog';
import { ApiResponse } from '../types/api';
import Navigation from '../components/Navigation';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<BlogCreateRequest>({
    title: '',
    content: '',
  });
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogDetail(Number(id));
      if (response.status === 'success' && response.data) {
        setPost(response.data);
        setFormData({
          title: response.data.title,
          content: response.data.content,
        });
      } else {
        setError(response.message || '게시물을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('게시물을 불러오는데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateData: BlogUpdateRequest = {
        id: Number(id),
        title: formData.title,
        content: formData.content,
      };
      const response = await blogService.updateBlogPost(Number(id), updateData);
      if (response.status === 'success' && response.data) {
        setPost(response.data);
        setError(null);
        handleCloseDialog();
      } else {
        setError(response.message || '게시물 수정에 실패했습니다.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('게시물 수정에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await blogService.deleteBlogPost(Number(id));
      if (response.status === 'success') {
        navigate('/blog');
      } else {
        setError(response.message || '게시물 삭제에 실패했습니다.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('게시물 삭제에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Box>
        <Navigation />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" color="error">
            게시물을 찾을 수 없습니다.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              {post.title}
            </Typography>
            <Box>
              {user && (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleOpenDialog}
                    sx={{ mr: 1 }}
                  >
                    수정
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                  >
                    삭제
                  </Button>
                </>
              )}
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            작성자: {post.author.name} | 작성일: {new Date(post.created_at).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ mt: 3, whiteSpace: 'pre-wrap' }}>
            {post.content}
          </Typography>
        </Paper>
      </Container>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>게시물 수정</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit}>
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
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                수정
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/blog')}
              >
                목록으로
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BlogDetail; 