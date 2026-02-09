<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { data as posts } from '../../posts.data'

const { page, frontmatter } = useData()

const relatedPosts = computed(() => {
  const currentUrl = page.value.relativePath
  const currentDir = currentUrl.split('/')[0]
  const currentTags = frontmatter.value.tags || []

  return posts
    .filter(post => {
      // 排除当前页面
      if (post.url === '/' || post.url.includes(currentUrl.replace('.md', ''))) {
        return false
      }
      
      // 排除 index.md 和 404.md
      if (post.url.endsWith('/') || post.url.includes('404')) {
        return false
      }

      const postDir = post.url.split('/')[1] // post.url starts with /
      const postTags = post.frontmatter.tags || []

      // 逻辑：相同标签优先，其次是相同目录
      const hasCommonTag = currentTags.some((tag: string) => postTags.includes(tag))
      const isSameDir = currentDir !== '' && postDir === currentDir

      return hasCommonTag || isSameDir
    })
    .sort((a, b) => {
      // 排序：优先显示相同标签的
      const aTags = a.frontmatter.tags || []
      const bTags = b.frontmatter.tags || []
      const aCommon = currentTags.filter((t: string) => aTags.includes(t)).length
      const bCommon = currentTags.filter((t: string) => bTags.includes(t)).length
      
      if (aCommon !== bCommon) return bCommon - aCommon
      
      // 其次按日期排序
      const dateA = new Date(a.frontmatter.date || 0)
      const dateB = new Date(b.frontmatter.date || 0)
      return +dateB - +dateA
    })
    .slice(0, 3) // 只取前 3 篇
})
</script>

<template>
  <div v-if="relatedPosts.length > 0" class="related-posts">
    <h3 class="title">相关文章推荐</h3>
    <div class="grid">
      <a v-for="post in relatedPosts" :key="post.url" :href="withBase(post.url)" class="card">
        <div class="card-content">
          <span class="category">{{ post.url.split('/')[1].toUpperCase() }}</span>
          <h4 class="post-title">{{ post.frontmatter.title || '无题' }}</h4>
          <p class="description">{{ post.frontmatter.description }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.related-posts {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--vp-c-divider);
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 1.25rem;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
  text-decoration: none !important;
}

.card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-4px);
  background-color: var(--vp-c-bg-mute);
}

.category {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  display: block;
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.5rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.description {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
