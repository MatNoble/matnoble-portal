<script setup lang="ts">
interface MatrixItem {
  title: string
  desc: string
  link: string
  domain: string
  icon: string
  badge: string
  isExternal?: boolean
  isPrimary?: boolean
}

const matrixList: MatrixItem[] = [
  {
    title: '教学中心',
    desc: '《离散数学》《高等数学》《线性代数》等本科课程章节课件下载、3D 空间解析几何实验室与在线教学工具。',
    link: 'https://teach.matnoble.top/',
    domain: 'teach.matnoble.top',
    icon: '🎓',
    badge: '核心子站',
    isExternal: true,
    isPrimary: true
  },
  {
    title: '开源项目',
    desc: 'MatNoble-TTS 语音合成工作流、华中科技大学矢量视觉标志等实用工具与开放源码项目。',
    link: '/projects/',
    domain: 'matnoble.top/projects',
    icon: '💻',
    badge: '工程成果'
  },
  {
    title: '技术博客',
    desc: '偏微分方程数值计算、现代前端架构与算法思维的深度探索手记。',
    link: 'https://blog.matnoble.top',
    domain: 'blog.matnoble.top',
    icon: '✍️',
    badge: '知识手记',
    isExternal: true
  },
  {
    title: '光影定格',
    desc: '镜头下的城市光影、校园四季与自然风光的高清摄影作品精选。',
    link: 'https://album.matnoble.top/',
    domain: 'album.matnoble.top',
    icon: '📷',
    badge: '视觉纪实',
    isExternal: true
  }
]
</script>

<template>
  <div class="matrix-grid">
    <a
      v-for="item in matrixList"
      :key="item.title"
      :href="item.link"
      :class="['matrix-card', { 'primary-card': item.isPrimary }]"
      :target="item.isExternal ? '_blank' : '_self'"
      :rel="item.isExternal ? 'noopener noreferrer' : ''"
    >
      <div :class="['matrix-badge', item.isPrimary ? 'primary-badge' : 'neutral-badge']">
        {{ item.badge }}
      </div>
      <div class="matrix-icon">{{ item.icon }}</div>
      <div class="matrix-title">
        {{ item.title }}
        <span v-if="item.isExternal" class="matrix-arrow">↗</span>
      </div>
      <div class="matrix-desc">{{ item.desc }}</div>
      <div class="matrix-domain">{{ item.domain }}</div>
    </a>
  </div>
</template>

<style scoped>
.matrix-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  width: 100%;
  margin-bottom: 1rem;
}

.matrix-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.2, 0, 0, 1);
  position: relative;
}

.matrix-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.matrix-card.primary-card {
  border-color: rgba(77, 132, 196, 0.35);
  background: linear-gradient(to bottom, var(--vp-c-bg-soft), rgba(77, 132, 196, 0.04));
}

.matrix-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.18rem 0.5rem;
  border-radius: 6px;
  letter-spacing: 0.02em;
}

.matrix-badge.primary-badge {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border: 1px solid rgba(77, 132, 196, 0.2);
}

.matrix-badge.neutral-badge {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.matrix-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.matrix-title {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.matrix-arrow {
  font-size: 0.95rem;
  color: var(--vp-c-brand-1);
}

.matrix-desc {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 1.25rem;
  flex-grow: 1;
}

.matrix-domain {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
}

@media (max-width: 768px) {
  .matrix-grid {
    grid-template-columns: 1fr;
  }
}
</style>
