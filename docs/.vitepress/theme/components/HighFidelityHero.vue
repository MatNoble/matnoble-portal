<script setup lang="ts">
import { withBase } from 'vitepress'

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

defineProps<Props>()
</script>

<template>
  <section class="hf-hero">
    <div class="hf-hero-container">
      <div class="hf-hero-content">
        <h1 class="hf-hero-name">
          <span class="clip">{{ name }}</span>
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
    
    <!-- Decorative Math Layer -->
    <div class="math-decoration" aria-hidden="true">
      <div class="math-item symbol-1">∫</div>
      <div class="math-item symbol-2">∑</div>
      <div class="math-item symbol-3">∂</div>
      <div class="math-item symbol-4">∇</div>
      <div class="math-item symbol-5">∞</div>
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
}

.hf-hero-container {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.hf-hero-name {
  font-family: var(--vp-font-family-heading);
  font-size: clamp(2.4rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.clip {
  background: linear-gradient(135deg, var(--mn-text) 30%, var(--mn-primary) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hf-hero-text {
  font-family: var(--vp-font-family-heading);
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  font-weight: 700;
  color: var(--mn-text);
  line-height: 1.1;
  margin-bottom: 24px;
}

.hf-hero-tagline {
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: var(--mn-text-soft);
  max-width: 600px;
  margin: 0 auto 48px;
  line-height: 1.6;
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
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
}

.hf-button.brand {
  background-color: var(--mn-accent);
  color: white;
  box-shadow: 0 10px 20px -5px var(--mn-accent-soft);
}

.hf-button.brand:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 20px 30px -8px var(--mn-accent-soft);
  filter: brightness(1.1);
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

/* Math Decoration */
.math-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.4;
}

.math-item {
  position: absolute;
  font-family: serif;
  font-style: italic;
  font-size: 4rem;
  color: var(--mn-primary);
  filter: blur(2px);
  opacity: 0.15;
  animation: float 20s infinite linear;
}

.symbol-1 { top: 15%; left: 10%; animation-duration: 25s; }
.symbol-2 { top: 60%; left: 5%; font-size: 3rem; animation-delay: -5s; }
.symbol-3 { top: 20%; right: 12%; animation-duration: 22s; }
.symbol-4 { top: 70%; right: 8%; font-size: 3.5rem; animation-delay: -10s; }
.symbol-5 { top: 40%; left: 80%; animation-duration: 30s; }

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(20px, 40px) rotate(10deg); }
  66% { transform: translate(-20px, 20px) rotate(-10deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
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
  .math-item { font-size: 1.8rem; opacity: 0.08; }
}

@media (min-width: 641px) and (max-width: 860px) {
  .hf-hero-name { font-size: 3.5rem; }
  .hf-hero-text { font-size: 2.2rem; }
}
</style>
