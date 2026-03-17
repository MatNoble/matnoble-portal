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
  gap: 2rem;
  margin: 2rem 0;
  position: relative;
  align-items: flex-start;
}

.scrolly-text {
  flex: 1;
  padding-bottom: 50vh;
}

.step-box {
  min-height: 50vh;
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-left: 4px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  opacity: 0.5;
}

.step-box.active {
  border-left-color: var(--vp-c-brand);
  opacity: 1;
  background: var(--vp-c-bg-soft);
}

.scrolly-visual {
  flex: 1;
  position: sticky;
  top: 100px;
  height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sticky-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.sticky-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .scroll-telling-container {
    flex-direction: column;
  }
  .scrolly-visual {
    position: sticky;
    top: 60px;
    height: 40vh;
    z-index: 10;
    background: var(--vp-c-bg);
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--vp-c-divider);
  }
  .step-box {
    min-height: auto;
  }
}
</style>
