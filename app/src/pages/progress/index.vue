<template>
  <view class="progress-page">
    <view v-if="statistics" class="stats-section">
      <u-card :padding="20" :border-radius="12">
        <template #body>
          <u-grid :border="false" :col="2">
            <u-grid-item>
              <view class="stat-card">
                <text class="stat-number">{{ statistics.total }}</text>
                <text class="stat-label">Total</text>
              </view>
            </u-grid-item>
            <u-grid-item>
              <view class="stat-card">
                <text class="stat-number">{{ statistics.learning }}</text>
                <text class="stat-label">Learning</text>
              </view>
            </u-grid-item>
            <u-grid-item>
              <view class="stat-card">
                <text class="stat-number">{{ statistics.reviewing }}</text>
                <text class="stat-label">Reviewing</text>
              </view>
            </u-grid-item>
            <u-grid-item>
              <view class="stat-card highlight">
                <text class="stat-number">{{ statistics.mastered }}</text>
                <text class="stat-label">Mastered</text>
              </view>
            </u-grid-item>
          </u-grid>
          <view class="progress-bar-wrap">
            <u-line-progress
              :percentage="statistics.masteredPercentage || 0"
              :show-text="true"
              active-color="#58cc02"
              inactive-color="#e5e7eb"
              height="12"
            />
          </view>
        </template>
      </u-card>
    </view>

    <u-loading-page v-if="isLoading" loading-text="Loading..." />

    <u-empty
      v-else-if="!statistics"
      mode="list"
      text="No progress data yet"
      margin-top="80"
    >
      <text class="empty-hint">Start learning to track your progress</text>
    </u-empty>
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
@import '@/styles/variables.scss';

.progress-page {
  padding: 20px;
  padding-bottom: 100px;
  background: $bg-secondary;
  min-height: 100vh;
}

.stats-section {
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: $radius-xl;
  padding: 20px;
  text-align: center;
  box-shadow: $shadow-card;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &.highlight {
    background: $gradient-primary;
    box-shadow: $shadow-hover;
    border-color: rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(-2px);
  }
}

.stat-number {
  display: block;
  font-size: 32px;
  font-weight: 700;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 6px;
}

.stat-card.highlight .stat-number {
  color: white;
  -webkit-text-fill-color: white;
  background: none;
}

.stat-label {
  font-size: 12px;
  color: $text-secondary;
}

.stat-card.highlight .stat-label {
  color: rgba(255, 255, 255, 0.9);
}

.progress-bar-wrap {
  margin-top: 16px;
}

.empty-hint {
  display: block;
  font-size: 13px;
  color: $text-tertiary;
  margin-top: 12px;
}
</style>
