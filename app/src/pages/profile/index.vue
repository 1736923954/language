<template>
  <view class="profile-page">
    <view v-if="user" class="profile-content">
      <!-- 用户信息卡片 -->
      <view class="user-card">
        <view class="user-header">
          <view class="avatar-wrapper">
            <view class="avatar">
              <text class="avatar-text">{{ user.username?.charAt(0)?.toUpperCase() || '?' }}</text>
            </view>
            <view class="avatar-badge">
              <u-icon name="checkmark-circle-fill" size="18" color="#4CAF50" />
            </view>
          </view>
          <view class="user-info">
            <text class="username">{{ user.username }}</text>
            <text class="email" v-if="user.email">{{ user.email }}</text>
            <view class="level-badge" v-if="user.level">
              <u-icon name="star-fill" size="14" color="#FFC107" />
              <text class="level-text">Level {{ user.level }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 统计信息 -->
      <view class="stats-mini-section" v-if="statistics">
        <view class="stats-mini-grid">
          <view class="stat-mini-item">
            <text class="stat-mini-number">{{ formatNumber(statistics.total) }}</text>
            <text class="stat-mini-label">Total</text>
          </view>
          <view class="stat-mini-item">
            <text class="stat-mini-number">{{ formatNumber(statistics.mastered) }}</text>
            <text class="stat-mini-label">Mastered</text>
          </view>
          <view class="stat-mini-item">
            <text class="stat-mini-number">{{ formatPercentage(Number(statistics.masteredPercentage)) }}%</text>
            <text class="stat-mini-label">Progress</text>
          </view>
        </view>
      </view>

      <!-- 菜单区域 -->
      <view class="menu-section">
        <view class="menu-card" @click="handleSettings">
          <view class="menu-icon">
            <u-icon name="setting" size="20" color="#4CAF50" />
          </view>
          <text class="menu-title">Settings</text>
          <u-icon name="arrow-right" size="18" color="#BDBDBD" />
        </view>
        
        <view class="menu-card" @click="handleAbout">
          <view class="menu-icon">
            <u-icon name="info-circle" size="20" color="#2196F3" />
          </view>
          <text class="menu-title">About</text>
          <u-icon name="arrow-right" size="18" color="#BDBDBD" />
        </view>
        
        <view class="menu-card menu-card-danger" @click="handleLogout">
          <view class="menu-icon">
            <u-icon name="close-circle-fill" size="20" color="#F44336" />
          </view>
          <text class="menu-title">Logout</text>
          <u-icon name="arrow-right" size="18" color="#BDBDBD" />
        </view>
      </view>
    </view>

    <u-loading-page v-if="isLoading" loading-text="Loading..." />

    <view v-else-if="!user" class="empty-section">
      <view class="empty-icon">
        <u-icon name="inbox" size="64" color="#BDBDBD" />
      </view>
      <text class="empty-title">Please login</text>
      <u-button
        type="primary"
        text="Login"
        shape="round"
        @click="uni.reLaunch({ url: '/pages/login/index' })"
        :custom-style="{
          borderRadius: '24px',
          marginTop: '24px',
          padding: '12px 32px'
        }"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLearningStore } from '@/stores/learning';
import { useLoading } from '@/composables/useLoading';
import { formatNumber, formatPercentage } from '@/utils/helpers';

const authStore = useAuthStore();
const learningStore = useLearningStore();
const { loading: isLoading, withLoading } = useLoading();

const user = computed(() => authStore.user);
const statistics = computed(() => learningStore.statistics);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    uni.reLaunch({ url: '/pages/login/index' });
    return;
  }

  await withLoading(async () => {
    await Promise.all([
      authStore.loadUser(),
      learningStore.loadStatistics(),
    ]);
  });
});

const handleSettings = () => {
  uni.showToast({
    title: 'Settings coming soon',
    icon: 'none',
  });
};

const handleAbout = () => {
  uni.showModal({
    title: 'About',
    content: 'English Learning App\nVersion 1.0.0\n\nMaster English at your own pace!',
    showCancel: false,
    confirmText: 'OK',
  });
};

const handleLogout = () => {
  uni.showModal({
    title: 'Confirm Logout',
    content: 'Are you sure you want to logout?',
    confirmColor: '#F44336',
    success: (res) => {
      if (res.confirm) {
        authStore.logout();
        uni.showToast({
          title: 'Logged out',
          icon: 'success',
        });
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/login/index' });
        }, 500);
      }
    },
  });
};
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.profile-page {
  padding: 20px;
  padding-bottom: 100px;
  background: linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%);
  min-height: 100vh;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// ============================================
// 用户卡片
// ============================================

.user-card {
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

.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: $radius-xl;
  background: $gradient-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.avatar-text {
  font-size: 32px;
  font-weight: $font-weight-bold;
  color: white;
}

.avatar-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-sm;
  border: 2px solid white;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.username {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  line-height: $line-height-tight;
}

.email {
  font-size: $font-size-sm;
  color: $text-secondary;
  font-weight: $font-weight-normal;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(255, 193, 7, 0.1);
  border-radius: $radius-lg;
  width: fit-content;
  margin-top: 4px;
}

.level-text {
  font-size: $font-size-xs;
  color: #FFC107;
  font-weight: $font-weight-bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

// ============================================
// 统计信息
// ============================================

.stats-mini-section {
  background: white;
  border-radius: $radius-xl;
  padding: 20px;
  box-shadow: $shadow-sm;
  border: 1px solid $divider-color;
}

.stats-mini-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.stat-mini-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: $bg-secondary;
  border-radius: $radius-lg;
  transition: all $duration-normal $ease-out;

  &:active {
    transform: scale(1.05);
    background: rgba(76, 175, 80, 0.05);
  }
}

.stat-mini-number {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: #4CAF50;
  line-height: $line-height-tight;
}

.stat-mini-label {
  font-size: $font-size-xs;
  color: $text-secondary;
  font-weight: $font-weight-medium;
}

// ============================================
// 菜单区域
// ============================================

.menu-section {
  background: white;
  border-radius: $radius-xl;
  padding: 12px;
  box-shadow: $shadow-sm;
  border: 1px solid $divider-color;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: $radius-lg;
  transition: all $duration-normal $ease-out;
  background: transparent;

  &:active {
    background: $bg-secondary;
    transform: translateX(4px);
  }

  &.menu-card-danger {
    &:active {
      background: rgba(244, 67, 54, 0.05);
    }
  }
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: $radius-md;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(76, 175, 80, 0.1);
  flex-shrink: 0;

  .menu-card-danger & {
    background: rgba(244, 67, 54, 0.1);
  }
}

.menu-title {
  flex: 1;
  font-size: $font-size-md;
  font-weight: $font-weight-medium;
  color: $text-primary;

  .menu-card-danger & {
    color: #F44336;
  }
}

// ============================================
// 空状态
// ============================================

.empty-section {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
}

.empty-icon {
  margin-bottom: 8px;
}

.empty-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
}
</style>
