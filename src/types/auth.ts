export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export interface UserData {
  id: number;
  email: string;
  name: string;
  user_type: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  data: {
    token: string;
    user: UserData;
  };
} 