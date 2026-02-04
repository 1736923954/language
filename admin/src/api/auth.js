import request from './request';

export const authAPI = {
  // 登录
  login(credentials) {
    return request.post('/auth/login', credentials);
  },

  // 注册
  register(data) {
    return request.post('/auth/register', data);
  },

  // 刷新 Token
  refreshToken() {
    return request.post('/auth/refresh');
  },

  // 登出
  logout() {
    return request.post('/auth/logout');
  },

  // 获取当前用户信息
  getCurrentUser() {
    return request.get('/users/profile');
  },
};
