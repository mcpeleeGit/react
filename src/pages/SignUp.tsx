import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { AuthResponse, SignUpData } from '../types/auth';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // 에러 메시지 초기화
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      const response: AuthResponse = await authService.signup(formData);

      if (response.status === 'success' && response.data) {
        // 회원가입 성공 후 자동 로그인
        const loginResponse: AuthResponse = await authService.login({
          email: formData.email,
          password: formData.password,
        });

        if (loginResponse.status === 'success' && loginResponse.data) {
          // 사용자 정보만 저장 (토큰은 쿠키로 자동 저장됨)
          localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
          navigate('/dashboard');
        } else {
          setError(loginResponse.message || '로그인에 실패했습니다.');
        }
      } else {
        setError(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
        <Typography component="h1" variant="h5">
          회원가입
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="이름"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="이메일 주소"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            error={!!error && error.includes('이메일')}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="비밀번호"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : '회원가입'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link href="/login" variant="body2">
              이미 계정이 있으신가요? 로그인
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp; 