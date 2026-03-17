<template>
  <div class="scroll-telling-container">
    <div class="scrolly-text">
      <div 
        v-for="(section, index) in sections" 
        :key="index"
        :class="['step-box', { active: activeIndex === index }]"
        :data-index="index"
        ref="stepElements"
      >
        <slot :name="'step-' + index"></slot>
      </div>
    </div>
    <div class="scrolly-visual">
      <div class="sticky-container">
        <transition name="fade" mode="out-in">
          <img :src="currentImage" :key="currentImage" alt="Visual" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    required: true
  }
});

const sections = computed(() => props.images.map((_, i) => i));
const activeIndex = ref(0);
const currentImage = computed(() => props.images[activeIndex.value]);
const stepElements = ref([]);

let observer = null;

onMounted(() => {
  const options = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = parseInt(entry.target.dataset.index, 10);
        activeIndex.value = idx;
      }
    });
  }, options);

  // Vue 3 template refs array handling
  stepElements.value.forEach(el => observer.observe(el));
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.scroll-telling-container {
  display: flex;
  gap: 3rem; /* 增大间距 */
  margin: 3rem 0;
  position: relative;
  align-items: flex-start;
  width: 100%; /* 强制满宽 */
}

.scrolly-text {
  flex: 1; /* 文字占 1 份 */
  padding-bottom: 50vh;
  z-index: 2; /* 确保文字在顶层 */
}

.step-box {
  min-height: 60vh; /* 增加触发区域高度，让滚动更从容 */
  margin-bottom: 3rem;
  padding: 2rem;
  border-left: 4px solid var(--vp-c-divider);
  transition: all 0.4s ease;
  opacity: 0.3; /* 非激活状态更暗，突出焦点 */
  transform: translateX(-10px); /* 增加一点微动效 */
}

.step-box.active {
  border-left-color: var(--vp-c-brand);
  opacity: 1;
  background: var(--vp-c-bg-soft);
  transform: translateX(0);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); /* 添加轻微阴影突出浮层感 */
  border-radius: 0 8px 8px 0;
}

.scrolly-visual {
  flex: 1.2; /* 图片区域占 1.2 份，给视觉留足空间 */
  position: sticky;
  top: 120px; /* 避开顶部导航栏 */
  height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sticky-container {
  width: 100%;
  height: 100%;
  border-radius: 16px; /* 更圆润的边角 */
  overflow: hidden;
  background: var(--vp-c-bg-alt); /* 适配主题的背景色，而非死黑 */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15); /* 加深立体阴影 */
  border: 1px solid var(--vp-c-divider); /* 增加微妙的边框界定 */
}

.sticky-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease; /* 图片出现时的微动效 */
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: scale(1.05) translateY(-10px);
}

@media (max-width: 768px) {
  .scroll-telling-container {
    flex-direction: column;
    gap: 1rem;
  }
  .scrolly-visual {
    position: sticky;
    top: 60px;
    height: 45vh;
    z-index: 10;
    background: var(--vp-c-bg);
    padding-bottom: 1rem;
    width: 100%;
  }
  .scrolly-text {
    width: 100%;
  }
  .step-box {
    min-height: auto;
    padding: 1rem;
  }
}
</style>
