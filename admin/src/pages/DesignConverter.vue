<template>
  <div class="design-converter">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>设计转换工具</h2>
          <el-tag type="info">Figma to Code</el-tag>
        </div>
      </template>

      <!-- 任务说明 -->
      <el-alert
        title="任务说明"
        type="info"
        :closable="false"
        style="margin-bottom: 20px"
      >
        <p>此页面用于执行 Figma 设计转换任务，根据 SKILL.md 文档的流程将设计转换为代码。</p>
        <p><strong>Figma 设计链接：</strong></p>
        <el-link
          :href="figmaUrl"
          target="_blank"
          type="primary"
          style="margin-top: 8px"
        >
          {{ figmaUrl }}
        </el-link>
      </el-alert>

      <!-- SKILL 文档内容 -->
      <el-card shadow="never" style="margin-bottom: 20px">
        <template #header>
          <h3>SKILL.md 文档</h3>
        </template>
        <div class="skill-content">
          <el-scrollbar height="400px">
            <pre class="skill-text">{{ skillContent }}</pre>
          </el-scrollbar>
        </div>
      </el-card>

      <!-- Figma 设计预览 -->
      <el-card shadow="never" style="margin-bottom: 20px">
        <template #header>
          <h3>Figma 设计预览</h3>
        </template>
        <div class="figma-preview">
          <el-image
            :src="figmaImageUrl"
            fit="contain"
            style="width: 100%; max-height: 600px"
            :preview-src-list="[figmaImageUrl]"
            :initial-index="0"
            preview-teleported
          >
            <template #error>
              <div class="image-error">
                <el-icon><Picture /></el-icon>
                <p>无法加载图片，请检查 Figma 链接</p>
              </div>
            </template>
          </el-image>
        </div>
      </el-card>

      <!-- 操作步骤 -->
      <el-card shadow="never">
        <template #header>
          <h3>执行步骤</h3>
        </template>
        <el-steps :active="currentStep" direction="vertical" finish-status="success">
          <el-step title="Phase 0: Setup" description="创建 helper script 和脚本环境">
            <template #description>
              <div class="step-description">
                <p>1. 创建 scripts 目录</p>
                <p>2. 复制 coderio-skill.mjs 和 package.json</p>
                <p>3. 安装 coderio 依赖</p>
              </div>
            </template>
          </el-step>
          <el-step title="Phase 1: Protocol Generation" description="生成设计协议（结构和属性）">
            <template #description>
              <div class="step-description">
                <p>1. Fetch Data: 从 Figma 获取设计数据</p>
                <p>2. Generate Structure: 生成组件结构 JSON</p>
                <p>3. Extract Props: 提取每个组件的属性</p>
              </div>
            </template>
          </el-step>
          <el-step title="Phase 2: Code Generation" description="生成组件代码">
            <template #description>
              <div class="step-description">
                <p>1. Plan Tasks: 列出生成任务</p>
                <p>2. Generate Components: 逐个生成组件代码</p>
                <p>3. Final Integration: 集成到应用中</p>
              </div>
            </template>
          </el-step>
        </el-steps>

        <div class="action-buttons" style="margin-top: 30px">
          <el-button type="primary" @click="handleStartConversion" :loading="loading">
            <el-icon><MagicStick /></el-icon>
            开始转换
          </el-button>
          <el-button @click="handleViewFigma" type="info">
            <el-icon><Link /></el-icon>
            在 Figma 中打开
          </el-button>
          <el-button @click="handleViewSkill" type="success">
            <el-icon><Document /></el-icon>
            查看完整 SKILL.md
          </el-button>
        </div>
      </el-card>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Picture, MagicStick, Link, Document } from '@element-plus/icons-vue';

const figmaUrl = ref('https://www.figma.com/design/ZYdtCFf5KoPNg1Z607673D/SaaS-Demo-Mode?node-id=192-1078&t=6Ij371yb25YW5gvs-4');
const figmaFileKey = ref('ZYdtCFf5KoPNg1Z607673D');
const figmaNodeId = ref('192-1078');
const figmaImageUrl = ref('');
const skillContent = ref('');
const currentStep = ref(0);
const loading = ref(false);

// 从 Figma 获取图片 URL
const getFigmaImageUrl = () => {
  // 使用 Figma 的图片导出 API（需要 token，这里使用占位符）
  // 实际使用时需要通过后端代理或配置 Figma token
  return `https://www.figma.com/file/${figmaFileKey.value}/SaaS-Demo-Mode?node-id=${figmaNodeId.value}`;
};

// 读取 SKILL.md 文件
const loadSkillContent = async () => {
  try {
    // 尝试从相对路径读取（需要配置 Vite 的静态资源处理）
    const response = await fetch('/.agents/skills/design-to-code/SKILL.md');
    if (response.ok) {
      skillContent.value = await response.text();
    } else {
      // 如果无法读取文件，使用完整内容
      skillContent.value = `---
name: design-to-code
description: Pixel-perfect Figma to React conversion using coderio. Generates production-ready code (TypeScript, Vite, TailwindCSS V4) with high visual fidelity.
---

# Design to Code

High-fidelity UI restoration from Figma designs to production-ready React + TypeScript components.
This SKILL uses a **robust helper script** to minimize manual errors and ensure pixel-perfect results.

## Prerequisites

1. **Figma API Token**: Get from Figma → Settings → Personal Access Tokens
2. **Node.js**: Version 18+
3. **coderio**: Installed in \`scripts/\` folder (handled by Setup phase)

## Workflow Overview

\`\`\`
Phase 0: SETUP    → Create helper script and script environment
Phase 1: PROTOCOL → Generate design protocol (Structure & Props)
Phase 2: CODE     → Generate components and assets
\`\`\`

# Phase 0: Setup

## Step 0.1: Initialize Helper Script

**User Action**: Run these commands to create the execution helper and isolate its dependencies.

\`\`\`bash
mkdir -p scripts
cp skills/design-to-code/scripts/package.json scripts/package.json
cp skills/design-to-code/scripts/coderio-skill.mjs scripts/coderio-skill.mjs
cd scripts && pnpm install && cd ..
\`\`\`

# Phase 1: Protocol Generation

## Step 1.1: Fetch Data

\`\`\`bash
node scripts/coderio-skill.mjs fetch-figma "https://figma.com/file/..." "figd_..."
\`\`\`

## Step 1.2: Generate Structure

1. Generate Prompt: \`node scripts/coderio-skill.mjs structure-prompt > scripts/structure-prompt.md\`
2. AI Task: Generate component structure JSON
3. Process Result: \`node scripts/coderio-skill.mjs save-structure\`

## Step 1.3: Extract Props (Iterative)

For each component, extract props using the helper script.

# Phase 2: Code Generation

## Step 2.1: Plan Tasks

\`\`\`bash
node scripts/coderio-skill.mjs list-gen-tasks
\`\`\`

## Step 2.2: Generate Components (Iterative)

For each task index:
1. Generate Prompt: \`node scripts/coderio-skill.mjs code-prompt 0 > scripts/code-prompt.md\`
2. AI Task: Generate React component code
3. Save Code: \`node scripts/coderio-skill.mjs save-code 0\`

## Step 2.3: Final Integration

Inject the root component into \`App.tsx\`.

---

详细文档请查看：.agents/skills/design-to-code/SKILL.md`;
    }
  } catch (error) {
    console.error('Failed to load SKILL.md:', error);
    ElMessage.warning('无法加载 SKILL.md 文件，请手动查看文档');
  }
};

onMounted(() => {
  figmaImageUrl.value = getFigmaImageUrl();
  loadSkillContent();
});

const handleStartConversion = () => {
  loading.value = true;
  ElMessage.info('设计转换功能需要配置 coderio 工具，请参考 SKILL.md 文档执行');
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const handleViewFigma = () => {
  window.open(figmaUrl.value, '_blank');
};

const handleViewSkill = () => {
  // 尝试打开 SKILL.md 文件
  const skillPath = '.agents/skills/design-to-code/SKILL.md';
  ElMessage.info(`SKILL.md 文件路径：${skillPath}`);
  // 在实际项目中，可以通过文件系统 API 或后端接口打开文件
};
</script>

<style scoped>
.design-converter {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.skill-content {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 16px;
}

.skill-text {
  margin: 0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.figma-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  background-color: #f9fafb;
  border-radius: 4px;
  padding: 20px;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  padding: 40px;
}

.image-error .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.step-description {
  margin-top: 8px;
}

.step-description p {
  margin: 4px 0;
  font-size: 13px;
  color: #606266;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.el-step__title) {
  font-size: 16px;
  font-weight: 600;
}

:deep(.el-step__description) {
  margin-top: 8px;
  font-size: 14px;
}
</style>
