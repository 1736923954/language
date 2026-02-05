import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { vocabularyAPI, type Vocabulary } from '@/api/vocabulary';
import { sentenceAPI, type Sentence } from '@/api/sentence';
import { progressAPI, type ProgressStatistics } from '@/api/progress';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

interface LoadVocabulariesParams {
  word?: string;
  category_id?: number;
  difficulty_level?: string;
  page?: number;
  limit?: number;
}

export const useLearningStore = defineStore('learning', () => {
  const vocabularies = ref<Vocabulary[]>([]);
  const currentVocabulary = ref<Vocabulary | null>(null);
  const currentSentences = ref<Sentence[]>([]);
  const statistics = ref<ProgressStatistics | null>(null);
  const isLoading = ref(false);
  const error = ref('');

  // 分页信息
  const pagination = ref({
    page: 1,
    limit: DEFAULT_PAGE_SIZE,
    total: 0,
    hasMore: false,
  });

  /**
   * 加载词汇列表
   */
  const loadVocabularies = async (params?: LoadVocabulariesParams) => {
    isLoading.value = true;
    error.value = '';

    try {
      const requestParams = {
        page: params?.page || 1,
        limit: params?.limit || DEFAULT_PAGE_SIZE,
        ...(params?.word && { word: params.word }),
        ...(params?.category_id && { category_id: params.category_id }),
        ...(params?.difficulty_level && { difficulty_level: params.difficulty_level }),
      };

      const response = await vocabularyAPI.getList(requestParams);
      
      // 处理分页响应
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        // 分页格式：{ data: [...], total: 100, page: 1, limit: 20 }
        const paginatedData = response.data as any;
        vocabularies.value = Array.isArray(paginatedData.data) ? paginatedData.data : [];
        pagination.value = {
          page: paginatedData.page || 1,
          limit: paginatedData.limit || DEFAULT_PAGE_SIZE,
          total: paginatedData.total || 0,
          hasMore: (paginatedData.page || 1) * (paginatedData.limit || DEFAULT_PAGE_SIZE) < (paginatedData.total || 0),
        };
      } else {
        // 普通数组格式
        vocabularies.value = Array.isArray(response.data) ? response.data : [];
        pagination.value.hasMore = vocabularies.value.length >= (params?.limit || DEFAULT_PAGE_SIZE);
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.data?.message || 'Failed to load vocabularies';
      error.value = errorMessage;
      console.error('Load vocabularies error:', err);
      vocabularies.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 加载更多词汇（分页）
   */
  const loadMoreVocabularies = async (params?: LoadVocabulariesParams) => {
    if (!pagination.value.hasMore || isLoading.value) return;

    const nextPage = pagination.value.page + 1;
    isLoading.value = true;
    error.value = '';

    try {
      const requestParams = {
        page: nextPage,
        limit: params?.limit || DEFAULT_PAGE_SIZE,
        ...(params?.word && { word: params.word }),
        ...(params?.category_id && { category_id: params.category_id }),
        ...(params?.difficulty_level && { difficulty_level: params.difficulty_level }),
      };

      const response = await vocabularyAPI.getList(requestParams);
      
      let newVocabularies: Vocabulary[] = [];
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        const paginatedData = response.data as any;
        newVocabularies = Array.isArray(paginatedData.data) ? paginatedData.data : [];
        pagination.value = {
          page: paginatedData.page || nextPage,
          limit: paginatedData.limit || DEFAULT_PAGE_SIZE,
          total: paginatedData.total || 0,
          hasMore: (paginatedData.page || nextPage) * (paginatedData.limit || DEFAULT_PAGE_SIZE) < (paginatedData.total || 0),
        };
      } else {
        newVocabularies = Array.isArray(response.data) ? response.data : [];
        pagination.value.hasMore = newVocabularies.length >= (params?.limit || DEFAULT_PAGE_SIZE);
      }

      vocabularies.value = [...vocabularies.value, ...newVocabularies];
      pagination.value.page = nextPage;
    } catch (err: any) {
      const errorMessage = err?.message || err?.data?.message || 'Failed to load more vocabularies';
      error.value = errorMessage;
      console.error('Load more vocabularies error:', err);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 加载词汇详情
   */
  const loadVocabularyDetail = async (id: number) => {
    isLoading.value = true;
    error.value = '';

    try {
      const [vocabResponse, sentencesResponse] = await Promise.all([
        vocabularyAPI.getById(id),
        sentenceAPI.getByVocabulary(id),
      ]);

      currentVocabulary.value = vocabResponse.data;

      // 处理句子数据
      if (sentencesResponse.data && typeof sentencesResponse.data === 'object' && 'data' in sentencesResponse.data) {
        const paginatedData = sentencesResponse.data as any;
        currentSentences.value = Array.isArray(paginatedData.data) ? paginatedData.data : [];
      } else {
        currentSentences.value = Array.isArray(sentencesResponse.data) ? sentencesResponse.data : [];
      }
    } catch (err: any) {
      const errorMessage = err?.message || err?.data?.message || 'Failed to load vocabulary detail';
      error.value = errorMessage;
      console.error('Load vocabulary detail error:', err);
      currentVocabulary.value = null;
      currentSentences.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 加载学习统计
   */
  const loadStatistics = async () => {
    try {
      const response = await progressAPI.getStatistics();
      statistics.value = response.data;
    } catch (err: any) {
      const errorMessage = err?.message || err?.data?.message || 'Failed to load statistics';
      error.value = errorMessage;
      console.error('Load statistics error:', err);
    }
  };

  /**
   * 清除当前词汇详情
   */
  const clearCurrentVocabulary = () => {
    currentVocabulary.value = null;
    currentSentences.value = [];
  };

  /**
   * 重置状态
   */
  const reset = () => {
    vocabularies.value = [];
    currentVocabulary.value = null;
    currentSentences.value = [];
    statistics.value = null;
    error.value = '';
    pagination.value = {
      page: 1,
      limit: DEFAULT_PAGE_SIZE,
      total: 0,
      hasMore: false,
    };
  };

  return {
    vocabularies,
    currentVocabulary,
    currentSentences,
    statistics,
    isLoading,
    error,
    pagination,
    loadVocabularies,
    loadMoreVocabularies,
    loadVocabularyDetail,
    loadStatistics,
    clearCurrentVocabulary,
    reset,
  };
});
