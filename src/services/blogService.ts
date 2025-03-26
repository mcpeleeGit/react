import axios from 'axios';
import { BlogApiResponse } from '../types/blog';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const blogService = {
  getBlogList: async (): Promise<BlogApiResponse> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('인증 토큰이 없습니다.');
      }

      const response = await axios.get<BlogApiResponse>(`${API_URL}/blog/list`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('인증되지 않은 요청입니다.');
        }
        throw new Error(error.response?.data?.message || '블로그 목록 조회 중 오류가 발생했습니다.');
      }
      throw error;
    }
  },
}; 