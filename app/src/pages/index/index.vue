<template>
  <view class="home-page">
    <!-- 欢迎区域 -->
    <view class="welcome-section">
      <view class="welcome-text">
        <text class="welcome-title">Welcome to English Learning</text>
        <text class="welcome-subtitle">Master English at your own pace</text>
      </view>
    </view>

    <!-- 快速统计 -->
    <view class="statistics-section" v-if="statistics">
      <view class="stat-card">
        <text class="stat-number">{{ statistics.total }}</text>
        <text class="stat-label">Total Words</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ statistics.mastered }}</text>
        <text class="stat-label">Mastered</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ statistics.masteredPercentage }}%</text>
        <text class="stat-label">Progress</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-card" @click="navigateTo('/pages/vocabularies/index')">
        <text class="menu-icon">📚</text>
        <text class="menu-title">Start Learning</text>
        <text class="menu-desc">Learn new vocabularies</text>
      </view>
      <view class="menu-card" @click="navigateTo('/pages/progress/index')">
        <text class="menu-icon">📊</text>
        <text class="menu-title">My Progress</text>
        <text class="menu-desc">Track your learning</text>
      </view>
    </view>

    <!-- 推荐词汇 -->
    <view class="recommended-section" v-if="vocabularies.length > 0">
      <text class="section-title">Recommended Vocabularies</text>
      <view class="vocabulary-list">
        <view
          class="vocabulary-item"
          v-for="vocab in vocabularies.slice(0, 3)"
          :key="vocab.id"
          @click="goToDetail(vocab.id)"
        >
          <view class="vocab-header">
            <text class="vocab-word">{{ vocab.word }}</text>
            <text class="vocab-level">{{ vocab.difficulty_level }}</text>
          </view>
          <text class="vocab-definition">{{ vocab.definition }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLearningStore } from '@/stores/learning';
import { useAuthStore } from '@/stores/auth';

const learningStore = useLearningStore();
const authStore = useAuthStore();

const vocabularies = ref(learningStore.vocabularies);
const statistics = ref(learningStore.statistics);

onMounted(async () => {
  // 检查认证
  if (!authStore.isAuthenticated) {
    uni.reLaunch({ url: '/pages/login/index' });
    return;
  }

  // 加载数据
  await learningStore.loadVocabularies({ limit: 10 });
  await learningStore.loadStatistics();

  vocabularies.value = learningStore.vocabularies;
  statistics.value = learningStore.statistics;
});

const navigateTo = (path: string) => {
  uni.navigateTo({ url: path });
};

const goToDetail = (id: number) => {
  uni.navigateTo({ url: `/pages/vocabulary-detail/index?id=${id}` });
};
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.home-page {
  padding-bottom: 100px;
}

.welcome-section {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  padding: $spacing-3xl $spacing-lg;
  color: white;
  margin-bottom: $spacing-2xl;
}

.welcome-text {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.welcome-title {
  font-size: $font-size-2xl;
  font-weight: bold;
}

.welcome-subtitle {
  font-size: $font-size-md;
  opacity: 0.9;
}

.statistics-section {
  display: flex;
  gap: $spacing-md;
  padding: 0 $spacing-lg;
  margin-bottom: $spacing-2xl;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-sm;
  box-shadow: $shadow-md;
}

.stat-number {
  font-size: $font-size-2xl;
  font-weight: bold;
  color: $primary-color;
}

.stat-label {
  font-size: $font-size-sm;
  color: $text-secondary;
}

.menu-section {
  display: flex;
  gap: $spacing-md;
  padding: 0 $spacing-lg;
  margin-bottom: $spacing-2xl;
}

.menu-card {
  flex: 1;
  background: white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
  box-shadow: $shadow-md;
}

.menu-icon {
  font-size: 32px;
}

.menu-title {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $text-primary;
}

.menu-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
  text-align: center;
}

.recommended-section {
  padding: 0 $spacing-lg;
}

.section-title {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: $spacing-lg;
}

.vocabulary-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-md;
}

.vocabulary-item {
  background: white;
  border-radius: $radius-lg;
  padding: $spacing-lg;
  box-shadow: $shadow-md;
}

.vocab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: $spacing-md;
}

.vocab-word {
  font-size: $font-size-lg;
  font-weight: bold;
  color: $primary-color;
}

.vocab-level {
  background: $bg-secondary;
  color: $text-secondary;
  padding: $spacing-sm $spacing-md;
  border-radius: $radius-md;
  font-size: $font-size-sm;
}

.vocab-definition {
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: 1.5;
}
</style>
