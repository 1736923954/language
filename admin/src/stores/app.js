import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false);
  const currentPage = ref('dashboard');
  const theme = ref(localStorage.getItem('theme') || 'light');

  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value;
  };

  const setCurrentPage = (page) => {
    currentPage.value = page;
  };

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
  };

  return {
    sidebarCollapsed,
    currentPage,
    theme,
    toggleSidebar,
    setCurrentPage,
    toggleTheme,
  };
});
