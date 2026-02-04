<template>
  <view class="detail-page">
    <view v-if="vocabulary" class="detail-card">
      <view class="vocab-header">
        <view class="word-row">
          <text class="word">{{ vocabulary.word }}</text>
          <text class="level-badge" :class="`level-${vocabulary.difficulty_level}`">
            {{ vocabulary.difficulty_level }}
          </text>
        </view>
        <text class="phonetic">{{ vocabulary.phonetic }}</text>
        <text class="pos" v-if="vocabulary.part_of_speech">{{ vocabulary.part_of_speech }}</text>
      </view>

      <view class="definition-section">
        <text class="definition">{{ vocabulary.definition }}</text>
        <text class="definition-zh" v-if="vocabulary.definition_zh">{{ vocabulary.definition_zh }}</text>
      </view>

      <view class="sentences-section" v-if="sentences.length > 0">
        <text class="section-title">Example Sentences</text>
        <view class="sentence-list">
          <view class="sentence-item" v-for="s in sentences" :key="s.id">
            <text class="sentence-en">{{ s.english_text }}</text>
            <text class="sentence-zh">{{ s.chinese_translation }}</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="isLoading" class="loading">
      <text>Loading...</text>
    </view>

    <view v-if="!isLoading && !vocabulary" class="empty-state">
      <text class="empty-icon">📖</text>
      <text class="empty-text">Vocabulary not found</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useLearningStore } from '@/stores/learning';

const learningStore = useLearningStore();
const vocabulary = computed(() => learningStore.currentVocabulary);
const sentences = computed(() => learningStore.currentSentences);
const isLoading = ref(false);

onLoad((options) => {
  const id = options?.id ? parseInt(options.id as string) : 0;
  if (id) loadDetail(id);
});

const loadDetail = async (id: number) => {
  isLoading.value = true;
  await learningStore.loadVocabularyDetail(id);
  isLoading.value = false;
};
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.detail-page {
  padding: 16px;
  padding-bottom: 100px;
}

.detail-card {
  background: white;
  border-radius: $radius-lg;
  padding: 20px;
  box-shadow: $shadow-md;
}

.vocab-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid $border-color;
}

.word-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.word {
  font-size: 24px;
  font-weight: bold;
  color: $primary-color;
}

.phonetic {
  display: block;
  font-size: 14px;
  color: $text-secondary;
  font-style: italic;
  margin-bottom: 6px;
}

.pos {
  display: inline-block;
  background: $bg-secondary;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: $text-secondary;
}

.definition-section {
  margin-bottom: 20px;
}

.definition {
  display: block;
  font-size: 16px;
  color: $text-primary;
  line-height: 1.6;
  margin-bottom: 8px;
}

.definition-zh {
  display: block;
  font-size: 14px;
  color: $text-secondary;
}

.section-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 12px;
}

.sentence-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sentence-item {
  padding: 12px;
  background: $bg-secondary;
  border-radius: $radius-md;
  border-left: 3px solid $primary-color;
}

.sentence-en {
  display: block;
  font-size: 14px;
  color: $text-primary;
  margin-bottom: 4px;
}

.sentence-zh {
  display: block;
  font-size: 13px;
  color: $text-secondary;
}

.level-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  color: white;
}

.level-A1 { background: #10b981; }
.level-A2 { background: #3b82f6; }
.level-B1 { background: #f59e0b; }
.level-B2 { background: #ef4444; }
.level-C1 { background: #8b5cf6; }
.level-C2 { background: #ec4899; }

.loading,
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: $text-secondary;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
</style>
