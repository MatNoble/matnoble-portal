<script setup lang="ts">
import { withBase } from 'vitepress'

interface Feature {
  title: string
  details: string
  link?: string
  linkText?: string
  icon?: string // SVG path or simplified identifier
}

interface Props {
  features: Feature[]
}

defineProps<Props>()

// Default scholarly icons if none provided
const defaultIcons: Record<string, string> = {
  teaching: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
  tools: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z"/>',
  about: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
}
</script>

<template>
  <section class="hf-features">
    <div class="hf-features-grid">
      <div v-for="(feature, index) in features" :key="index" class="hf-feature-card">
        <div class="hf-feature-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <g v-if="feature.icon" v-html="feature.icon"></g>
            <g v-else v-html="defaultIcons.teaching"></g>
          </svg>
        </div>
        <h2 class="hf-feature-title" v-html="feature.title"></h2>
        <p class="hf-feature-details" v-html="feature.details"></p>
        
        <div v-if="feature.link" class="hf-feature-action">
          <a :href="withBase(feature.link)" class="hf-feature-link">
            {{ feature.linkText || '了解更多' }}
            <svg class="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hf-features {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px;
}

.hf-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.hf-feature-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
}

.dark .hf-feature-card {
  background: rgba(15, 23, 42, 0.4);
}

.hf-feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--mn-primary);
  box-shadow: var(--shadow-xl);
}

.hf-feature-icon {
  width: 52px;
  height: 52px;
  background: var(--mn-primary-soft);
  color: var(--mn-primary);
  border: 1px solid rgba(37, 99, 235, 0.1); /* Super fine border for biotech feel */
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  padding: 12px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation-duration: 6s; /* Slower for graceful gliding */
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

/* Sideways gliding animations to utilize empty horizontal space */
.hf-feature-card:nth-child(1) .hf-feature-icon {
  animation-name: glide-1;
}
.hf-feature-card:nth-child(2) .hf-feature-icon {
  animation-name: glide-2;
  animation-delay: -1.5s;
}
.hf-feature-card:nth-child(3) .hf-feature-icon {
  animation-name: glide-3;
  animation-delay: -3s;
}

@keyframes glide-1 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(12px, -4px); }
}

@keyframes glide-2 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(15px, 2px); }
}

@keyframes glide-3 {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(10px, -6px); }
}

.dark .hf-feature-icon {
  background: rgba(37, 99, 235, 0.08); /* Lower saturation */
  border-color: rgba(37, 99, 235, 0.15);
  color: #60A5FA;
}

.hf-feature-card:hover .hf-feature-icon {
  transform: translateY(-2px) scale(1.05);
  background: var(--mn-primary-soft); /* De-saturated hover */
  border-color: var(--mn-primary);
  box-shadow: 0 0 15px var(--mn-primary-soft);
}

.hf-feature-icon svg {
  width: 24px;
  height: 24px;
}

.hf-feature-title {
  font-family: var(--vp-font-family-heading);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 16px;
  color: var(--mn-text);
}

.hf-feature-details {
  font-size: 1.1rem;
  color: var(--mn-text-soft);
  line-height: 1.6;
  margin-bottom: 24px;
  flex-grow: 1;
}

.hf-feature-action {
  margin-top: auto;
}

.hf-feature-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--mn-primary);
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  transition: gap 0.2s;
}

.hf-feature-link:hover {
  gap: 12px;
}

.arrow {
  width: 18px;
  height: 18px;
}

@media (prefers-reduced-motion: reduce) {
  .hf-feature-card:hover { transform: none; box-shadow: none; }
}

@media (max-width: 640px) {
  .hf-features { padding: 0 16px; }
  .hf-feature-card { padding: 24px; border-radius: 16px; }
  .hf-feature-icon { width: 44px; height: 44px; padding: 10px; margin-bottom: 16px; }
  .hf-feature-icon svg { width: 20px; height: 20px; }
  .hf-feature-title { font-size: 1.25rem; }
  .hf-feature-details { font-size: 0.95rem; margin-bottom: 20px; }
}
</style>
