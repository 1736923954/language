import request from './request';

export interface UserProgress {
  id: number;
  user_id: number;
  vocabulary_id: number;
  status: 'learning' | 'reviewing' | 'mastered';
  correct_count: number;
  wrong_count: number;
  last_reviewed_at: string;
  next_review_at: string;
  created_at: string;
}

export interface ProgressStatistics {
  total: number;
  mastered: number;
  reviewing: number;
  learning: number;
  masteredPercentage: number;
}

export interface ProgressListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export const progressAPI = {
  // 获取学习进度列表
  getProgress(params?: ProgressListParams) {
    return request.get<{ data: UserProgress[]; pagination: any }>('/progress', {
      data: params,
    });
  },

  // 获取词汇的学习状态
  getVocabularyProgress(vocabularyId: number) {
    return request.get<UserProgress>(`/progress/vocabulary/${vocabularyId}`);
  },

  // 标记词汇为已掌握/需复习
  markWord(data: {
    vocabulary_id: number;
    status: 'learning' | 'reviewing' | 'mastered';
    correct_count?: number;
    wrong_count?: number;
  }) {
    return request.post<UserProgress>('/progress/mark', data);
  },

  // 更新学习进度
  updateProgress(id: number, data: Partial<UserProgress>) {
    return request.put<UserProgress>(`/progress/${id}`, data);
  },

  // 获取学习统计
  getStatistics() {
    return request.get<ProgressStatistics>('/progress/statistics');
  },
};
