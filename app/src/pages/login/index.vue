<template>
  <view class="login-page">
    <view class="login-bg" />
    <view class="login-card">
      <view class="logo-section">
        <view class="logo-icon">
          <u-icon name="bookmark-fill" size="40" color="#ffffff" />
        </view>
        <text class="app-title">English Learning</text>
        <text class="app-subtitle">Master English at your own pace</text>
      </view>
      <view class="form-section">
        <u-form :model="form" label-position="top">
          <u-form-item label="Username" prop="username" required>
            <u-input
              v-model="form.username"
              placeholder="Enter username"
              clearable
              :border="true"
              shape="circle"
            />
          </u-form-item>
          <u-form-item label="Password" prop="password" required>
            <u-input
              v-model="form.password"
              :password="true"
              placeholder="Enter password"
              clearable
              :border="true"
              shape="circle"
            />
          </u-form-item>
        </u-form>
        <u-button
          type="primary"
          :loading="isLoading"
          :disabled="isLoading"
          text="Login"
          shape="circle"
          block
          @click="handleLogin"
        />
        <u-alert
          v-if="error"
          :title="error"
          type="error"
          :show-icon="true"
          margin="16rpx 0 0 0"
        />
        <view class="demo-tip">
          <text>Demo: admin / admin123</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const form = reactive({
  username: 'admin',
  password: 'admin123',
});

const isLoading = ref(false);
const error = ref('');

const handleLogin = async () => {
  if (!form.username || !form.password) {
    error.value = 'Please enter username and password';
    return;
  }

  isLoading.value = true;
  error.value = '';

  const success = await authStore.login({
    username: form.username,
    password: form.password,
  });

  if (success) {
    uni.reLaunch({ url: '/pages/index/index' });
  } else {
    error.value = authStore.error || 'Login failed';
  }

  isLoading.value = false;
};
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.login-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px 20px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
}

.login-bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: $gradient-primary;
  z-index: 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 400px;
    height: 400px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
}

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 380px;
  background: #ffffff;
  border-radius: $radius-2xl;
  padding: 40px 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.logo-icon {
  width: 72px;
  height: 72px;
  background: $gradient-primary;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-md;
}

.app-title {
  font-size: 24px;
  font-weight: 700;
  background: $gradient-primary;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-subtitle {
  font-size: 12px;
  color: $text-secondary;
  text-align: center;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-tip {
  text-align: center;
  color: $text-secondary;
  font-size: $font-size-sm;
  padding-top: $spacing-lg;
  margin-top: $spacing-sm;
  border-top: 1px solid $border-color;
}
</style>
