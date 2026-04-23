<script setup lang="ts">
import { withBase } from 'vitepress'

interface NavItem {
  title: string
  link: string
  description?: string
}

interface Props {
  next?: NavItem
  lab?: NavItem
}

defineProps<Props>()
</script>

<template>
  <div class="chapter-navigation">
    <div v-if="next" class="nav-card next-chapter">
      <div class="card-label">下一章：深度探索</div>
      <a :href="withBase(next.link)" class="card-link">
        <div class="card-content">
          <h4 class="card-title">{{ next.title }}</h4>
          <p v-if="next.description" class="card-desc">{{ next.description }}</p>
        </div>
        <div class="card-arrow">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </a>
    </div>

    <div v-if="lab" class="nav-card related-lab">
      <div class="card-label">即席实验：可视化辅助</div>
      <a :href="withBase(lab.link)" class="card-link">
        <div class="card-content">
          <h4 class="card-title">{{ lab.title }}</h4>
          <p v-if="lab.description" class="card-desc">{{ lab.description }}</p>
        </div>
        <div class="card-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.chapter-navigation {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 60px 0;
  padding-top: 40px;
  border-top: 1px solid var(--vp-c-divider);
}

.nav-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--mn-text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(0, 0, 0, 0.04);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark .card-link {
  border-color: rgba(255, 255, 255, 0.04);
  background: rgba(15, 23, 42, 0.3);
}

.card-link:hover {
  transform: translateY(-2px);
  border-color: var(--mn-primary);
  background: var(--mn-primary-soft);
}

.card-title {
  font-family: var(--vp-font-family-noble);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 4px;
  color: var(--mn-text);
  font-style: italic;
}

.card-desc {
  font-size: 0.9rem;
  color: var(--mn-text-soft);
  margin: 0;
}

.card-arrow, .card-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mn-primary);
  opacity: 0.6;
  transition: transform 0.3s ease;
}

.card-link:hover .card-arrow {
  transform: translateX(4px);
  opacity: 1;
}

.card-link:hover .card-icon {
  transform: scale(1.1);
  opacity: 1;
}

svg {
  width: 24px;
  height: 24px;
}

@media (max-width: 640px) {
  .card-link { padding: 20px; }
  .card-title { font-size: 1.1rem; }
}
</style>
