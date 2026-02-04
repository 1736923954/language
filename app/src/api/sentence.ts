import request from './request';

export interface Sentence {
  id: number;
  vocabulary_id: number;
  english_text: string;
  chinese_translation: string;
  usage_context: string;
  difficulty_level: string;
  created_at: string;
}

export interface SentenceListParams {
  page?: number;
  limit?: number;
  vocabulary_id?: number;
  difficulty_level?: string;
}

export const sentenceAPI = {
  // 获取句子列表
  getList(params?: SentenceListParams) {
    return request.get<{ data: Sentence[]; pagination: any }>('/sentences', {
      data: params,
    });
  },

  // 获取单个句子
  getById(id: number) {
    return request.get<Sentence>(`/sentences/${id}`);
  },

  // 按词汇获取句子
  getByVocabulary(vocabularyId: number, params?: SentenceListParams) {
    return request.get<{ data: Sentence[]; pagination: any }>(
      `/sentences/vocabulary/${vocabularyId}`,
      { data: params }
    );
  },

  // 创建句子（管理员）
  create(data: Partial<Sentence>) {
    return request.post<Sentence>('/sentences', data);
  },

  // 更新句子（管理员）
  update(id: number, data: Partial<Sentence>) {
    return request.put<Sentence>(`/sentences/${id}`, data);
  },

  // 删除句子（管理员）
  delete(id: number) {
    return request.delete(`/sentences/${id}`);
  },
};
