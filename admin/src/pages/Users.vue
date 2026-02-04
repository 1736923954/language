<template>
  <div class="users">
    <div class="header">
      <h1>Users Management</h1>
    </div>

    <!-- 搜索 -->
    <el-card style="margin-bottom: 20px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8">
          <el-input
            v-model="searchParams.username"
            placeholder="Search username"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-input
            v-model="searchParams.email"
            placeholder="Search email"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-button @click="handleSearch" type="primary">Search</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <el-table
        :data="users"
        stripe
        style="width: 100%"
        :loading="loading"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="username" label="Username" width="120" />
        <el-table-column prop="email" label="Email" min-width="150" show-overflow-tooltip />
        <el-table-column prop="nickname" label="Nickname" width="120" />
        <el-table-column prop="level" label="Level" width="80" />
        <el-table-column prop="role" label="Role" width="80" />
        <el-table-column prop="is_active" label="Status" width="80">
          <template #default="{ row }">
            <el-tag :type="row.is_active ? 'success' : 'danger'">
              {{ row.is_active ? 'Active' : 'Inactive' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">Edit</el-button>
            <el-button link type="danger" @click="handleDelete(row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px; text-align: right"
        @change="handlePageChange"
      />
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="Edit User"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="Nickname" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>
        <el-form-item label="Level" prop="level">
          <el-select v-model="form.level">
            <el-option label="A1" value="A1" />
            <el-option label="A2" value="A2" />
            <el-option label="B1" value="B1" />
            <el-option label="B2" value="B2" />
            <el-option label="C1" value="C1" />
            <el-option label="C2" value="C2" />
          </el-select>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-select v-model="form.role">
            <el-option label="User" value="user" />
            <el-option label="Admin" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item label="Status" prop="is_active">
          <el-switch v-model="form.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSave">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { userAPI } from '../api/user';

const users = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingId = ref(null);

const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

const searchParams = reactive({
  username: '',
  email: '',
});

const form = reactive({
  username: '',
  email: '',
  nickname: '',
  level: 'B1',
  role: 'user',
  is_active: true,
});

const rules = {
  email: [{ type: 'email', message: 'Invalid email', trigger: 'blur' }],
};

const formRef = ref();

onMounted(() => {
  loadUsers();
});

const loadUsers = async () => {
  loading.value = true;
  try {
    const response = await userAPI.getList({
      page: currentPage.value,
      limit: pageSize.value,
      ...searchParams,
    });
    users.value = response.data || [];
    total.value = response.pagination?.total || 0;
  } catch (error) {
    ElMessage.error('Failed to load users');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadUsers();
};

const handlePageChange = () => {
  loadUsers();
};

const handleEdit = (row) => {
  editingId.value = row.id;
  Object.assign(form, row);
  dialogVisible.value = true;
};

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `Are you sure to delete user "${row.username}"?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await userAPI.delete(row.id);
        ElMessage.success('Deleted successfully');
        loadUsers();
      } catch (error) {
        ElMessage.error('Failed to delete');
      }
    })
    .catch(() => {});
};

const handleSave = async () => {
  if (!formRef.value) return;

  await formRef.value.validate();

  try {
    await userAPI.update(editingId.value, form);
    ElMessage.success('Updated successfully');
    dialogVisible.value = false;
    loadUsers();
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Failed to save');
  }
};
</script>

<style scoped>
.users {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  color: #333;
}
</style>
