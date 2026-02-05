<template>
  <view class="profile-page">
    <view v-if="user" class="user-section">
      <u-card :padding="24" :border-radius="12">
        <template #body>
          <view class="user-card">
            <u-avatar
              :text="user.username?.charAt(0)?.toUpperCase() || '?'"
              size="64"
              bg-color="#3b82f6"
              color="#fff"
            />
            <text class="username">{{ user.username }}</text>
            <text class="email" v-if="user.email">{{ user.email }}</text>
            <text class="level" v-if="user.level">Level: {{ user.level }}</text>
          </view>
        </template>
      </u-card>

      <view class="menu-section">
        <u-cell-group>
          <u-cell
            title="Logout"
            icon="close-circle-fill"
            :border="true"
            @click="handleLogout"
          />
        </u-cell-group>
      </view>
    </view>

    <u-loading-page v-if="isLoading" loading-text="Loading..." />

    <view v-else-if="!user" class="empty-section">
      <u-empty mode="list" text="Please login" margin-top="80">
        <u-button
          type="primary"
          text="Login"
          shape="circle"
          @click="uni.reLaunch({ url: '/pages/login/index' })"
        />
      </u-empty>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const user = ref(authStore.user);
const isLoading = ref(false);

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    uni.reLaunch({ url: '/pages/login/index' });
    return;
  }
  isLoading.value = true;
  await authStore.loadUser();
  user.value = authStore.user;
  isLoading.value = false;
});

const handleLogout = () => {
  authStore.logout();
  uni.reLaunch({ url: '/pages/login/index' });
};
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.profile-page {
  padding: 16px;
  padding-bottom: 100px;
}

.user-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 18px;
  font-weight: bold;
  color: $text-primary;
}

.email,
.level {
  font-size: 13px;
  color: $text-secondary;
}

.menu-section {
  margin-top: 0;
}

.empty-section {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
