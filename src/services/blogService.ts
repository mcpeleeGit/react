import axios from 'axios';
import { ApiResponse } from '../types/api';
import { BlogPost, BlogListResponse, BlogCreateRequest, BlogUpdateRequest } from '../types/blog';

const API_URL = process.env.REACT_APP_API_URL;

// 토큰을 가져오는 함수
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 추가
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const blogService = {
  // 블로그 목록 조회 (페이지네이션 지원)
  getBlogList: async (page: number = 1, limit: number = 10): Promise<ApiResponse<BlogListResponse>> => {
    try {
      const response = await api.get<ApiResponse<BlogListResponse>>('/blog/list', {
        params: {
          page,
          limit
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('로그인이 필요합니다.');
        }
        throw new Error(error.response?.data?.message || '블로그 목록을 불러오는데 실패했습니다.');
      }
      throw error;
    }
  },

  // 블로그 상세 조회
  getBlogDetail: async (id: number): Promise<ApiResponse<BlogPost>> => {
    try {
      const response = await api.get<ApiResponse<BlogPost>>('/blog/detail', {
        params: { id }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('로그인이 필요합니다.');
        }
        throw new Error(error.response?.data?.message || '블로그 글을 불러오는데 실패했습니다.');
      }
      throw error;
    }
  },

  // 게시물 작성
  createBlogPost: async (data: BlogCreateRequest): Promise<ApiResponse<BlogPost>> => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('로그인이 필요합니다.');
      }

      const response = await api.post<ApiResponse<BlogPost>>('/blog/write', data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('로그인이 필요합니다.');
        }
        throw new Error(error.response?.data?.message || '게시물 작성에 실패했습니다.');
      }
      throw error;
    }
  },

  // 게시물 수정
  updateBlogPost: async (id: number, data: BlogUpdateRequest): Promise<ApiResponse<BlogPost>> => {
    try {
      const response = await api.put<ApiResponse<BlogPost>>(`/blog/update/${id}`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('로그인이 필요합니다.');
        }
        throw new Error(error.response?.data?.message || '게시물 수정에 실패했습니다.');
      }
      throw error;
    }
  },

  // 게시물 삭제
  deleteBlogPost: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete<ApiResponse<void>>('/blog/delete', {
        data: { id }
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('로그인이 필요합니다.');
        }
        throw new Error(error.response?.data?.message || '게시물 삭제에 실패했습니다.');
      }
      throw error;
    }
  },
}; 