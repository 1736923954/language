<template>
  <div class="login-container">
    <div class="login-box">
      <h1>English Learning Admin</h1>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="Username" prop="username">
          <el-input
            v-model="form.username"
            placeholder="Enter username"
            clearable
          />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Enter password"
            clearable
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            :loading="isLoading"
            style="width: 100%"
          >
            Login
          </el-button>
        </el-form-item>
      </el-form>
      <p v-if="error" class="error-message">{{ error }}</p>
      <p class="demo-tip">Demo: username: admin, password: admin123</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  username: 'admin',
  password: 'admin123',
});

const rules = {
  username: [
    { required: true, message: 'Please enter username', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
  ],
};

const isLoading = ref(false);
const error = ref('');
const formRef = ref();

const handleLogin = async () => {
  if (!formRef.value) return;

  await formRef.value.validate();

  isLoading.value = true;
  error.value = '';

  const success = await authStore.login(form.username, form.password);

  if (success) {
    ElMessage.success('Login successful');
    router.push('/');
  } else {
    error.value = authStore.error;
  }

  isLoading.value = false;
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-box h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 24px;
}

.error-message {
  color: #f56c6c;
  text-align: center;
  margin-top: 10px;
  font-size: 14px;
}

.demo-tip {
  text-align: center;
  color: #909399;
  font-size: 12px;
  margin-top: 20px;
}
</style>
