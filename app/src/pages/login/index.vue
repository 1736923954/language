<template>
  <view class="login-page">
    <view class="login-bg">
      <view class="bg-shapes">
        <view class="shape shape-1"></view>
        <view class="shape shape-2"></view>
        <view class="shape shape-3"></view>
      </view>
    </view>
    
    <view class="login-container">
      <view class="login-card">
        <!-- Logo 区域 -->
        <!-- <view class="logo-section">
          <view class="logo-wrapper">
            <view class="logo-icon">
              <u-icon name="bookmark-fill" size="40" color="#4CAF50" />
            </view>
            <view class="logo-ring"></view>
          </view>
          <text class="app-title">English Learning</text>
          <text class="app-subtitle">Master English at your own pace</text>
        </view> -->

        <!-- 表单区域 -->
        <view class="form-section">
          <view class="input-group">
            <view class="input-wrapper">
              <u-icon name="account" size="20" color="#757575" class="input-icon" />
              <u-input
                v-model="form.username"
                placeholder="Username"
                :border="false"
                :custom-style="{
                  flex: 1,
                  fontSize: '16px',
                  padding: '0'
                }"
              />
            </view>
          </view>

          <view class="input-group">
            <view class="input-wrapper">
              <u-icon name="lock" size="20" color="#757575" class="input-icon" />
              <u-input
                v-model="form.password"
                :password="true"
                placeholder="Password"
                :border="false"
                :custom-style="{
                  flex: 1,
                  fontSize: '16px',
                  padding: '0'
                }"
              />
            </view>
          </view>

          <u-button
            type="primary"
            :loading="isLoading"
            :disabled="isLoading || !isFormValid"
            text="Login"
            shape="round"
            block
            :custom-style="{
              height: '52px',
              fontSize: '16px',
              fontWeight: '600',
              marginTop: '32px',
              borderRadius: '26px',
              background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)'
            }"
            @click="handleLogin"
          />

          <u-alert
            v-if="error"
            :title="error"
            type="error"
            :show-icon="true"
            margin="20px 0 0 0"
            :custom-style="{
              borderRadius: '12px',
              padding: '12px 16px'
            }"
            @close="error = ''"
          />

          <view class="demo-tip">
            <u-icon name="info-circle" size="14" color="#BDBDBD" />
            <text class="demo-text">Demo: admin / admin123</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLoading } from '@/composables/useLoading';
import { useError } from '@/composables/useError';

const authStore = useAuthStore();
const { loading: isLoading, withLoading } = useLoading();
const { error, setError, clearError } = useError();

const form = reactive({
  username: 'admin',
  password: 'admin123',
});

const isFormValid = computed(() => {
  return form.username.trim().length > 0 && form.password.trim().length > 0;
});

const handleLogin = async () => {
  if (!isFormValid.value) {
    setError('Please enter username and password');
    return;
  }

  clearError();
  
  const success = await withLoading(async () => {
    return await authStore.login({
      username: form.username.trim(),
      password: form.password,
    });
  });

  if (success) {
    uni.showToast({
      title: 'Login successful!',
      icon: 'success',
      duration: 1500,
    });
    setTimeout(() => {
      uni.reLaunch({ url: '/pages/index/index' });
    }, 500);
  } else {
    setError(authStore.error || 'Login failed');
  }
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
  overflow: hidden;
}

.login-bg {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 50%, #81C784 100%);
  z-index: 0;
  overflow: hidden;
}

.bg-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 8s ease-in-out infinite;

  &.shape-1 {
    width: 300px;
    height: 300px;
    top: -100px;
    right: -50px;
    animation-delay: 0s;
  }

  &.shape-2 {
    width: 200px;
    height: 200px;
    bottom: -50px;
    left: -50px;
    animation-delay: 2s;
  }

  &.shape-3 {
    width: 150px;
    height: 150px;
    top: 50%;
    right: 20%;
    animation-delay: 4s;
  }
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 28px;
  padding: 40px 28px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.5);
  animation: slideInUp 0.6s $ease-out;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 36px;
}

.logo-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
}

.logo-icon {
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.2);
  animation: logoFloat 3s ease-in-out infinite;
}

.logo-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  border: 2px solid rgba(76, 175, 80, 0.2);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.app-title {
  font-size: 28px;
  font-weight: $font-weight-bold;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
}

.app-subtitle {
  font-size: $font-size-sm;
  color: $text-secondary;
  text-align: center;
  font-weight: $font-weight-normal;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  margin-bottom: 0;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: $bg-tertiary;
  border-radius: 16px;
  border: 2px solid transparent;
  transition: all $duration-normal $ease-out;

  &:focus-within {
    background: white;
    border-color: #4CAF50;
    box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
  }
}

.input-icon {
  flex-shrink: 0;
}

.demo-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-top: 20px;
  margin-top: 16px;
  border-top: 1px solid $divider-color;
}

.demo-text {
  font-size: $font-size-sm;
  color: $text-tertiary;
  font-weight: $font-weight-medium;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-30px) translateX(20px);
  }
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
