<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Page Not Found</p>
    <el-button type="primary" @click="$router.push('/')">Go Home</el-button>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;
}

.not-found h1 {
  font-size: 72px;
  color: #ccc;
  margin: 0;
}

.not-found p {
  font-size: 24px;
  color: #666;
  margin: 20px 0;
}
</style>
