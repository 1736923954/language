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
      <u-grid :border="false" :col="3">
        <u-grid-item>
          <view class="stat-card">
            <text class="stat-number">{{ statistics.total }}</text>
            <text class="stat-label">Total Words</text>
          </view>
        </u-grid-item>
        <u-grid-item>
          <view class="stat-card">
            <text class="stat-number">{{ statistics.mastered }}</text>
            <text class="stat-label">Mastered</text>
          </view>
        </u-grid-item>
        <u-grid-item>
          <view class="stat-card">
            <text class="stat-number">{{ statistics.masteredPercentage }}%</text>
            <text class="stat-label">Progress</text>
          </view>
        </u-grid-item>
      </u-grid>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <u-grid :border="false" :col="2">
        <u-grid-item>
          <view class="menu-card" @click="navigateTo('/pages/vocabularies/index')">
            <view class="menu-icon-wrapper menu-icon-primary">
              <u-icon name="bookmark-fill" size="36" color="#ffffff" />
            </view>
            <text class="menu-title">Start Learning</text>
            <text class="menu-desc">Learn new vocabularies</text>
          </view>
        </u-grid-item>
        <u-grid-item>
          <view class="menu-card" @click="navigateTo('/pages/progress/index')">
            <view class="menu-icon-wrapper menu-icon-blue">
              <u-icon name="list" size="36" color="#ffffff" />
            </view>
            <text class="menu-title">My Progress</text>
            <text class="menu-desc">Track your learning</text>
          </view>
        </u-grid-item>
      </u-grid>
    </view>

    <!-- 推荐词汇 -->
    <view class="recommended-section" v-if="vocabularies.length > 0">
      <view class="section-header">
        <text class="section-title">Recommended Vocabularies</text>
      </view>
      <view class="vocabulary-list">
        <u-card
          v-for="vocab in vocabularies.slice(0, 3)"
          :key="vocab.id"
          :padding="14"
          :border-radius="12"
          margin="0 0 12rpx 0"
          @click="goToDetail(vocab.id)"
        >
          <template #head>
            <view class="vocab-header">
              <text class="vocab-word">{{ vocab.word }}</text>
              <u-tag :text="vocab.difficulty_level" type="primary" size="mini" />
            </view>
          </template>
          <template #body>
            <text class="vocab-definition">{{ vocab.definition }}</text>
          </template>
        </u-card>
      </view>
    </view>

    <!-- 空状态 -->
    <u-empty
      v-if="vocabularies.length === 0 && !isLoading"
      mode="list"
      text="No recommended vocabularies"
      margin-top="40"
    />
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
const isLoading = ref(false);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    uni.reLaunch({ url: '/pages/login/index' });
    return;
  }

  isLoading.value = true;
  await learningStore.loadVocabularies({ limit: 10 });
  await learningStore.loadStatistics();

  vocabularies.value = learningStore.vocabularies;
  statistics.value = learningStore.statistics;
  isLoading.value = false;
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
  background: $gradient-primary;
  padding: 32px 20px 40px;
  color: white;
  margin-bottom: 24px;
  border-radius: 0 0 32px 32px;
  box-shadow: $shadow-md;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
}

.welcome-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-subtitle {
  font-size: 15px;
  opacity: 0.95;
  font-weight: 400;
}

.statistics-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 12px;
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-card;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:active {
    transform: translateY(-2px);
    box-shadow: $shadow-hover;
    border-color: rgba(88, 204, 2, 0.2);
  }
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 12px;
  color: $text-secondary;
}

.menu-section {
  padding: 0 16px;
  margin-bottom: 20px;
}

.menu-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  background: white;
  border-radius: $radius-xl;
  box-shadow: $shadow-card;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;

  &:active {
    transform: translateY(-4px) scale(0.98);
    box-shadow: $shadow-hover;
    border-color: rgba(88, 204, 2, 0.3);
    background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
  }
}

.menu-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-md;
  margin-bottom: 4px;

  &.menu-icon-primary {
    background: $gradient-primary;
  }

  &.menu-icon-blue {
    background: $gradient-blue;
  }
}

.menu-title {
  font-size: 16px;
  font-weight: 700;
  color: $text-primary;
}

.menu-desc {
  font-size: 13px;
  color: $text-secondary;
  text-align: center;
  line-height: 1.4;
}

.recommended-section {
  padding: 0 16px;
}

.section-header {
  margin-bottom: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: $text-primary;
  margin-bottom: 4px;
}

.vocabulary-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vocab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vocab-word {
  font-size: 18px;
  font-weight: 700;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.vocab-definition {
  font-size: 13px;
  color: $text-secondary;
  line-height: 1.5;
}
</style>
