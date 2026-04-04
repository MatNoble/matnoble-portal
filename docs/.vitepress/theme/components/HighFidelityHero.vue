<script setup lang="ts">
import { withBase } from 'vitepress'
import { computed } from 'vue'

interface Action {
  theme?: 'brand' | 'alt'
  text: string
  link: string
}

interface Props {
  name: string
  text: string
  tagline: string
  actions: Action[]
}

const props = defineProps<Props>()

const splitName = computed(() => {
  // Logic to separate "Mat" and "Noble" for brand expression
  if (props.name.toLowerCase() === 'matnoble') {
    return { first: 'Mat', second: 'Noble' }
  }
  return { first: props.name, second: '' }
})
</script>

<template>
  <section class="hf-hero" aria-label="Hero section">
    <!-- Semantic Matrix Background -->
    <div class="hero-matrix-bg matrix-grid-pattern" aria-hidden="true"></div>
    
    <div class="hf-hero-container">
      <div class="hf-hero-content">
        <h1 class="hf-hero-name">
          <span class="name-mat">{{ splitName.first }}</span>
          <span v-if="splitName.second" class="name-noble">{{ splitName.second }}</span>
        </h1>
        <p class="hf-hero-text">{{ text }}</p>
        <p class="hf-hero-tagline">{{ tagline }}</p>

        <div class="hf-hero-actions">
          <div v-for="action in actions" :key="action.link" class="action-item">
            <a
              :class="['hf-button', action.theme || 'alt']"
              :href="action.link.startsWith('http') ? action.link : withBase(action.link)"
            >
              {{ action.text }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hf-hero {
  position: relative;
  padding: 120px 24px 80px;
  text-align: center;
  overflow: hidden;
  background: radial-gradient(circle at 50% -20%, var(--mn-primary-soft) 0%, transparent 70%);
  background-color: var(--mn-bg);
}

.hf-hero-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.hf-hero-name {
  font-size: clamp(2.8rem, 10vw, 6rem);
  font-weight: 800;
  line-height: 1;
  margin-bottom: 24px;
  letter-spacing: -0.03em;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 2px;
}

.name-mat {
  font-family: var(--vp-font-family-heading);
  color: var(--mn-text);
  position: relative;
  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

/* "Mat" decoded effect on hover */
.hf-hero-name:hover .name-mat {
  color: var(--mn-primary);
  letter-spacing: 0.05em;
  text-shadow: 0 0 20px var(--mn-primary-ring);
}

.name-noble {
  font-family: var(--mn-font-noble);
  color: var(--mn-accent);
  font-weight: 500;
  font-style: italic;
  font-size: 1.05em;
  margin-left: -0.05em;
  transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}

.hf-hero-name:hover .name-noble {
  transform: translateY(-8px) rotate(-2deg);
  text-shadow: 0 10px 25px var(--mn-accent-soft);
}

.hero-matrix-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.4;
  mask-image: radial-gradient(circle at 50% 30%, black, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at 50% 30%, black, transparent 80%);
  pointer-events: none;
  z-index: 1;
}

.dark .hero-matrix-bg {
  opacity: 0.25;
}

.hf-hero-text {
  font-family: var(--vp-font-family-heading);
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  font-weight: 600;
  color: var(--mn-primary);
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.hf-hero-tagline {
  font-family: var(--vp-font-family-base);
  font-size: clamp(1rem, 3vw, 1.25rem);
  color: var(--mn-text-soft);
  max-width: 600px;
  margin: 0 auto 48px;
  line-height: 1.6;
  font-weight: 400;
}

.hf-hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.hf-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  min-height: 48px;
  font-size: 1.05rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.25s cubic-bezier(0.2, 1, 0.3, 1);
  white-space: nowrap;
  outline: none;
}

.hf-button:focus-visible {
  box-shadow: 0 0 0 4px var(--mn-accent-ring);
  transform: translateY(-2px);
}

.hf-button.brand {
  background-color: var(--mn-accent);
  color: white;
  box-shadow: var(--shadow-md);
}

.hf-button.brand:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
  box-shadow: var(--shadow-lg);
}

.hf-button.alt {
  background-color: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
  border: 1.5px solid var(--mn-primary);
  color: var(--mn-primary);
}

.hf-button.alt:hover {
  background-color: var(--mn-primary-soft);
  transform: translateY(-3px);
}

@keyframes float {
  0% { transform: translateY(0); }
  100% { transform: translateY(0); }
}

/* Reduced motion — disable floating animation */
@media (prefers-reduced-motion: reduce) {
  .math-item { animation: none !important; }
  .hf-button { transition: none !important; }
}

/* 640px: Mobile & Small Tablets — full-width vertical buttons */
@media (max-width: 640px) {
  .hf-hero { padding: 64px 16px 48px; }
  .hf-hero-actions {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
  }
  .action-item {
    width: 100% !important;
  }
  .hf-button {
    width: 100% !important;
    font-size: 1rem !important;
    padding: 12px 24px !important;
    min-height: 52px !important; /* Larger touch target for mobile */
  }
}

@media (min-width: 641px) and (max-width: 860px) {
  .hf-hero-name { font-size: 3.5rem; }
  .hf-hero-text { font-size: 2.2rem; }
}
</style>
