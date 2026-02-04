<template>
  <div class="vocabularies">
    <div class="header">
      <h1>Vocabularies Management</h1>
      <el-button type="primary" @click="handleAdd">+ Add Vocabulary</el-button>
    </div>

    <!-- 搜索和筛选 -->
    <el-card style="margin-bottom: 20px">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-input
            v-model="searchParams.word"
            placeholder="Search word"
            clearable
            @input="handleSearch"
          />
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select
            v-model="searchParams.category_id"
            placeholder="Select category"
            clearable
            @change="handleSearch"
          >
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
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
        <el-col :xs="24" :sm="12" :md="6">
          <el-button @click="handleSearch" type="primary">Search</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格 -->
    <el-card>
      <el-table
        :data="vocabularies"
        stripe
        style="width: 100%"
        :loading="loading"
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="word" label="Word" min-width="120" />
        <el-table-column prop="definition" label="Definition" min-width="200" show-overflow-tooltip />
        <el-table-column prop="definition_zh" label="Definition (ZH)" min-width="150" />
        <el-table-column prop="part_of_speech" label="POS" width="80" />
        <el-table-column prop="difficulty_level" label="Level" width="80" />
        <el-table-column prop="category_name" label="Category" width="100" />
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
      :title="editingId ? 'Edit Vocabulary' : 'Add Vocabulary'"
      width="600px"
    >
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="Word" prop="word">
          <el-input v-model="form.word" />
        </el-form-item>
        <el-form-item label="Phonetic" prop="phonetic">
          <el-input v-model="form.phonetic" />
        </el-form-item>
        <el-form-item label="Definition" prop="definition">
          <el-input v-model="form.definition" type="textarea" rows="3" />
        </el-form-item>
        <el-form-item label="Definition (ZH)" prop="definition_zh">
          <el-input v-model="form.definition_zh" />
        </el-form-item>
        <el-form-item label="Part of Speech" prop="part_of_speech">
          <el-select v-model="form.part_of_speech" placeholder="Select POS">
            <el-option label="Noun" value="noun" />
            <el-option label="Verb" value="verb" />
            <el-option label="Adjective" value="adjective" />
            <el-option label="Adverb" value="adverb" />
            <el-option label="Preposition" value="preposition" />
          </el-select>
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
        <el-form-item label="Category" prop="category_id">
          <el-select v-model="form.category_id" placeholder="Select category">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            />
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
import { vocabularyAPI } from '../api/vocabulary';
import { categoryAPI } from '../api/category';

const vocabularies = ref([]);
const categories = ref([]);
const loading = ref(false);
const dialogVisible = ref(false);
const editingId = ref(null);

const currentPage = ref(1);
const pageSize = ref(20);
const total = ref(0);

const searchParams = reactive({
  word: '',
  category_id: '',
  difficulty_level: '',
});

const form = reactive({
  word: '',
  phonetic: '',
  definition: '',
  definition_zh: '',
  part_of_speech: '',
  difficulty_level: 'B1',
  category_id: '',
});

const rules = {
  word: [{ required: true, message: 'Please enter word', trigger: 'blur' }],
  definition: [{ required: true, message: 'Please enter definition', trigger: 'blur' }],
  category_id: [{ required: true, message: 'Please select category', trigger: 'change' }],
};

const formRef = ref();

onMounted(() => {
  loadCategories();
  loadVocabularies();
});

const loadCategories = async () => {
  try {
    const response = await categoryAPI.getList();
    categories.value = response.data || [];
  } catch (error) {
    ElMessage.error('Failed to load categories');
  }
};

const loadVocabularies = async () => {
  loading.value = true;
  try {
    const response = await vocabularyAPI.getList({
      page: currentPage.value,
      limit: pageSize.value,
      ...searchParams,
    });
    vocabularies.value = response.data || [];
    total.value = response.pagination?.total || 0;
  } catch (error) {
    ElMessage.error('Failed to load vocabularies');
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  loadVocabularies();
};

const handlePageChange = () => {
  loadVocabularies();
};

const handleAdd = () => {
  editingId.value = null;
  form.word = '';
  form.phonetic = '';
  form.definition = '';
  form.definition_zh = '';
  form.part_of_speech = '';
  form.difficulty_level = 'B1';
  form.category_id = '';
  dialogVisible.value = true;
};

const handleEdit = (row) => {
  editingId.value = row.id;
  Object.assign(form, row);
  dialogVisible.value = true;
};

const handleDelete = (row) => {
  ElMessageBox.confirm(
    `Are you sure to delete "${row.word}"?`,
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await vocabularyAPI.delete(row.id);
        ElMessage.success('Deleted successfully');
        loadVocabularies();
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
      await vocabularyAPI.update(editingId.value, form);
      ElMessage.success('Updated successfully');
    } else {
      await vocabularyAPI.create(form);
      ElMessage.success('Created successfully');
    }
    dialogVisible.value = false;
    loadVocabularies();
  } catch (error) {
    ElMessage.error(error.response?.data?.message || 'Failed to save');
  }
};
</script>

<style scoped>
.vocabularies {
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
