import axios from 'axios';
import { ApiResponse } from '../types/api';
import { UserData } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
});

// 요청 인터셉터 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  // 사용자 목록 조회 (페이지네이션 지원)
  getUsers: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<UserData>> => {
    try {
      const response = await api.get<PaginatedResponse<UserData>>('/user/users', {
        params: {
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '사용자 목록을 불러오는데 실패했습니다.');
      }
      throw error;
    }
  },

  // 단일 사용자 조회
  getUser: async (id: number): Promise<ApiResponse<UserData>> => {
    try {
      const response = await api.get<ApiResponse<UserData>>('/user/user', {
        params: { id }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '사용자 정보를 불러오는데 실패했습니다.');
      }
      throw error;
    }
  },

  // 사용자 등록
  createUser: async (data: Omit<UserData, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<UserData>> => {
    try {
      const response = await api.post<ApiResponse<UserData>>('/user/user', data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '사용자 등록에 실패했습니다.');
      }
      throw error;
    }
  },

  // 사용자 수정
  updateUser: async (id: number, data: Partial<UserData>): Promise<ApiResponse<UserData>> => {
    try {
      const response = await api.put<ApiResponse<UserData>>('/user/user', data, {
        params: { id }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '사용자 수정에 실패했습니다.');
      }
      throw error;
    }
  },

  // 사용자 삭제
  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete<ApiResponse<void>>('/user/user', {
        params: { id }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '사용자 삭제에 실패했습니다.');
      }
      throw error;
    }
  },
}; 