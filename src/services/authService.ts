import axios from 'axios';
import { LoginData, SignUpData, AuthResponse } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

if (!process.env.REACT_APP_API_URL) {
  console.warn('REACT_APP_API_URL is not defined in environment variables, using default: http://localhost:3001');
}

export const authService = {
  // 로그인
  login: async (data: LoginData): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: data.email,
        password: data.password,
      });
      
      console.log('Login response:', response.data); // 응답 데이터 로깅
      
      // 로그인 성공 시 토큰과 사용자 정보 저장
      if (response.data.status === 'success' && response.data.data) {
        const { token, user } = response.data.data;
        console.log('Token and user data:', { token, user }); // 토큰과 사용자 데이터 로깅
        localStorage.setItem('user', JSON.stringify({ ...user, token }));
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
      }
      throw error;
    }
  },

  // 회원가입
  signup: async (data: SignUpData): Promise<AuthResponse> => {
    try {
      // 회원가입 시에는 원본 비밀번호 전송
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email: data.email,
        password: data.password,
        name: data.name,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
      }
      throw error;
    }
  },

  // 로그아웃
  logout: async (): Promise<void> => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
      // 로그아웃 시 저장된 정보 삭제
      localStorage.removeItem('user');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '로그아웃에 실패했습니다.');
      }
      throw error;
    }
  },

  // 현재 사용자 정보 조회
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      const response = await axios.get<AuthResponse>(`${API_URL}/auth/me`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '사용자 정보를 불러오는데 실패했습니다.');
      }
      throw error;
    }
  },
}; 