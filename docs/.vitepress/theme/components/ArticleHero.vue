<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  tag?: string;
  points?: string[]; // Quick logic summary points
}

defineProps<Props>();
</script>

<template>
  <header class="scholarly-hero">
    <div class="hero-layout">
      <!-- Main Content -->
      <div class="hero-main">
        <div v-if="tag" class="hero-tag">
          <span class="tag-dot"></span>
          {{ tag }}
        </div>
        <h1 class="hero-title">{{ title }}</h1>
        <p v-if="description" class="hero-description">{{ description }}</p>
      </div>

      <!-- Logic Summary (Knowledge Rushing) -->
      <div v-if="points && points.length" class="hero-points">
        <div class="points-label">Core Logic</div>
        <ul class="points-list">
          <li v-for="(p, i) in points" :key="i" class="point-item">
            <span class="point-num">0{{ i + 1 }}</span>
            <span class="point-text">{{ p }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Decorative Breath -->
    <div class="hero-glow"></div>
  </header>
</template>

<style scoped>
.scholarly-hero {
  position: relative;
  padding: 80px 0;
  margin-bottom: 60px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.hero-layout {
  display: flex;
  gap: 60px;
  align-items: flex-start;
  position: relative;
  z-index: 10;
}

.hero-main {
  flex: 1;
  max-width: 700px;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--mn-accent);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 24px;
}

.tag-dot {
  width: 6px;
  height: 6px;
  background: var(--mn-accent);
  border-radius: 50%;
}

.hero-title {
  font-family: var(--vp-font-family-noble);
  font-size: 4rem;
  font-weight: 600;
  font-style: italic;
  line-height: 1.1;
  color: var(--mn-text);
  margin-bottom: 32px;
  letter-spacing: -0.02em;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--mn-text-soft);
  line-height: 1.7;
  max-width: 54ch;
}

.hero-points {
  width: 280px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.dark .hero-points {
  background: rgba(15, 23, 42, 0.3);
  border-color: rgba(255, 255, 255, 0.03);
}

.points-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: var(--mn-text-muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 20px;
}

.points-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.point-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.point-num {
  font-family: var(--vp-font-family-heading);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--mn-accent);
  opacity: 0.5;
  padding-top: 2px;
}

.point-text {
  font-size: 0.95rem;
  color: var(--mn-text-soft);
  line-height: 1.4;
}

.hero-glow {
  position: absolute;
  top: -200px;
  right: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--mn-accent-soft) 0%, transparent 70%);
  z-index: 0;
  opacity: 0.6;
}

@media (max-width: 1024px) {
  .hero-layout { flex-direction: column; gap: 40px; }
  .hero-points { width: 100%; }
  .hero-title { font-size: 3rem; }
}
</style>
