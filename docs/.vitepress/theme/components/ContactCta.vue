<script setup lang="ts">
import { withBase } from 'vitepress'

interface Action {
  theme?: 'primary' | 'secondary'
  text: string
  link: string
  external?: boolean
}

interface Props {
  title: string
  details: string
  actions: Action[]
}

defineProps<Props>()
</script>

<template>
  <div class="cta-card">
    <h2 class="cta-title">{{ title }}</h2>
    <p class="cta-details">{{ details }}</p>
    <div class="cta-actions">
      <template v-for="action in actions" :key="action.link">
        <a 
          v-if="action.external || action.link.startsWith('http')"
          :href="action.link"
          target="_blank"
          rel="noopener noreferrer"
          :class="['btn', action.theme === 'primary' ? 'btn-primary' : 'btn-secondary']"
        >
          {{ action.text }}
        </a>
        <a 
          v-else
          :href="withBase(action.link)"
          :class="['btn', action.theme === 'primary' ? 'btn-primary' : 'btn-secondary']"
        >
          {{ action.text }}
        </a>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cta-card {
  background: var(--mn-primary-soft);
  border: 1px solid var(--mn-primary-ring);
  backdrop-filter: blur(24px);
  padding: 80px 48px;
  border-radius: 28px;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
  transition: all 0.5s cubic-bezier(0.2, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--mn-primary), transparent);
  opacity: 0.3;
}

.cta-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 40px 80px -20px var(--mn-primary-ring);
  border-color: var(--mn-primary);
}

.cta-title {
  color: var(--mn-primary);
  border-bottom: none;
  font-size: clamp(1.8rem, 5vw, 2.8rem);
  margin: 0 0 20px;
  font-weight: 800;
  line-height: 1.2;
}

.cta-details {
  color: var(--mn-text-soft);
  font-size: 1.25rem;
  margin-bottom: 40px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 40px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.btn-primary {
  background: var(--mn-accent);
  color: #fff !important;
  box-shadow: 0 8px 16px -4px var(--mn-accent-ring);
}

.btn-primary:hover {
  background: #ea580c;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -6px var(--mn-accent-ring);
}

.btn-secondary {
  border: 2px solid var(--mn-primary);
  color: var(--mn-primary) !important;
  background: transparent;
}

.btn-secondary:hover {
  background: var(--mn-primary-soft);
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .cta-card { padding: 48px 24px; border-radius: 20px; }
  .cta-actions { flex-direction: column; width: 100%; }
  .btn { width: 100%; }
}
</style>
