<template>
  <view class="profile-page">
    <view class="user-card" v-if="user">
      <view class="avatar-wrap">
        <text class="avatar">{{ user.username?.charAt(0)?.toUpperCase() || '?' }}</text>
      </view>
      <text class="username">{{ user.username }}</text>
      <text class="email" v-if="user.email">{{ user.email }}</text>
      <text class="level" v-if="user.level">Level: {{ user.level }}</text>
    </view>

    <view class="menu-section">
      <view class="menu-item" @click="handleLogout">
        <text class="menu-icon">🚪</text>
        <text class="menu-text">Logout</text>
      </view>
    </view>

    <view v-if="isLoading" class="loading">
      <text>Loading...</text>
    </view>

    <view v-if="!isLoading && !user" class="empty-state">
      <text class="empty-text">Please login</text>
      <button class="login-btn" @click="uni.reLaunch({ url: '/pages/login/index' })">Login</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = ref(authStore.user);
const isLoading = ref(false);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    uni.reLaunch({ url: '/pages/login/index' });
    return;
  }
  isLoading.value = true;
  await authStore.loadUser();
  user.value = authStore.user;
  isLoading.value = false;
});

const handleLogout = () => {
  authStore.logout();
  uni.reLaunch({ url: '/pages/login/index' });
};
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.profile-page {
  padding: 16px;
  padding-bottom: 100px;
}

.user-card {
  background: white;
  border-radius: $radius-lg;
  padding: 24px;
  text-align: center;
  box-shadow: $shadow-md;
  margin-bottom: 20px;
}

.avatar-wrap {
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  font-size: 28px;
  font-weight: bold;
  color: white;
}

.username {
  display: block;
  font-size: 18px;
  font-weight: bold;
  color: $text-primary;
  margin-bottom: 4px;
}

.email,
.level {
  display: block;
  font-size: 13px;
  color: $text-secondary;
  margin-bottom: 2px;
}

.menu-section {
  background: white;
  border-radius: $radius-lg;
  overflow: hidden;
  box-shadow: $shadow-md;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid $border-color;

  &:last-child {
    border-bottom: none;
  }
}

.menu-icon {
  font-size: 20px;
}

.menu-text {
  font-size: 15px;
  color: $text-primary;
}

.loading,
.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: $text-secondary;
}

.login-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: $primary-color;
  color: white;
  border-radius: $radius-md;
  font-size: 14px;
}
</style>
