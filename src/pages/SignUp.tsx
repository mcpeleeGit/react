import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ApiResponse } from '../types/api';
import { UserData } from '../types/user';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { cryptoUtils } from '../utils/crypto';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLoading) return; // 로딩 중에는 입력 방지
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // 로딩 중에는 제출 방지

    if (formData.password !== formData.confirmPassword) {
      toast.error('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true); // 로딩 시작
      const response: ApiResponse<UserData> = await authService.signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      if (response.status === 'success') {
        // 회원가입 성공 후 자동 로그인
        try {
          const loginResponse = await authService.login({
            email: formData.email,
            password: formData.password,  // 원본 비밀번호 전달
          });

          if (loginResponse.status === 'success' && loginResponse.data) {
            const userData = {
              id: loginResponse.data.user.id,
              email: loginResponse.data.user.email,
              name: loginResponse.data.user.name,
              role: (loginResponse.data.user.user_type === 'admin' ? 'admin' : 'user') as 'user' | 'admin'
            };
            login(userData);  // authService.login() 대신 login() 함수 사용
            toast.success('회원가입이 완료되었습니다.');
            navigate('/');  // 홈으로 리다이렉트
          } else {
            toast.error('로그인에 실패했습니다. 다시 로그인해주세요.');
            navigate('/login');
          }
        } catch (loginErr) {
          toast.error('로그인에 실패했습니다. 다시 로그인해주세요.');
          navigate('/login');
        }
      } else {
        toast.error(response.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            회원가입
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">이메일</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="이메일"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">비밀번호 확인</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="name" className="sr-only">이름</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="이름"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  처리 중...
                </span>
              ) : (
                '회원가입'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 