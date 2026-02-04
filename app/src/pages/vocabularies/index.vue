<template>
  <view class="vocabularies-page">
    <!-- 搜索和筛选 -->
    <view class="filter-section">
      <input
        v-model="searchWord"
        class="search-input"
        placeholder="Search word..."
        @input="handleSearch"
      />
      <view class="filter-buttons">
        <button
          v-for="level in difficultyLevels"
          :key="level"
          class="filter-button"
          :class="{ active: selectedLevel === level }"
          @click="selectedLevel = selectedLevel === level ? '' : level"
        >
          {{ level }}
        </button>
      </view>
    </view>

    <!-- 词汇列表 -->
    <view class="vocabulary-list" v-if="!isLoading">
      <view
        v-for="vocab in vocabularies"
        :key="vocab.id"
        class="vocabulary-card"
        @click="goToDetail(vocab.id)"
      >
        <view class="card-header">
          <view class="word-section">
            <text class="word">{{ vocab.word }}</text>
            <text class="phonetic">{{ vocab.phonetic }}</text>
          </view>
          <text class="level-badge" :class="`level-${vocab.difficulty_level}`">
            {{ vocab.difficulty_level }}
          </text>
        </view>
        <text class="definition">{{ vocab.definition }}</text>
        <text class="definition-zh">{{ vocab.definition_zh }}</text>
        <view class="card-footer">
          <text class="pos">{{ vocab.part_of_speech }}</text>
          <text class="examples">{{ vocab.example_count }} examples</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading">
      <text>Loading...</text>
    </view>

    <!-- 空状态 -->
    <view v-if="!isLoading && vocabularies.length === 0" class="empty-state">
      <text class="empty-icon">📚</text>
      <text class="empty-text">No vocabularies found</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLearningStore } from '@/stores/learning';

const learningStore = useLearningStore();

const vocabularies = ref(learningStore.vocabularies);
const isLoading = ref(false);
const searchWord = ref('');
const selectedLevel = ref('');
const difficultyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

onMounted(async () => {
  await loadVocabularies();
});

const loadVocabularies = async () => {
  isLoading.value = true;
  await learningStore.loadVocabularies({
    word: searchWord.value || undefined,
    difficulty_level: selectedLevel.value || undefined,
    limit: 50,
  });
  vocabularies.value = learningStore.vocabularies;
  isLoading.value = false;
};

const handleSearch = () => {
  loadVocabularies();
};

const goToDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/vocabulary-detail/index?id=${id}` });
};
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.vocabularies-page {
  padding-bottom: 100px;
}

.filter-section {
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid $border-color;
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-input {
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 10px;
  border: 1px solid $border-color;
  border-radius: 8px;
  font-size: 14px;
}

.filter-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-button {
  padding: 4px 10px;
  min-height: 28px;
  line-height: 20px;
  border: 1px solid $border-color;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  color: $text-secondary;
  cursor: pointer;
  transition: all 0.2s;

  &.active {
    background: $primary-color;
    color: white;
    border-color: $primary-color;
  }
}

.vocabulary-list {
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.vocabulary-card {
  background: white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: translateY(-2px);
    box-shadow: $shadow-lg;
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: $spacing-md;
}

.word-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.word {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $primary-color;
}

.phonetic {
  font-size: $font-size-sm;
  color: $text-secondary;
  font-style: italic;
}

.level-badge {
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  font-weight: bold;
  color: white;

  &.level-A1 {
    background: #10b981;
  }

  &.level-A2 {
    background: #3b82f6;
  }

  &.level-B1 {
    background: #f59e0b;
  }

  &.level-B2 {
    background: #ef4444;
  }

  &.level-C1 {
    background: #8b5cf6;
  }

  &.level-C2 {
    background: #ec4899;
  }
}

.definition {
  display: block;
  font-size: $font-size-md;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  line-height: 1.5;
}

.definition-zh {
  display: block;
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-md;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: $spacing-md;
  border-top: 1px solid $border-color;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.pos {
  background: $bg-secondary;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
}

.examples {
  color: $primary-color;
  font-weight: bold;
}

.loading,
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: $text-secondary;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: $spacing-lg;
}

.empty-text {
  font-size: $font-size-md;
}
</style>
