export interface UserData {
  id: number;
  email: string;
  name: string;
  user_type: string;
  created_at: string;
  updated_at: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: UserData;
  token: string;
} 