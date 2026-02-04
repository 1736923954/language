<template>
  <view class="login-page">
    <view class="login-container">
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

        <view class="divider">
          <text>or</text>
        </view>

        <button class="register-button" @click="navigateTo('/pages/register/index')">
          Create Account
        </button>

        <view v-if="error" class="error-message">
          {{ error }}
        </view>

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

const navigateTo = (path: string) => {
  uni.navigateTo({ url: path });
};
</script>

<style scoped lang="scss">
@use '@/styles/variables.scss' as *;

.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, $primary-color 0%, $primary-light 100%);
  padding: $spacing-lg;
}

.login-container {
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: $radius-xl;
  padding: $spacing-3xl;
  box-shadow: $shadow-lg;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-md;
  margin-bottom: $spacing-3xl;
}

.logo-text {
  font-size: 48px;
}

.app-title {
  font-size: $font-size-2xl;
  font-weight: bold;
  color: $text-primary;
}

.app-subtitle {
  font-size: $font-size-sm;
  color: $text-secondary;
  text-align: center;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: $spacing-lg;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
}

.form-label {
  font-size: $font-size-sm;
  font-weight: bold;
  color: $text-primary;
}

.form-input {
  padding: $spacing-md;
  border: 1px solid $border-color;
  border-radius: $radius-md;
  font-size: $font-size-md;
  color: $text-primary;

  &:focus {
    border-color: $primary-color;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
}

.login-button {
  padding: $spacing-md;
  background: $primary-color;
  color: white;
  border: none;
  border-radius: $radius-md;
  font-size: $font-size-md;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:active {
    background: $primary-dark;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.divider {
  display: flex;
  align-items: center;
  gap: $spacing-md;
  color: $text-secondary;
  font-size: $font-size-sm;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: $border-color;
  }
}

.register-button {
  padding: $spacing-md;
  background: white;
  color: $primary-color;
  border: 2px solid $primary-color;
  border-radius: $radius-md;
  font-size: $font-size-md;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;

  &:active {
    background: $bg-secondary;
  }
}

.error-message {
  color: $error-color;
  font-size: $font-size-sm;
  text-align: center;
  padding: $spacing-md;
  background: rgba(239, 68, 68, 0.1);
  border-radius: $radius-md;
}

.demo-tip {
  text-align: center;
  color: $text-secondary;
  font-size: $font-size-sm;
  padding-top: $spacing-md;
  border-top: 1px solid $border-color;
}
</style>
