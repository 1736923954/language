<template>
  <div class="sentences">
    <div class="header">
      <h1>Sentences Management</h1>
      <el-button type="primary" @click="handleAdd">+ Add Sentence</el-button>
    </div>

    <!-- 搜索和筛选 -->
    <el-card style="margin-bottom: 20px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8">
          <el-input
            v-model="searchParams.vocabulary_id"
            placeholder="Search by vocabulary ID"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-select
            v-model="searchParams.difficulty_level"
            placeholder="Select difficulty"
            clearable
            @change="handleSearch"
          >
            <el-option label="A1" value="A1" />
            <el-option label="A2" value="A2" />
            <el-option label="B1" value="B1" />
            <el-option label="B2" value="B2" />
            <el-option label="C1" value="C1" />
            <el-option label="C2" value="C2" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-button @click="handleSearch" type="primary">Search</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <el-table
        :data="sentences"
        stripe
        style="width: 100%"
        :loading="loading"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="vocabulary_id" label="Vocabulary ID" width="120" />
        <el-table-column prop="english_text" label="English" min-width="200" show-overflow-tooltip />
        <el-table-column prop="chinese_translation" label="Chinese" min-width="150" show-overflow-tooltip />
        <el-table-column prop="usage_context" label="Context" width="100" />
        <el-table-column prop="difficulty_level" label="Level" width="80" />
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
      :title="editingId ? 'Edit Sentence' : 'Add Sentence'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="Vocabulary ID" prop="vocabulary_id">
          <el-input v-model.number="form.vocabulary_id" />
        </el-form-item>
        <el-form-item label="English Text" prop="english_text">
          <el-input v-model="form.english_text" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="Chinese Translation" prop="chinese_translation">
          <el-input v-model="form.chinese_translation" type="textarea" rows="2" />
        </el-form-item>
        <el-form-item label="Usage Context" prop="usage_context">
          <el-input v-model="form.usage_context" />
        </el-form-item>
        <el-form-item label="Difficulty Level" prop="difficulty_level">
          <el-select v-model="form.difficulty_level">
            <el-option label="A1" value="A1" />
            <el-option label="A2" value="A2" />
            <el-option label="B1" value="B1" />
            <el-option label="B2" value="B2" />
            <el-option label="C1" value="C1" />
            <el-option label="C2" value="C2" />
          </el-select>
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
import { sentenceAPI } from '../api/sentence';

const sentences = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingId = ref(null);

const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

const searchParams = reactive({
  vocabulary_id: '',
  difficulty_level: '',
});

const form = reactive({
  vocabulary_id: '',
  english_text: '',
  chinese_translation: '',
  usage_context: '',
  difficulty_level: 'B1',
});

const rules = {
  vocabulary_id: [{ required: true, message: 'Please enter vocabulary ID', trigger: 'blur' }],
  english_text: [{ required: true, message: 'Please enter English text', trigger: 'blur' }],
};

const formRef = ref();

onMounted(() => {
  loadSentences();
});

const loadSentences = async () => {
  loading.value = true;
  try {
    const response = await sentenceAPI.getList({
      page: currentPage.value,
      limit: pageSize.value,
      ...searchParams,
    });
    sentences.value = response.data || [];
    total.value = response.pagination?.total || 0;
  } catch (error) {
    ElMessage.error('Failed to load sentences');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadSentences();
};

const handlePageChange = () => {
  loadSentences();
};

const handleAdd = () => {
  editingId.value = null;
  form.vocabulary_id = '';
  form.english_text = '';
  form.chinese_translation = '';
  form.usage_context = '';
  form.difficulty_level = 'B1';
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  editingId.value = row.id;
  Object.assign(form, row);
  dialogVisible.value = true;
};

const handleDelete = (row) => {
  ElMessageBox.confirm(
    'Are you sure to delete this sentence?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await sentenceAPI.delete(row.id);
        ElMessage.success('Deleted successfully');
        loadSentences();
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
      await sentenceAPI.update(editingId.value, form);
      ElMessage.success('Updated successfully');
    } else {
      await sentenceAPI.create(form);
      ElMessage.success('Created successfully');
    }
    dialogVisible.value = false;
    loadSentences();
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Failed to save');
  }
};
</script>

<style scoped>
.sentences {
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
