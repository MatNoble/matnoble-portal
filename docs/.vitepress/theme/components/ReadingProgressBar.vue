<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const progress = ref(0);

const updateProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  if (scrollHeight > 0) {
    progress.value = (scrollTop / scrollHeight) * 100;
  }
};

onMounted(() => {
  window.addEventListener("scroll", updateProgress);
  updateProgress();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateProgress);
});
</script>

<template>
  <div class="reading-progress-container">
    <div class="reading-progress-bar" :style="{ width: progress + '%' }"></div>
  </div>
</template>

<style scoped>
.reading-progress-container {
  position: fixed;
  top: var(--vp-nav-height);
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 100;
  pointer-events: none;
  background: transparent;
}

.reading-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--mn-blue), var(--mn-green));
  box-shadow: 0 0 10px rgba(77, 132, 196, 0.4);
  transition: width 0.1s ease-out;
}

@media (max-width: 959px) {
  .reading-progress-container {
    top: 48px; /* Standard VitePress mobile navbar height */
    height: 2px; /* Slightly thinner on mobile */
  }
}
</style>
