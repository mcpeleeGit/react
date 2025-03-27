import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            MCP에 오신 것을 환영합니다
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            회원 관리 시스템
          </Typography>
          {!user && (
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{ mr: 2 }}
              >
                로그인
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/signup')}
              >
                회원가입
              </Button>
            </Box>
          )}
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  회원 관리
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  회원 정보를 쉽게 관리하고 모니터링하세요.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  블로그
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  공지사항과 업데이트 소식을 공유하세요.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  커뮤니티
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  다른 회원들과 소통하고 정보를 공유하세요.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 