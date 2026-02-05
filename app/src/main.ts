import { createApp as createVueApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import uviewPlus from 'uview-plus';
import { useAuthStore } from './stores/auth';

export function createApp() {
  // 使用 createApp 而非 createSSRApp，避免 H5 非 SSR 模式下 slots 只读导致的 "Cannot assign to read only property '_'" 错误
  const app = createVueApp(App);
  const pinia = createPinia();
  
  app.use(pinia);
  app.use(uviewPlus);
  
  // 初始化认证状态
  const authStore = useAuthStore();
  authStore.initAuth();
  
  return {
    app,
    pinia,
  };
}
