<template>
  <div class="statistics">
    <h1>Learning Statistics</h1>
    <el-row :gutter="20">
      <el-col :xs="24" :md="12">
        <el-card title="Learning Progress">
          <div id="chart-progress" style="height: 300px"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card title="User Activity">
          <div id="chart-activity" style="height: 300px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
// 统计页面（待实现图表）
</script>

<style scoped>
.statistics {
  padding: 20px;
}

.statistics h1 {
  margin-bottom: 20px;
  color: #333;
}
</style>
