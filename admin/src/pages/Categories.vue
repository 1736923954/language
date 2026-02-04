<template>
  <div class="categories">
    <div class="header">
      <h1>Categories Management</h1>
      <el-button type="primary" @click="handleAdd">+ Add Category</el-button>
    </div>

    <!-- 表格 -->
    <el-card>
      <el-table
        :data="categories"
        stripe
        style="width: 100%"
        :loading="loading"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="Name" width="150" />
        <el-table-column prop="description" label="Description" min-width="200" show-overflow-tooltip />
        <el-table-column prop="sort_order" label="Sort Order" width="100" />
        <el-table-column label="Actions" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">Edit</el-button>
            <el-button link type="danger" @click="handleDelete(row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingId ? 'Edit Category' : 'Add Category'"
      width="500px"
    >
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="Name" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Description" prop="description">
          <el-input v-model="form.description" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="Sort Order" prop="sort_order">
          <el-input-number v-model="form.sort_order" :min="0" />
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
import { categoryAPI } from '../api/category';

const categories = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingId = ref(null);

const form = reactive({
  name: '',
  description: '',
  sort_order: 0,
});

const rules = {
  name: [{ required: true, message: 'Please enter category name', trigger: 'blur' }],
};

const formRef = ref();

onMounted(() => {
  loadCategories();
});

const loadCategories = async () => {
  loading.value = true;
  try {
    const response = await categoryAPI.getList();
    categories.value = response.data || [];
  } catch (error) {
    ElMessage.error('Failed to load categories');
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  editingId.value = null;
  form.name = '';
  form.description = '';
  form.sort_order = 0;
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  editingId.value = row.id;
  Object.assign(form, row);
  dialogVisible.value = true;
};

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `Are you sure to delete "${row.name}"?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await categoryAPI.delete(row.id);
        ElMessage.success('Deleted successfully');
        loadCategories();
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
    if (editingId.value) {
      await categoryAPI.update(editingId.value, form);
      ElMessage.success('Updated successfully');
    } else {
      await categoryAPI.create(form);
      ElMessage.success('Created successfully');
    }
    dialogVisible.value = false;
    loadCategories();
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Failed to save');
  }
};
</script>

<style scoped>
.categories {
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
