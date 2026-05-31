<script setup lang="ts">
import { withBase, useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()

const isCoursePage = computed(() => {
  return page.value.relativePath.startsWith('courses/')
})

const backUrl = computed(() => {
  if (isCoursePage.value) return '/courses/'
  
  const path = page.value.relativePath
  const anchor = '#knowledge-graph'
  // 根据路径自动匹配图谱节点并加上锚点
  if (path.includes('linear-algebra/')) return `/?node=algebra${anchor}`
  if (path.includes('calculus/')) return `/?node=calculus${anchor}`
  if (path.includes('tools/')) return `/?node=tools${anchor}`
  return `/${anchor}`
})

const labelText = computed(() => {
  return isCoursePage.value ? '返回课程中心' : '返回知识图谱'
})
</script>

<template>
  <div class="back-to-graph-wrapper">
    <a :href="withBase(backUrl)" class="back-link">
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2.5" fill="none">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>{{ labelText }}</span>
    </a>
  </div>
</template>

<style scoped>
.back-to-graph-wrapper {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--mn-primary-soft);
  color: var(--mn-primary) !important;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s ease;
  border: 1px solid rgba(var(--mn-primary-rgb), 0.1);
}

.back-link:hover {
  background: var(--mn-primary);
  color: white !important;
  transform: translateX(-4px);
  box-shadow: 0 4px 12px rgba(var(--mn-primary-rgb), 0.2);
}

.back-link svg {
  transition: transform 0.2s ease;
}

@media (max-width: 768px) {
  .back-to-graph-wrapper {
    margin-bottom: 1.5rem;
  }
}
</style>
