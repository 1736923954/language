<template>
  <view class="progress-page">
    <!-- 进度概览卡片 -->
    <view v-if="statistics" class="overview-section">
      <view class="overview-card">
        <view class="overview-header">
          <text class="overview-title">Learning Progress</text>
          <view class="progress-ring-wrapper">
            <view class="progress-ring">
              <view class="ring-bg"></view>
              <view 
                class="ring-progress" 
                :style="{ 
                  background: `conic-gradient(#4CAF50 ${progressAngle}deg, transparent ${progressAngle}deg)` 
                }"
              ></view>
              <view class="ring-content">
                <text class="ring-percentage">{{ formatPercentage(Number(statistics.masteredPercentage)) }}%</text>
                <text class="ring-label">Mastered</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 统计卡片 -->
    <view v-if="statistics" class="stats-section">
      <view class="stats-grid">
        <view class="stat-card stat-total">
          <view class="stat-icon-wrapper">
            <u-icon name="bookmark-fill" size="24" color="#4CAF50" />
          </view>
          <text class="stat-number">{{ formatNumber(statistics.total) }}</text>
          <text class="stat-label">Total</text>
        </view>
        
        <view class="stat-card stat-learning">
          <view class="stat-icon-wrapper">
            <u-icon name="clock-fill" size="24" color="#2196F3" />
          </view>
          <text class="stat-number">{{ formatNumber(statistics.learning) }}</text>
          <text class="stat-label">Learning</text>
        </view>
        
        <view class="stat-card stat-reviewing">
          <view class="stat-icon-wrapper">
            <u-icon name="reload" size="24" color="#FFC107" />
          </view>
          <text class="stat-number">{{ formatNumber(statistics.reviewing) }}</text>
          <text class="stat-label">Reviewing</text>
        </view>
        
        <view class="stat-card stat-mastered">
          <view class="stat-icon-wrapper">
            <u-icon name="checkmark-circle-fill" size="24" color="#4CAF50" />
          </view>
          <text class="stat-number">{{ formatNumber(statistics.mastered) }}</text>
          <text class="stat-label">Mastered</text>
        </view>
      </view>

      <!-- 进度条 -->
      <view class="progress-bar-section">
        <view class="progress-bar-header">
          <text class="progress-label">Overall Progress</text>
          <text class="progress-percentage">{{ formatPercentage(Number(statistics.masteredPercentage)) }}%</text>
        </view>
        <view class="progress-bar-container">
          <view class="progress-bar-bg">
            <view 
              class="progress-bar-fill" 
              :style="{ width: `${statistics.masteredPercentage || 0}%` }"
            ></view>
          </view>
        </view>
      </view>
    </view>

    <u-loading-page v-if="isLoading" loading-text="Loading..." />

    <view v-else-if="!statistics" class="empty-state">
      <view class="empty-icon">
        <u-icon name="inbox" size="64" color="#BDBDBD" />
      </view>
      <text class="empty-title">No progress data yet</text>
      <text class="empty-desc">Start learning to track your progress</text>
      <u-button
        type="primary"
        text="Start Learning"
        shape="round"
        @click="uni.navigateTo({ url: '/pages/vocabularies/index' })"
        :custom-style="{
          marginTop: '24px',
          borderRadius: '24px',
          padding: '12px 32px'
        }"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useLearningStore } from '@/stores/learning';
import { useAuthStore } from '@/stores/auth';
import { useLoading } from '@/composables/useLoading';
import { formatNumber, formatPercentage } from '@/utils/helpers';

const learningStore = useLearningStore();
const authStore = useAuthStore();
const { loading: isLoading, withLoading } = useLoading();

const statistics = computed(() => learningStore.statistics);

const progressAngle = computed(() => {
  const percentage = Number(statistics.value?.masteredPercentage) || 0;
  return (percentage / 100) * 360;
});

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    uni.reLaunch({ url: '/pages/login/index' });
    return;
  }

  await withLoading(async () => {
    await learningStore.loadStatistics();
  });
});
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.progress-page {
  padding: 20px;
  padding-bottom: 100px;
  background: linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%);
  min-height: 100vh;
}

// ============================================
// 概览区域
// ============================================

.overview-section {
  margin-bottom: 24px;
}

.overview-card {
  background: white;
  border-radius: $radius-xl;
  padding: 32px 24px;
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

.overview-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.overview-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.progress-ring-wrapper {
  display: flex;
  justify-content: center;
}

.progress-ring {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(#E0E0E0 360deg, transparent 360deg);
}

.ring-progress {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  mask: radial-gradient(circle, transparent 60px, black 62px);
  -webkit-mask: radial-gradient(circle, transparent 60px, black 62px);
}

.ring-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.ring-percentage {
  font-size: 36px;
  font-weight: $font-weight-bold;
  color: #4CAF50;
  line-height: $line-height-tight;
}

.ring-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  font-weight: $font-weight-medium;
}

// ============================================
// 统计区域
// ============================================

.stats-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: $radius-xl;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  box-shadow: $shadow-sm;
  transition: all $duration-normal $ease-out;
  border: 1px solid $divider-color;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    opacity: 0;
    transition: opacity $duration-normal;
  }

  &:active {
    transform: translateY(-2px);
    box-shadow: $shadow-md;

    &::before {
      opacity: 1;
    }
  }

  &.stat-total {
    &::before {
      background: #4CAF50;
    }
  }

  &.stat-learning {
    &::before {
      background: #2196F3;
    }
  }

  &.stat-reviewing {
    &::before {
      background: #FFC107;
    }
  }

  &.stat-mastered {
    &::before {
      background: #4CAF50;
    }
  }
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: $radius-lg;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;

  .stat-total & {
    background: rgba(76, 175, 80, 0.1);
  }

  .stat-learning & {
    background: rgba(33, 150, 243, 0.1);
  }

  .stat-reviewing & {
    background: rgba(255, 193, 7, 0.1);
  }

  .stat-mastered & {
    background: rgba(76, 175, 80, 0.1);
  }
}

.stat-number {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  line-height: $line-height-tight;
}

.stat-label {
  font-size: $font-size-sm;
  color: $text-secondary;
  font-weight: $font-weight-medium;
  text-align: center;
}

// ============================================
// 进度条区域
// ============================================

.progress-bar-section {
  background: white;
  border-radius: $radius-xl;
  padding: 24px;
  box-shadow: $shadow-sm;
  border: 1px solid $divider-color;
}

.progress-bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-label {
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.progress-percentage {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: #4CAF50;
}

.progress-bar-container {
  width: 100%;
}

.progress-bar-bg {
  width: 100%;
  height: 12px;
  background: $bg-tertiary;
  border-radius: $radius-full;
  overflow: hidden;
  position: relative;
}

.progress-bar-fill {
  height: 100%;
  background: $gradient-primary;
  border-radius: $radius-full;
  transition: width $duration-slow $ease-out;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    animation: shimmer 2s infinite;
  }
}

// ============================================
// 空状态
// ============================================

.empty-state {
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-icon {
  margin-bottom: 24px;
}

.empty-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: $font-size-md;
  color: $text-secondary;
}

// ============================================
// 动画
// ============================================

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
