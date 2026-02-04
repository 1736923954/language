import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { vocabularyAPI, type Vocabulary } from '@/api/vocabulary';
import { sentenceAPI, type Sentence } from '@/api/sentence';
import { progressAPI, type ProgressStatistics } from '@/api/progress';

export const useLearningStore = defineStore('learning', () => {
  const vocabularies = ref<Vocabulary[]>([]);
  const currentVocabulary = ref<Vocabulary | null>(null);
  const currentSentences = ref<Sentence[]>([]);
  const statistics = ref<ProgressStatistics | null>(null);
  const isLoading = ref(false);
  const error = ref('');

  const loadVocabularies = async (params?: any) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await vocabularyAPI.getList(params);
      vocabularies.value = response.data.data || [];
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const loadVocabularyDetail = async (id: number) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await vocabularyAPI.getById(id);
      currentVocabulary.value = response.data;

      // 加载相关句子
      const sentencesResponse = await sentenceAPI.getByVocabulary(id);
      currentSentences.value = sentencesResponse.data.data || [];
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await progressAPI.getStatistics();
      statistics.value = response.data;
    } catch (err: any) {
      error.value = err.message;
    }
  };

  return {
    vocabularies,
    currentVocabulary,
    currentSentences,
    statistics,
    isLoading,
    error,
    loadVocabularies,
    loadVocabularyDetail,
    loadStatistics,
  };
});
