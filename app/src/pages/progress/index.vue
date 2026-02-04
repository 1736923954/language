<template>
  <view class="progress-page">
    <view class="stats-section" v-if="statistics">
      <view class="stats-grid">
        <view class="stat-card">
          <text class="stat-number">{{ statistics.total }}</text>
          <text class="stat-label">Total</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ statistics.learning }}</text>
          <text class="stat-label">Learning</text>
        </view>
        <view class="stat-card">
          <text class="stat-number">{{ statistics.reviewing }}</text>
          <text class="stat-label">Reviewing</text>
        </view>
        <view class="stat-card highlight">
          <text class="stat-number">{{ statistics.mastered }}</text>
          <text class="stat-label">Mastered</text>
        </view>
      </view>
      <view class="progress-bar-wrap">
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: (statistics.masteredPercentage || 0) + '%' }" />
        </view>
        <text class="progress-text">{{ statistics.masteredPercentage || 0 }}% Complete</text>
      </view>
    </view>

    <view v-if="isLoading" class="loading">
      <text>Loading...</text>
    </view>

    <view v-if="!isLoading && !statistics" class="empty-state">
      <text class="empty-icon">📊</text>
      <text class="empty-text">No progress data yet</text>
      <text class="empty-hint">Start learning to track your progress</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLearningStore } from '@/stores/learning';
import { useAuthStore } from '@/stores/auth';

const learningStore = useLearningStore();
const authStore = useAuthStore();
const statistics = ref(learningStore.statistics);
const isLoading = ref(false);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    uni.reLaunch({ url: '/pages/login/index' });
    return;
  }
  isLoading.value = true;
  await learningStore.loadStatistics();
  statistics.value = learningStore.statistics;
  isLoading.value = false;
});
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.progress-page {
  padding: 16px;
  padding-bottom: 100px;
}

.stats-section {
  background: white;
  border-radius: $radius-lg;
  padding: 20px;
  box-shadow: $shadow-md;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: $bg-secondary;
  border-radius: $radius-md;
  padding: 16px;
  text-align: center;

  &.highlight {
    background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  }
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: bold;
  color: $primary-color;
  margin-bottom: 4px;
}

.stat-card.highlight .stat-number {
  color: white;
}

.stat-label {
  font-size: 12px;
  color: $text-secondary;
}

.stat-card.highlight .stat-label {
  color: rgba(255, 255, 255, 0.9);
}

.progress-bar-wrap {
  margin-top: 8px;
}

.progress-bar {
  height: 8px;
  background: $bg-secondary;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, $primary-color, $primary-light);
  border-radius: 4px;
  transition: width 0.3s;
}

.progress-text {
  font-size: 13px;
  color: $text-secondary;
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
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 13px;
  color: $text-tertiary;
}
</style>
