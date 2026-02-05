<template>
  <view class="app" />
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

onLaunch(() => {
  console.log('App Launch');
  // 应用启动时初始化认证
  authStore.initAuth();
});

onShow(() => {
  console.log('App Show');
});

onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
@import 'uview-plus/index.scss';
@import '@/styles/global.scss';

.app {
  width: 100%;
  height: 100vh;
}
</style>
