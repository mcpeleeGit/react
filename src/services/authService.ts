import axios from 'axios';
import { cryptoUtils } from '../utils/crypto';
import { ApiResponse } from '../types/api';
import { UserData, SignUpData, LoginData, LoginResponseData } from '../types/user';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

if (!process.env.REACT_APP_API_URL) {
  console.warn('REACT_APP_API_URL is not defined in environment variables, using default: http://localhost:8000');
}

export const authService = {
  signup: async (data: SignUpData): Promise<ApiResponse<UserData>> => {
    try {
      const response = await axios.post<ApiResponse<UserData>>(`${API_URL}/auth/signup`, 
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Security-Token': cryptoUtils.generateSecureRandom(16),
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // CORS 에러 처리
        if (error.code === 'ERR_NETWORK' || error.message.includes('CORS')) {
          throw new Error('서버 연결에 실패했습니다. CORS 설정을 확인해주세요.');
        }
        
        // 서버 응답이 없는 경우
        if (!error.response) {
          throw new Error('서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        }

        const errorResponse = error.response.data as ApiResponse<UserData>;
        
        // HTTP 상태 코드별 에러 처리
        switch (error.response.status) {
          case 400:
            throw new Error(errorResponse?.message || '잘못된 요청입니다. 입력값을 확인해주세요.');
          case 401:
            throw new Error(errorResponse?.message || '인증에 실패했습니다.');
          case 403:
            throw new Error(errorResponse?.message || '접근이 거부되었습니다.');
          case 404:
            throw new Error(errorResponse?.message || '요청한 리소스를 찾을 수 없습니다.');
          case 500:
            throw new Error(errorResponse?.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          default:
            throw new Error(errorResponse?.message || '회원가입 중 오류가 발생했습니다.');
        }
      }
      throw error;
    }
  },

  login: async (data: LoginData): Promise<ApiResponse<LoginResponseData>> => {
    try {
      const hashedPassword = cryptoUtils.hashPassword(data.password);
      const response = await axios.post<ApiResponse<LoginResponseData>>(`${API_URL}/auth/login`, 
        { ...data, password: hashedPassword },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Security-Token': cryptoUtils.generateSecureRandom(16),
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
      }
      throw error;
    }
  },
}; 