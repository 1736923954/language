<template>
  <view class="login-page">
    <view class="login-bg" />
    <view class="login-card">
      <view class="logo-section">
        <text class="logo-text">📚</text>
        <text class="app-title">English Learning</text>
        <text class="app-subtitle">Master English at your own pace</text>
      </view>
      <view class="form-section">
        <view class="form-group">
          <text class="form-label">Username</text>
          <input
            v-model="form.username"
            class="form-input"
            placeholder="Enter username"
            type="text"
          />
        </view>
        <view class="form-group">
          <text class="form-label">Password</text>
          <input
            v-model="form.password"
            class="form-input"
            placeholder="Enter password"
            type="password"
          />
        </view>
        <button
          class="login-button"
          :disabled="isLoading"
          @click="handleLogin"
        >
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        <view v-if="error" class="error-message">{{ error }}</view>
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
@use '@/styles/variables.scss' as *;

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

/* 背景层 - 置于底层 */
.login-bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, $primary-color 0%, $primary-light 50%, #93c5fd 100%);
  z-index: 0;
}

/* 表单卡片 - 置于背景之上，可交互 */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 360px;
  background: #ffffff;
  border-radius: $radius-xl;
  padding: 32px 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 20px;
}

.logo-text {
  font-size: 32px;
  line-height: 1;
}

.app-title {
  font-size: 18px;
  font-weight: bold;
  color: $text-primary;
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

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
}

.form-input {
  display: block;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  font-size: 16px;
  color: $text-primary;
  background: #ffffff;
  box-sizing: border-box;
  -webkit-appearance: none;
  appearance: none;
}

.login-button {
  padding: 14px 24px;
  min-height: 48px;
  background: $primary-color;
  color: white;
  border: none;
  border-radius: $radius-md;
  font-size: $font-size-md;
  font-weight: 600;
  cursor: pointer;
  line-height: 1.5;
}

.login-button:active {
  background: $primary-dark;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: $error-color;
  font-size: $font-size-sm;
  text-align: center;
  padding: $spacing-md;
  background: rgba(239, 68, 68, 0.08);
  border-radius: $radius-md;
  border: 1px solid rgba(239, 68, 68, 0.2);
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

<!-- 修复 uni-input 在 H5 下无法输入：覆盖其 overflow:hidden 和固定高度 -->
<style lang="scss">
.login-page uni-input,
.login-page .uni-input-wrapper,
.login-page .uni-input-form {
  min-height: 44px !important;
  height: auto !important;
  overflow: visible !important;
}
</style>
