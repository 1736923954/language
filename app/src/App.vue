<template>
  <view class="app">
    <router-view />
  </view>
</template>

<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

onLaunch(() => {
  console.log('App Launch');
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
@import '@/styles/variables.scss';
@import '@/styles/global.scss';

.app {
  width: 100%;
  height: 100vh;
}
</style>
