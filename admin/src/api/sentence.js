import request from './request';

export const sentenceAPI = {
  // 获取句子列表
  getList(params) {
    return request.get('/sentences', { params });
  },

  // 获取单个句子
  getById(id) {
    return request.get(`/sentences/${id}`);
  },

  // 创建句子
  create(data) {
    return request.post('/sentences', data);
  },

  // 更新句子
  update(id, data) {
    return request.put(`/sentences/${id}`, data);
  },

  // 删除句子
  delete(id) {
    return request.delete(`/sentences/${id}`);
  },

  // 按词汇获取句子
  getByVocabulary(vocabularyId, params) {
    return request.get(`/sentences/vocabulary/${vocabularyId}`, { params });
  },
};
