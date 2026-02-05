<template>
  <view class="detail-page">
    <u-loading-page v-if="isLoading" loading-text="Loading..." />

    <view v-else-if="vocabulary" class="detail-content">
      <!-- 词汇主卡片 -->
      <view class="vocab-main-card">
        <view class="vocab-header">
          <view class="word-row">
            <text class="word">{{ vocabulary.word }}</text>
            <view class="difficulty-badge" :class="`badge-${vocabulary.difficulty_level.toLowerCase()}`">
              <text>{{ vocabulary.difficulty_level }}</text>
            </view>
          </view>
          <text class="phonetic" v-if="vocabulary.phonetic">{{ vocabulary.phonetic }}</text>
          <view class="part-of-speech" v-if="vocabulary.part_of_speech">
            <view class="pos-badge">
              <text>{{ vocabulary.part_of_speech }}</text>
            </view>
          </view>
        </view>

        <view class="definition-section">
          <view class="definition-card">
            <text class="definition-label">Definition</text>
            <text class="definition">{{ vocabulary.definition }}</text>
            <text class="definition-zh" v-if="vocabulary.definition_zh">{{ vocabulary.definition_zh }}</text>
          </view>
        </view>
      </view>

      <!-- 例句区域 -->
      <view class="sentences-section" v-if="sentences.length > 0">
        <view class="section-header">
          <view class="section-title-wrapper">
            <u-icon name="file-text" size="20" color="#4CAF50" />
            <text class="section-title">Example Sentences</text>
          </view>
          <text class="sentence-count">{{ sentences.length }} examples</text>
        </view>
        
        <view class="sentence-list">
          <view
            v-for="(s, index) in sentences"
            :key="s.id"
            class="sentence-item"
            :style="{ animationDelay: `${index * 0.08}s` }"
          >
            <view class="sentence-number">{{ index + 1 }}</view>
            <view class="sentence-content">
              <text class="sentence-en">{{ s.english_text }}</text>
              <text class="sentence-zh" v-if="s.chinese_translation">{{ s.chinese_translation }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-else class="empty-section">
      <u-icon name="inbox" size="64" color="#BDBDBD" />
      <text class="empty-text">Vocabulary not found</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useLearningStore } from '@/stores/learning';
import { useLoading } from '@/composables/useLoading';

const learningStore = useLearningStore();
const { loading: isLoading, withLoading } = useLoading();

const vocabulary = computed(() => learningStore.currentVocabulary);
const sentences = computed(() => learningStore.currentSentences);

onLoad(async (options) => {
  const id = options?.id ? parseInt(options.id as string) : 0;
  if (id) {
    await withLoading(async () => {
      await learningStore.loadVocabularyDetail(id);
    });
  }
});
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.detail-page {
  padding: 20px;
  padding-bottom: 100px;
  background: linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%);
  min-height: 100vh;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// ============================================
// 词汇主卡片
// ============================================

.vocab-main-card {
  background: white;
  border-radius: $radius-xl;
  padding: 28px 24px;
  box-shadow: $shadow-md;
  position: relative;
  overflow: hidden;
  border: 1px solid $divider-color;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: $gradient-primary;
  }
}

.vocab-header {
  margin-bottom: 24px;
}

.word-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.word {
  font-size: 40px;
  font-weight: $font-weight-bold;
  color: $text-primary;
  line-height: $line-height-tight;
  flex: 1;
  min-width: 0;
}

.difficulty-badge {
  padding: 8px 16px;
  border-radius: $radius-md;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  color: white;
  text-transform: uppercase;
  flex-shrink: 0;

  &.badge-a1, &.badge-a2 {
    background: #4CAF50;
  }

  &.badge-b1 {
    background: #FFC107;
  }

  &.badge-b2 {
    background: #FF9800;
  }

  &.badge-c1, &.badge-c2 {
    background: #F44336;
  }
}

.phonetic {
  display: block;
  font-size: $font-size-lg;
  color: $text-secondary;
  font-style: italic;
  margin-bottom: 12px;
  font-weight: $font-weight-medium;
}

.part-of-speech {
  display: inline-block;
}

.pos-badge {
  padding: 6px 14px;
  background: rgba(33, 150, 243, 0.1);
  border-radius: $radius-md;
  font-size: $font-size-sm;
  color: #2196F3;
  font-weight: $font-weight-semibold;
}

.definition-section {
  margin-top: 24px;
}

.definition-card {
  padding: 20px;
  background: $bg-secondary;
  border-radius: $radius-lg;
  border-left: 4px solid #4CAF50;
}

.definition-label {
  display: block;
  font-size: $font-size-xs;
  color: $text-tertiary;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.definition {
  display: block;
  font-size: $font-size-lg;
  color: $text-primary;
  line-height: $line-height-relaxed;
  margin-bottom: 12px;
  font-weight: $font-weight-medium;
}

.definition-zh {
  display: block;
  font-size: $font-size-md;
  color: $text-secondary;
  line-height: $line-height-normal;
}

// ============================================
// 例句区域
// ============================================

.sentences-section {
  background: white;
  border-radius: $radius-xl;
  padding: 24px;
  box-shadow: $shadow-md;
  border: 1px solid $divider-color;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid $divider-color;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.sentence-count {
  font-size: $font-size-sm;
  color: $text-secondary;
  font-weight: $font-weight-medium;
}

.sentence-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sentence-item {
  display: flex;
  gap: 16px;
  padding: 18px;
  background: $bg-secondary;
  border-radius: $radius-lg;
  border-left: 4px solid #4CAF50;
  transition: all $duration-normal $ease-out;
  animation: slideInLeft 0.5s $ease-out both;

  &:active {
    transform: translateX(4px);
    background: white;
    box-shadow: $shadow-sm;
  }
}

.sentence-number {
  width: 32px;
  height: 32px;
  border-radius: $radius-full;
  background: $gradient-primary;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  flex-shrink: 0;
  box-shadow: $shadow-sm;
}

.sentence-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sentence-en {
  display: block;
  font-size: $font-size-md;
  color: $text-primary;
  line-height: $line-height-relaxed;
  font-weight: $font-weight-medium;
}

.sentence-zh {
  display: block;
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: $line-height-normal;
}

// ============================================
// 空状态
// ============================================

.empty-section {
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.empty-text {
  font-size: $font-size-lg;
  color: $text-secondary;
  font-weight: $font-weight-medium;
}

// ============================================
// 动画
// ============================================

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
