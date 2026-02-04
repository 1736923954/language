import request from './request';

export interface User {
  id: number;
  username: string;
  email: string;
  nickname: string;
  role: string;
  level: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export const authAPI = {
  // 登录
  login(credentials: LoginRequest) {
    return request.post<LoginResponse>('/auth/login', credentials);
  },

  // 注册
  register(data: RegisterRequest) {
    return request.post<LoginResponse>('/auth/register', data);
  },

  // 刷新 Token
  refreshToken() {
    return request.post<{ token: string }>('/auth/refresh');
  },

  // 登出
  logout() {
    return request.post('/auth/logout');
  },

  // 获取当前用户信息
  getCurrentUser() {
    return request.get<User>('/users/profile');
  },
};
