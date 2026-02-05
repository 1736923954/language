import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI, type User, type LoginRequest } from '@/api/auth';
import request from '@/api/request';
import { STORAGE_KEYS } from '@/utils/constants';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref('');

  const isAuthenticated = computed(() => !!user.value);

  /**
   * 登录
   */
  const login = async (credentials: LoginRequest) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await authAPI.login(credentials);
      request.setToken(response.data.token);
      user.value = response.data.user;
      
      // 保存用户信息到本地存储
      try {
        uni.setStorageSync(STORAGE_KEYS.USER, response.data.user);
      } catch (e) {
        console.warn('Failed to save user to storage:', e);
      }
      
      return true;
    } catch (err: any) {
      const errorMessage = err?.message || err?.data?.message || 'Login failed';
      error.value = errorMessage;
      console.error('Login error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 登出
   */
  const logout = () => {
    user.value = null;
    request.clearToken();
    
    // 清除本地存储
    try {
      uni.removeStorageSync(STORAGE_KEYS.USER);
      uni.removeStorageSync(STORAGE_KEYS.TOKEN);
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
  };

  /**
   * 加载当前用户信息
   */
  const loadUser = async () => {
    try {
      // 先从本地存储加载
      try {
        const cachedUser = uni.getStorageSync(STORAGE_KEYS.USER);
        if (cachedUser) {
          user.value = cachedUser;
        }
      } catch (e) {
        console.warn('Failed to load user from storage:', e);
      }

      // 从服务器获取最新信息
      const response = await authAPI.getCurrentUser();
      user.value = response.data;
      
      // 更新本地存储
      try {
        uni.setStorageSync(STORAGE_KEYS.USER, response.data);
      } catch (e) {
        console.warn('Failed to save user to storage:', e);
      }
    } catch (err) {
      console.error('Failed to load user:', err);
      logout();
    }
  };

  /**
   * 初始化认证状态（从本地存储恢复）
   */
  const initAuth = () => {
    try {
      const token = uni.getStorageSync(STORAGE_KEYS.TOKEN);
      const cachedUser = uni.getStorageSync(STORAGE_KEYS.USER);
      
      if (token) {
        request.setToken(token);
        if (cachedUser) {
          user.value = cachedUser;
        }
        // 验证 token 是否有效
        loadUser().catch(() => {
          logout();
        });
      }
    } catch (e) {
      console.warn('Failed to init auth:', e);
    }
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    loadUser,
    initAuth,
  };
});
