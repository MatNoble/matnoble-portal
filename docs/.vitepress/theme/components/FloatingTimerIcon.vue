<script setup>
import { useRouter, useData } from 'vitepress'
import { computed } from 'vue'

const { page } = useData()
const router = useRouter()

// 在计时器页面本身不显示悬浮图标
const isTimerPage = computed(() => {
  return page.value.relativePath === 'tools/countdown.md' || page.value.relativePath === 'tools/countdown'
})

const goToTimer = () => {
  router.go('/tools/countdown')
}
</script>

<template>
  <Transition name="fade">
    <div 
      v-if="!isTimerPage" 
      class="floating-timer-trigger"
      @click="goToTimer"
      title="进入沉浸式计时器"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    </div>
  </Transition>
</template>

<style scoped>
.floating-timer-trigger {
  position: fixed;
  bottom: 100px; /* 避开回到顶部按钮 */
  right: 24px;
  width: 44px;
  height: 44px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 99;
  color: var(--vp-c-text-2);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  backdrop-filter: blur(8px);
}

.floating-timer-trigger:hover {
  transform: translateY(-6px) rotate(5deg) scale(1.1);
  background: var(--vp-c-brand);
  color: #fff;
  border-color: var(--vp-c-brand);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.floating-timer-trigger svg {
  width: 22px;
  height: 22px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .floating-timer-trigger {
    bottom: 80px;
    right: 16px;
    width: 40px;
    height: 40px;
  }
}
</style>
