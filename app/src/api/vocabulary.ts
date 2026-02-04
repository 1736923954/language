import request from './request';

export interface Vocabulary {
  id: number;
  word: string;
  phonetic: string;
  definition: string;
  definition_zh: string;
  part_of_speech: string;
  difficulty_level: string;
  category_id: number;
  example_count: number;
  created_at: string;
}

export interface VocabularyListParams {
  page?: number;
  limit?: number;
  word?: string;
  category_id?: number;
  difficulty_level?: string;
}

export const vocabularyAPI = {
  // 获取词汇列表
  getList(params?: VocabularyListParams) {
    return request.get<{ data: Vocabulary[]; pagination: any }>('/vocabularies', {
      data: params,
    });
  },

  // 获取单个词汇
  getById(id: number) {
    return request.get<Vocabulary>(`/vocabularies/${id}`);
  },

  // 按分类获取词汇
  getByCategory(categoryId: number, params?: VocabularyListParams) {
    return request.get<{ data: Vocabulary[]; pagination: any }>(
      `/vocabularies/category/${categoryId}`,
      { data: params }
    );
  },

  // 创建词汇（管理员）
  create(data: Partial<Vocabulary>) {
    return request.post<Vocabulary>('/vocabularies', data);
  },

  // 更新词汇（管理员）
  update(id: number, data: Partial<Vocabulary>) {
    return request.put<Vocabulary>(`/vocabularies/${id}`, data);
  },

  // 删除词汇（管理员）
  delete(id: number) {
    return request.delete(`/vocabularies/${id}`);
  },
};
