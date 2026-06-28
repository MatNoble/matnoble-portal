<template>
  <div v-if="isCoursePage" class="immersive-toggle-wrapper">
    <button @click="toggleMode" class="toggle-btn" :class="{ active: isActive }" :title="isActive ? '退出沉浸模式 (Esc)' : '进入沉浸模式'">
      <span v-if="!isActive">🔍 沉浸讲课</span>
      <span v-else>❌ 退出沉浸</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRoute } from 'vitepress';

const isActive = ref(false);
const route = useRoute();

const isCoursePage = computed(() => route.path.includes('/courses/'));

const toggleMode = () => {
  isActive.value = !isActive.value;
  if (isActive.value) {
    document.body.classList.add('immersive-mode');
  } else {
    document.body.classList.remove('immersive-mode');
  }
};

const handleKeydown = (e) => {
  if (e.key === 'Escape' && isActive.value) {
    toggleMode();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.classList.remove('immersive-mode');
});

watch(() => route.path, () => {
  if (isActive.value) {
    toggleMode();
  }
});
</script>

<style scoped>
.immersive-toggle-wrapper {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99999;
}

.toggle-btn {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 24px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 600;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 6px;
}

.toggle-btn:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--mn-primary);
  color: var(--mn-primary);
}

.toggle-btn.active {
  background: var(--vp-c-brand);
  color: white;
  border-color: var(--vp-c-brand);
}

.toggle-btn.active:hover {
  color: white;
  background: var(--mn-secondary);
  border-color: var(--mn-secondary);
}
</style>
