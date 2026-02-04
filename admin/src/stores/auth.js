import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authAPI } from '../api/auth';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '');
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const isLoading = ref(false);
  const error = ref('');

  const isAuthenticated = computed(() => !!token.value);

  const login = async (username, password) => {
    isLoading.value = true;
    error.value = '';
    try {
      const response = await authAPI.login({ username, password });
      token.value = response.data.token;
      user.value = response.data.user;
      localStorage.setItem('token', token.value);
      localStorage.setItem('user', JSON.stringify(user.value));
      return true;
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    token.value = '';
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    token,
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
  };
});
