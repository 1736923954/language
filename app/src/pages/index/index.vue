<template>
  <view class="home-page">
    <!-- Hero Section -->
    <view class="hero-section">
      <view class="hero-content">
        <view class="hero-text">
          <text class="hero-greeting">{{ userGreeting }}</text>
          <text class="hero-title">{{ user?.username || 'Learner' }}!</text>
          <text class="hero-subtitle">Ready to master English today?</text>
        </view>
        <view class="hero-icon">
          <u-icon name="bookmark-fill" size="48" color="#ffffff" />
        </view>
      </view>
    </view>

    <!-- 快速统计 -->
    <view class="stats-section" v-if="statistics">
      <view class="stats-grid">
        <view class="stat-card" @click="navigateTo('/pages/vocabularies/index')">
          <view class="stat-icon stat-icon-green">
            <u-icon name="bookmark-fill" size="24" color="#4CAF50" />
          </view>
          <view class="stat-info">
            <text class="stat-number">{{ formatNumber(statistics.total || 0) }}</text>
            <text class="stat-label">Total Words</text>
          </view>
        </view>
        
        <view class="stat-card" @click="navigateTo('/pages/progress/index')">
          <view class="stat-icon stat-icon-blue">
            <u-icon name="checkmark-circle-fill" size="24" color="#2196F3" />
          </view>
          <view class="stat-info">
            <text class="stat-number">{{ formatNumber(statistics.mastered || 0) }}</text>
            <text class="stat-label">Mastered</text>
          </view>
        </view>
        
        <view class="stat-card" @click="navigateTo('/pages/progress/index')">
          <view class="stat-icon stat-icon-orange">
            <u-icon name="arrow-up-circle-fill" size="24" color="#FF9800" />
          </view>
          <view class="stat-info">
            <text class="stat-number">{{ formatPercentage(Number(statistics.masteredPercentage || 0)) }}</text>
            <text class="stat-label">Progress</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快速操作 -->
    <view class="actions-section">
      <view class="action-card action-primary" @click="navigateTo('/pages/vocabularies/index')">
        <view class="action-icon">
          <u-icon name="bookmark-fill" size="28" color="#ffffff" />
        </view>
        <view class="action-content">
          <text class="action-title">Start Learning</text>
          <text class="action-desc">Explore new vocabularies</text>
        </view>
        <u-icon name="arrow-right" size="20" color="#ffffff" />
      </view>
      
      <view class="action-card action-blue" @click="navigateTo('/pages/progress/index')">
        <view class="action-icon">
          <u-icon name="list" size="28" color="#ffffff" />
        </view>
        <view class="action-content">
          <text class="action-title">View Progress</text>
          <text class="action-desc">Track your achievements</text>
        </view>
        <u-icon name="arrow-right" size="20" color="#ffffff" />
      </view>
    </view>

    <!-- 推荐词汇 -->
    <view class="recommended-section" v-if="vocabularies.length > 0">
      <view class="section-header">
        <view class="section-title-wrapper">
          <u-icon name="star-fill" size="18" color="#FFC107" />
          <text class="section-title">Recommended</text>
        </view>
        <text class="section-more" @click="navigateTo('/pages/vocabularies/index')">See All →</text>
      </view>
      
      <view class="vocab-list">
        <view
          v-for="(vocab, index) in displayedVocabularies"
          :key="vocab.id"
          class="vocab-item"
          @click="goToDetail(vocab.id)"
        >
          <view class="vocab-number">{{ index + 1 }}</view>
          <view class="vocab-content">
            <view class="vocab-header">
              <text class="vocab-word">{{ vocab.word }}</text>
              <view class="vocab-badge" :class="`badge-${vocab.difficulty_level?.toLowerCase() || 'b1'}`">
                <text>{{ vocab.difficulty_level || 'B1' }}</text>
              </view>
            </view>
            <text class="vocab-phonetic" v-if="vocab.phonetic">{{ vocab.phonetic }}</text>
            <text class="vocab-definition">{{ vocab.definition || 'No definition available' }}</text>
            <view class="vocab-footer">
              <view class="vocab-info">
                <u-icon name="file-text" size="12" color="#757575" />
                <text class="vocab-examples">{{ vocab.example_count || 0 }} examples</text>
              </view>
            </view>
          </view>
          <u-icon name="arrow-right" size="16" color="#BDBDBD" />
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="isLoading" class="loading-container">
      <u-loading-icon mode="spinner" color="#4CAF50" />
      <text class="loading-text">Loading...</text>
    </view>

    <!-- 空状态 -->
    <view v-else-if="vocabularies.length === 0 && !isLoading" class="empty-section">
      <u-icon name="inbox" size="64" color="#BDBDBD" />
      <text class="empty-title">No vocabularies yet</text>
      <text class="empty-desc">Start learning to see recommendations</text>
      <u-button
        type="primary"
        text="Start Learning"
        shape="round"
        @click="navigateTo('/pages/vocabularies/index')"
        :custom-style="{
          marginTop: '24px',
          borderRadius: '24px',
          padding: '12px 32px'
        }"
      />
    </view>

    <!-- 错误提示 -->
    <u-toast ref="toastRef" />
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useLearningStore } from '@/stores/learning';
import { useAuthStore } from '@/stores/auth';
import { useLoading } from '@/composables/useLoading';
import { formatNumber, formatPercentage } from '@/utils/helpers';

const learningStore = useLearningStore();
const authStore = useAuthStore();
const { loading: isLoading, withLoading } = useLoading();
const toastRef = ref();

const user = computed(() => authStore.user);
const vocabularies = computed(() => learningStore.vocabularies || []);
const statistics = computed(() => learningStore.statistics);

const userGreeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
});

const displayedVocabularies = computed(() => {
  return vocabularies.value.slice(0, 5);
});

const loadData = async () => {
  try {
    await withLoading(async () => {
      await Promise.all([
        learningStore.loadVocabularies({ limit: 10 }).catch(err => {
          console.error('Failed to load vocabularies:', err);
        }),
        learningStore.loadStatistics().catch(err => {
          console.error('Failed to load statistics:', err);
        }),
      ]);
    });
  } catch (error: any) {
    console.error('Failed to load data:', error);
    uni.showToast({
      title: error?.message || 'Failed to load data',
      icon: 'none',
      duration: 2000,
    });
  }
};

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    uni.reLaunch({ url: '/pages/login/index' });
    return;
  }

  await loadData();
});

const navigateTo = (path: string) => {
  uni.navigateTo({ url: path });
};

const goToDetail = (id: number) => {
  if (!id) return;
  uni.navigateTo({ url: `/pages/vocabulary-detail/index?id=${id}` });
};
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.home-page {
  padding-bottom: 100px;
  background: #FAFAFA;
  min-height: 100vh;
}

// Hero Section
.hero-section {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  padding: 60px 20px 40px;
  margin-bottom: 24px;
  border-radius: 0 0 24px 24px;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.hero-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-greeting {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.hero-title {
  font-size: 32px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 4px;
}

.hero-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

// Stats Section
.stats-section {
  padding: 0 20px 24px;
}

.stats-grid {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.stat-card {
  flex: 1;
  min-width: 0;
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.stat-icon-green {
    background: rgba(76, 175, 80, 0.1);
  }
  
  &.stat-icon-blue {
    background: rgba(33, 150, 243, 0.1);
  }
  
  &.stat-icon-orange {
    background: rgba(255, 152, 0, 0.1);
  }
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #212121;
  line-height: 1.2;
}

.stat-label {
  font-size: 12px;
  color: #757575;
  font-weight: 500;
}

// Actions Section
.actions-section {
  padding: 0 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-card {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
  
  &:active {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  }
  
  &.action-blue {
    background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
    
    &:active {
      box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
    }
  }
}

.action-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.action-title {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  line-height: 1.2;
}

.action-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

// Recommended Section
.recommended-section {
  padding: 0 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #212121;
}

.section-more {
  font-size: 14px;
  color: #4CAF50;
  font-weight: 500;
}

.vocab-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vocab-item {
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  border: 1px solid #EEEEEE;
  
  &:active {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    border-color: #4CAF50;
  }
}

.vocab-number {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #FFFFFF;
  flex-shrink: 0;
}

.vocab-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.vocab-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.vocab-word {
  font-size: 18px;
  font-weight: 700;
  color: #212121;
  line-height: 1.2;
}

.vocab-badge {
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  
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

.vocab-phonetic {
  font-size: 13px;
  color: #757575;
  font-style: italic;
}

.vocab-definition {
  font-size: 14px;
  color: #212121;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.vocab-footer {
  margin-top: 4px;
}

.vocab-info {
  display: flex;
  align-items: center;
  gap: 4px;
}

.vocab-examples {
  font-size: 12px;
  color: #757575;
}

// Loading & Empty States
.loading-container {
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-text {
  font-size: 14px;
  color: #757575;
}

.empty-section {
  padding: 80px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #212121;
}

.empty-desc {
  font-size: 14px;
  color: #757575;
}
</style>
