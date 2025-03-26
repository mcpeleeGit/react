import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MCP
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {user?.name}님 환영합니다
          </Typography>
          {user?.role === 'admin' && (
            <Button 
              color="inherit" 
              onClick={() => navigate('/admin')}
              sx={{ mr: 2 }}
            >
              관리자
            </Button>
          )}
          <Button color="inherit" onClick={handleLogout}>
            로그아웃
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" gutterBottom>
            환영합니다!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            MCP 서비스에 오신 것을 환영합니다.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/blog')}
            sx={{ mt: 2 }}
          >
            블로그 보기
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home; 