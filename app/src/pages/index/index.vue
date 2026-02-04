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
@use '@/styles/variables.scss' as *;

.home-page {
  padding-bottom: 100px;
}

.welcome-section {
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  padding: 24px 16px;
  color: white;
  margin-bottom: 20px;
}

.welcome-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.welcome-title {
  font-size: 20px;
  font-weight: bold;
}

.welcome-subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.statistics-section {
  display: flex;
  gap: 10px;
  padding: 0 16px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background: white;
  border-radius: $radius-lg;
  padding: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-shadow: $shadow-md;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: $primary-color;
}

.stat-label {
  font-size: 12px;
  color: $text-secondary;
}

.menu-section {
  display: flex;
  gap: 12px;
  padding: 0 16px;
  margin-bottom: 20px;
}

.menu-card {
  flex: 1;
  background: white;
  border-radius: $radius-lg;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: $shadow-md;
}

.menu-icon {
  font-size: 28px;
}

.menu-title {
  font-size: 15px;
  font-weight: bold;
  color: $text-primary;
}

.menu-desc {
  font-size: 12px;
  color: $text-secondary;
  text-align: center;
}

.recommended-section {
  padding: 0 16px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 12px;
}

.vocabulary-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vocabulary-item {
  background: white;
  border-radius: $radius-lg;
  padding: 14px;
  box-shadow: $shadow-md;
}

.vocab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.vocab-word {
  font-size: 16px;
  font-weight: bold;
  color: $primary-color;
}

.vocab-level {
  background: $bg-secondary;
  color: $text-secondary;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
}

.vocab-definition {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
}
</style>
