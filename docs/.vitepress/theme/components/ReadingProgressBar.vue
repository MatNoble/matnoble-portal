<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import { useData, useRoute } from "vitepress";

const { frontmatter } = useData();
const route = useRoute();
const progress = ref(0);

// 首页不显示进度条
const isHidden = computed(() => frontmatter.value.layout === 'home');

const updateProgress = () => {
  if (isHidden.value) {
    progress.value = 0;
    return;
  }
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  if (scrollHeight > 0) {
    progress.value = (scrollTop / scrollHeight) * 100;
  } else {
    progress.value = 0;
  }
};

onMounted(() => {
  window.addEventListener("scroll", updateProgress);
  updateProgress();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateProgress);
});

// 监听路由变化，立即重置进度，防止在翻页（页面切换）时显示旧进度
watch(
  () => route.path,
  () => {
    progress.value = 0;
    setTimeout(updateProgress, 100);
  }
);
</script>

<template>
  <div v-if="!isHidden" class="reading-progress-container">
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
  transition: top 0.3s;
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
