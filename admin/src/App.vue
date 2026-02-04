<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { useAppStore } from './stores/app';

const appStore = useAppStore();

onMounted(() => {
  // 应用主题
  if (appStore.theme === 'dark') {
    document.documentElement.classList.add('dark');
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f5f5;
}

#app {
  width: 100%;
  height: 100vh;
}
</style>
