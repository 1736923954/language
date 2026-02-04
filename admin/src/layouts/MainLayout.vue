<template>
  <el-container class="admin-container">
    <!-- 侧边栏 -->
    <el-aside :width="sidebarCollapsed ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <span v-if="!sidebarCollapsed">English Admin</span>
        <span v-else>EA</span>
      </div>
      <el-menu
        :collapse="sidebarCollapsed"
        :default-active="currentPage"
        @select="handleMenuSelect"
        class="menu"
      >
        <el-menu-item index="dashboard">
          <el-icon><DataBoard /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="vocabularies">
          <el-icon><DocumentCopy /></el-icon>
          <span>Vocabularies</span>
        </el-menu-item>
        <el-menu-item index="sentences">
          <el-icon><Notebook /></el-icon>
          <span>Sentences</span>
        </el-menu-item>
        <el-menu-item index="categories">
          <el-icon><Folder /></el-icon>
          <span>Categories</span>
        </el-menu-item>
        <el-menu-item index="users">
          <el-icon><User /></el-icon>
          <span>Users</span>
        </el-menu-item>
        <el-menu-item index="statistics">
          <el-icon><DataAnalysis /></el-icon>
          <span>Statistics</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container class="main-container">
      <!-- 顶部栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-button
            :icon="sidebarCollapsed ? 'Expand' : 'Fold'"
            text
            @click="toggleSidebar"
          />
        </div>
        <div class="header-right">
          <el-button text @click="toggleTheme" :icon="theme === 'light' ? 'Moon' : 'Sunny'" />
          <el-dropdown>
            <span class="user-info">
              <el-icon><User /></el-icon>
              {{ user?.username || 'Admin' }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 主内容 -->
      <el-main class="content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/app';
import { useAuthStore } from '../stores/auth';
import {
  DataBoard,
  DocumentCopy,
  Notebook,
  Folder,
  User,
  DataAnalysis,
  Expand,
  Fold,
  Moon,
  Sunny,
} from '@element-plus/icons-vue';

const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

const sidebarCollapsed = computed(() => appStore.sidebarCollapsed);
const currentPage = computed(() => appStore.currentPage);
const theme = computed(() => appStore.theme);
const user = computed(() => authStore.user);

const toggleSidebar = () => {
  appStore.toggleSidebar();
};

const toggleTheme = () => {
  appStore.toggleTheme();
};

const handleMenuSelect = (key) => {
  appStore.setCurrentPage(key);
  router.push(`/${key === 'dashboard' ? '' : key}`);
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.admin-container {
  height: 100vh;
}

.sidebar {
  background-color: #1f2937;
  border-right: 1px solid #e5e7eb;
  transition: width 0.3s ease;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 16px;
  border-bottom: 1px solid #374151;
}

.menu {
  border: none;
  background-color: #1f2937;
}

.menu :deep(.el-menu-item) {
  color: #d1d5db;
}

.menu :deep(.el-menu-item.is-active) {
  background-color: #3b82f6 !important;
  color: white !important;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  background-color: #f9fafb;
  overflow-y: auto;
}
</style>
