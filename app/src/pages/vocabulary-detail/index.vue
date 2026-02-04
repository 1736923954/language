<template>
  <view class="detail-page">
    <u-loading-page v-if="isLoading" loading-text="Loading..." />

    <view v-else-if="vocabulary" class="detail-content">
      <u-card :padding="20" :border-radius="12" :show-head="true" :show-foot="false">
        <template #head>
          <view class="vocab-header">
            <view class="word-row">
              <text class="word">{{ vocabulary.word }}</text>
              <u-tag
                :text="vocabulary.difficulty_level"
                :type="getLevelType(vocabulary.difficulty_level)"
                size="mini"
              />
            </view>
            <text class="phonetic" v-if="vocabulary.phonetic">{{ vocabulary.phonetic }}</text>
            <u-tag
              v-if="vocabulary.part_of_speech"
              :text="vocabulary.part_of_speech"
              type="info"
              size="mini"
              plain
            />
          </view>
        </template>
        <template #body>
          <view class="definition-section">
            <text class="definition">{{ vocabulary.definition }}</text>
            <text class="definition-zh" v-if="vocabulary.definition_zh">{{ vocabulary.definition_zh }}</text>
          </view>

          <view class="sentences-section" v-if="sentences.length > 0">
            <text class="section-title">Example Sentences</text>
            <view class="sentence-list">
              <view
                v-for="s in sentences"
                :key="s.id"
                class="sentence-item"
              >
                <text class="sentence-en">{{ s.english_text }}</text>
                <text class="sentence-zh">{{ s.chinese_translation }}</text>
              </view>
            </view>
          </view>
        </template>
      </u-card>
    </view>

    <u-empty
      v-else
      mode="list"
      text="Vocabulary not found"
      margin-top="80"
    />
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
@import '@/styles/variables.scss';

.detail-page {
  padding: 20px;
  padding-bottom: 100px;
  background: $bg-secondary;
  min-height: 100vh;
}

.detail-content {
  margin: 0;
}

.vocab-header {
  padding-bottom: 0;
}

.word-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.word {
  font-size: 32px;
  font-weight: 700;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.phonetic {
  display: block;
  font-size: 14px;
  color: $text-secondary;
  font-style: italic;
  margin-bottom: 8px;
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
  padding: 16px;
  background: white;
  border-radius: $radius-lg;
  border-left: 4px solid #58cc02;
  box-shadow: $shadow-sm;
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: $gradient-primary;
    border-radius: $radius-lg 0 0 $radius-lg;
  }

  &:active {
    transform: translateX(4px);
    box-shadow: $shadow-md;
  }
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
</style>
