import request from './request';

export const categoryAPI = {
  // 获取所有分类
  getList(params) {
    return request.get('/categories', { params });
  },

  // 获取单个分类
  getById(id) {
    return request.get(`/categories/${id}`);
  },

  // 创建分类
  create(data) {
    return request.post('/categories', data);
  },

  // 更新分类
  update(id, data) {
    return request.put(`/categories/${id}`, data);
  },

  // 删除分类
  delete(id) {
    return request.delete(`/categories/${id}`);
  },
};
