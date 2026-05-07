<script setup lang="ts">
defineProps<{
  author?: string
}>()
</script>

<template>
  <div class="three-one-quote">
    <div class="quote-icon">“</div>
    <blockquote class="quote-content">
      <slot />
    </blockquote>
    <div v-if="author" class="quote-author">
      {{ author }}
    </div>
  </div>
</template>

<style scoped>
.three-one-quote {
  position: relative;
  margin: var(--space-2xl) auto;
  max-width: 800px;
  padding: var(--space-xl);
  text-align: center;
  border-radius: var(--radius-lg);
  background: var(--mn-primary-soft);
  border: 1px solid var(--mn-primary-ring);
}

.quote-icon {
  font-family: var(--mn-font-serif);
  font-size: 5rem;
  line-height: 1;
  color: var(--mn-primary);
  opacity: 0.2;
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.quote-content {
  font-family: var(--mn-font-serif);
  font-size: 1.5rem;
  line-height: 1.6;
  color: var(--mn-text);
  margin: 0;
  font-style: italic;
}

.quote-author {
  margin-top: var(--space-md);
  font-family: var(--vp-font-family-base);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--mn-primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.dark .three-one-quote {
  background: rgba(56, 189, 248, 0.05);
}

@media (max-width: 640px) {
  .quote-content {
    font-size: 1.25rem;
  }
}
</style>
