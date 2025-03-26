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
import { cryptoUtils } from '../utils/crypto';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setError('');
    setSuccess('');
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    try {
      // 패스워드 암호화
      const hashedPassword = cryptoUtils.hashPassword(formData.password);
      
      const response = await authService.signup({
        email: formData.email,
        password: hashedPassword,
        name: formData.name,
      });
      
      if (response.status === 'success' && response.data) {
        setError('');
        // 회원가입 성공 후 자동 로그인
        try {
          const loginResponse = await authService.login({
            email: formData.email,
            password: hashedPassword,
          });

          if (loginResponse.status === 'success' && loginResponse.data) {
            // 토큰과 사용자 정보 저장
            localStorage.setItem('token', loginResponse.data.token);
            localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
            navigate('/dashboard');
          } else {
            setError('로그인에 실패했습니다. 다시 로그인해주세요.');
          }
        } catch (loginErr) {
          setError('로그인에 실패했습니다. 다시 로그인해주세요.');
        }
      } else {
        setError(response.message || '회원가입에 실패했습니다.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입 중 오류가 발생했습니다.');
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="비밀번호 확인"
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {error && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 1 }}>
              {success}
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