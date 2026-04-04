<script setup lang="ts">
interface Logo {
  name: string
  title?: string
  icon?: string // SVG or custom text
}

interface Props {
  logos: Logo[]
}

defineProps<Props>()
</script>

<template>
  <div class="trust-logos">
    <div v-for="logo in logos" :key="logo.name" class="logo-item" :title="logo.title || logo.name">
      <span v-if="!logo.icon" class="logo-text">{{ logo.name }}</span>
      <div v-else class="logo-icon" v-html="logo.icon"></div>
    </div>
  </div>
</template>

<style scoped>
.trust-logos {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 64px;
  width: 100%;
}

.logo-item {
  opacity: 0.45;
  filter: grayscale(1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-item:hover {
  opacity: 1;
  filter: grayscale(0);
  transform: scale(1.1);
}

.logo-text {
  font-family: var(--vp-font-family-heading);
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--mn-text-muted);
  letter-spacing: -0.05em;
  user-select: none;
}

.logo-icon {
  width: auto;
  height: 32px;
  color: var(--mn-text-muted);
}

@media (max-width: 768px) {
  .trust-logos {
    gap: 32px;
  }
}

@media (max-width: 480px) {
  .logo-text {
    font-size: 1.3rem;
  }
}
</style>
