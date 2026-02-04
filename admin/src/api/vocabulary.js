import request from './request';

export const vocabularyAPI = {
  // 获取词汇列表
  getList(params) {
    return request.get('/vocabularies', { params });
  },

  // 获取单个词汇
  getById(id) {
    return request.get(`/vocabularies/${id}`);
  },

  // 创建词汇
  create(data) {
    return request.post('/vocabularies', data);
  },

  // 更新词汇
  update(id, data) {
    return request.put(`/vocabularies/${id}`, data);
  },

  // 删除词汇
  delete(id) {
    return request.delete(`/vocabularies/${id}`);
  },

  // 按分类获取词汇
  getByCategory(categoryId, params) {
    return request.get(`/vocabularies/category/${categoryId}`, { params });
  },
};
