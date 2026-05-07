<template>
  <div class="comparison-grid">
    <slot />
  </div>
</template>

<style scoped>
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 480px));
  justify-content: center;
  gap: 4rem;
  margin: 5rem auto;
  width: 100%;
  max-width: 1000px;
}

:deep(.comparison-item) {
  text-align: center;
}

:deep(.comparison-item h3),
:deep(.comparison-item h4) {
  margin-top: 0 !important;
  margin-bottom: 2rem !important;
  color: var(--mn-primary);
  font-size: 1.15rem;
  font-family: var(--mn-font-heading);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: none;
  
  /* Pill Style Decorator */
  background: var(--mn-primary-soft);
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: auto; /* Remove fixed height for pills */
}

:deep(.comparison-item p) {
  font-size: 1.05rem;
  line-height: 1.8;
  opacity: 0.95;
  margin-bottom: 2rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 45ch; /* Increased for better Chinese reading flow */
}

:deep(.manim-video-container) {
  margin-top: 2rem;
}
</style>
