import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI, type User, type LoginRequest } from '@/api/auth';
import request from '@/api/request';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isLoading = ref(false);
  const error = ref('');

  const isAuthenticated = computed(() => !!user.value);

  const login = async (credentials: LoginRequest) => {
    isLoading.value = true;
    error.value = '';

    try {
      const response = await authAPI.login(credentials);
      request.setToken(response.data.token);
      user.value = response.data.user;
      return true;
    } catch (err: any) {
      error.value = err.message || 'Login failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    request.clearToken();
  };

  const loadUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      user.value = response.data;
    } catch (err) {
      logout();
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
  };
});
