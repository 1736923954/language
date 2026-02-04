<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalVocabularies }}</div>
            <div class="stat-label">Total Vocabularies</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalSentences }}</div>
            <div class="stat-label">Total Sentences</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalUsers }}</div>
            <div class="stat-label">Total Users</div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ stats.totalCategories }}</div>
            <div class="stat-label">Total Categories</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :xs="24" :md="12">
        <el-card title="Vocabularies by Category">
          <div id="chart-vocabularies" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card title="Difficulty Distribution">
          <div id="chart-difficulty" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref({
  totalVocabularies: 0,
  totalSentences: 0,
  totalUsers: 0,
  totalCategories: 0,
});

onMounted(() => {
  // 模拟数据
  stats.value = {
    totalVocabularies: 150,
    totalSentences: 500,
    totalUsers: 45,
    totalCategories: 8,
  };

  // 初始化图表（需要引入 ECharts）
  // initCharts();
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard h1 {
  margin-bottom: 20px;
  color: #333;
}

.stat-card {
  text-align: center;
}

.stat-content {
  padding: 20px 0;
}

.stat-number {
  font-size: 32px;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 10px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}
</style>
