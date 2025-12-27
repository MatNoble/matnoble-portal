<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
  tag?: string;
}

defineProps<Props>();
</script>

<template>
  <header class="article-hero">
    <div class="hero-content">
      <div v-if="tag" class="hero-tag">{{ tag }}</div>
      <h1 class="hero-title">{{ title }}</h1>
      <p v-if="description" class="hero-description">{{ description }}</p>
    </div>

    <div class="hero-bg-accent"></div>
  </header>
</template>

<style scoped>
.article-hero {
  position: relative;
  padding: 4rem 2rem;
  margin: 2rem 0 4rem 0;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.dark .article-hero {
  background: rgba(30, 30, 30, 0.5);
  border-color: rgba(255, 255, 255, 0.05);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
}

.hero-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--mn-blue);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-family: var(--vp-font-family-base);
  background: linear-gradient(135deg, var(--vp-c-text-1), var(--mn-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: 1.25rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.hero-bg-accent {
  position: absolute;
  top: -50%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(77, 132, 196, 0.1) 0%,
    transparent 70%
  );
  z-index: 0;
  pointer-events: none;
}

@media (max-width: 768px) {
  .article-hero {
    padding: 3rem 1.5rem;
    margin: 1rem 0 3rem 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-description {
    font-size: 1.1rem;
  }
}
</style>
