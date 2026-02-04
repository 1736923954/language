import request from './request';

export const userAPI = {
  // 获取用户列表
  getList(params) {
    return request.get('/users', { params });
  },

  // 获取单个用户
  getById(id) {
    return request.get(`/users/${id}`);
  },

  // 更新用户
  update(id, data) {
    return request.put(`/users/${id}`, data);
  },

  // 删除用户
  delete(id) {
    return request.delete(`/users/${id}`);
  },

  // 获取用户个人信息
  getProfile() {
    return request.get('/users/profile');
  },

  // 更新个人信息
  updateProfile(data) {
    return request.put('/users/profile', data);
  },
};
