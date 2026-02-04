<template>
  <view class="vocabularies-page">
    <!-- 搜索和筛选 -->
    <u-sticky>
      <view class="filter-section">
        <u-search
          v-model="searchWord"
          placeholder="Search word..."
          shape="round"
          :show-action="false"
          @search="loadVocabularies"
          @clear="loadVocabularies"
          @change="onSearchChange"
        />
        <view class="filter-tags">
          <u-subsection
            :list="subsectionList"
            :current="subsectionCurrent"
            mode="button"
            :bold="true"
            @change="onSubsectionChange"
          />
        </view>
      </view>
    </u-sticky>

    <!-- 加载状态 -->
    <u-loading-page v-if="isLoading" loading-text="Loading..." />

    <!-- 词汇列表 -->
    <view class="vocabulary-list" v-else-if="vocabularies.length > 0">
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
          <u-tag
            :text="vocab.difficulty_level"
            :type="getLevelType(vocab.difficulty_level)"
            size="mini"
          />
        </view>
        <text class="definition">{{ vocab.definition }}</text>
        <text class="definition-zh" v-if="vocab.definition_zh">{{ vocab.definition_zh }}</text>
        <view class="card-footer">
          <u-tag v-if="vocab.part_of_speech" :text="vocab.part_of_speech" type="info" size="mini" plain />
          <text class="examples">{{ vocab.example_count }} examples</text>
        </view>
      </view>
    </view>

    <!-- 空状态 -->
    <u-empty
      v-else
      mode="list"
      text="No vocabularies found"
      margin-top="80"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useLearningStore } from '@/stores/learning';
import type { Vocabulary } from '@/api/vocabulary';

const learningStore = useLearningStore();

const vocabularies = ref<Vocabulary[]>(learningStore.vocabularies);
const isLoading = ref(true);
const searchWord = ref('');
const selectedLevel = ref('');
const difficultyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const subsectionList = computed(() => [
  { name: 'All' },
  ...difficultyLevels.map((l) => ({ name: l })),
]);

const subsectionCurrent = computed(() => {
  if (!selectedLevel.value) return 0;
  const idx = difficultyLevels.indexOf(selectedLevel.value);
  return idx >= 0 ? idx + 1 : 0;
});

const onSubsectionChange = (index: number) => {
  selectedLevel.value = index === 0 ? '' : difficultyLevels[index - 1];
  loadVocabularies();
};

const searchTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const onSearchChange = () => {
  if (searchTimer.value) clearTimeout(searchTimer.value);
  searchTimer.value = setTimeout(loadVocabularies, 300);
};

const getLevelType = (level: string) => {
  const map: Record<string, string> = {
    A1: 'success',
    A2: 'primary',
    B1: 'warning',
    B2: 'error',
    C1: 'primary',
    C2: 'error',
  };
  return map[level] || 'info';
};

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

const goToDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/vocabulary-detail/index?id=${id}` });
};
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.vocabularies-page {
  padding-bottom: 100px;
}

.filter-section {
  padding: 16px 20px 20px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-tags {
  margin-top: 12px;
}

.vocabulary-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: $bg-secondary;
  min-height: calc(100vh - 200px);
}

.vocabulary-card {
  background: white;
  border-radius: $radius-xl;
  padding: 20px;
  box-shadow: $shadow-card;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: $gradient-primary;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: $shadow-hover;
    border-color: rgba(88, 204, 2, 0.2);

    &::before {
      opacity: 1;
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.word-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.word {
  font-size: 22px;
  font-weight: 700;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 4px;
}

.phonetic {
  font-size: $font-size-sm;
  color: $text-secondary;
  font-style: italic;
}

.definition {
  display: block;
  font-size: $font-size-md;
  color: $text-primary;
  margin-bottom: $spacing-sm;
  line-height: 1.6;
  font-weight: 500;
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
  padding-top: 16px;
  margin-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  font-size: $font-size-sm;
  color: $text-secondary;
}

.examples {
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  font-size: 13px;
}
</style>
