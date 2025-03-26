import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          관리자 대시보드
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                }
              }}
              onClick={() => navigate('/admin/users')}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  사용자 관리
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  사용자 목록 조회, 권한 관리, 계정 활성화/비활성화
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  블로그 관리
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  게시글 관리, 댓글 관리, 카테고리 관리
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  시스템 설정
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  시스템 환경 설정, 로그 확인, 백업 관리
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  통계
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  사용자 통계, 게시글 통계, 방문자 통계
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 