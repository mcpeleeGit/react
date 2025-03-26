import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types/blog';
import { toast } from 'react-toastify';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const BlogList: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogService.getBlogList();
        if (response.status === 'success' && response.data?.posts) {
          setPosts(response.data.posts);
        } else {
          toast.error(response.message || '블로그 목록을 불러오는데 실패했습니다.');
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === '인증되지 않은 요청입니다.') {
            toast.error('로그인이 필요합니다.');
            navigate('/login');
            return;
          }
          toast.error(error.message);
        } else {
          toast.error('블로그 목록을 불러오는데 실패했습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            MCP
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            로그아웃
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          블로그 목록
        </Typography>
        <Box sx={{ mt: 4 }}>
          {posts.map((post) => (
            <Card key={post.id} sx={{ mb: 3 }}>
              <CardHeader
                title={post.title}
                subheader={`작성자: ${post.author.name} | ${new Date(post.created_at).toLocaleDateString()}`}
              />
              <CardContent>
                <Typography variant="body1" color="text.secondary">
                  {post.content}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default BlogList; 