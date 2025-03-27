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
  CardActionArea,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  People as PeopleIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    {
      title: '사용자 관리',
      description: '사용자 등록, 수정, 삭제 및 권한 관리',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: '/admin/users',
    },
    {
      title: '블로그 관리',
      description: '게시글 및 댓글 관리',
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      path: '/admin/blog',
    },
    {
      title: '시스템 설정',
      description: '서버 설정 및 환경 구성',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      path: '/admin/settings',
    },
    {
      title: '통계',
      description: '시스템 사용 통계 및 모니터링',
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      path: '/admin/stats',
    },
  ];

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

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          관리자 대시보드
        </Typography>
        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardActionArea 
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {item.icon}
                  </Box>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography gutterBottom variant="h6" component="h2">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard; 