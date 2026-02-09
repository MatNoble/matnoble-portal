<script setup lang="ts">
import { onMounted, ref } from 'vue'

const deferredPrompt = ref<any>(null)
const show = ref(false)
const isIOS = ref(false)

onMounted(() => {
  if (typeof window === 'undefined') return

  // 检查是否在独立模式（已安装）
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
  const isDismissed = localStorage.getItem('pwa-install-dismissed')
  
  // 30天后允许再次提示
  const dismissTime = localStorage.getItem('pwa-install-dismiss-time')
  const isExpired = dismissTime ? Date.now() - parseInt(dismissTime) > 30 * 24 * 60 * 60 * 1000 : true

  if (isStandalone || (isDismissed && !isExpired)) return

  // iOS 检测
  const ua = window.navigator.userAgent
  isIOS.value = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream
  
  if (isIOS.value) {
    // iOS Safari 不触发 beforeinstallprompt，直接显示提示
    show.value = true
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    // 阻止 Chrome 67 及更早版本自动显示提示
    e.preventDefault()
    // 暂存事件以供后续触发
    deferredPrompt.value = e
    // 显示自定义 UI
    show.value = true
    isIOS.value = false // 如果触发了此事件，说明支持自动安装，优先使用自动安装逻辑
  })

  window.addEventListener('appinstalled', () => {
    show.value = false
    deferredPrompt.value = null
  })
})

const installPWA = async () => {
  if (isIOS.value) return // iOS 走手动引导逻辑
  if (!deferredPrompt.value) return
  
  // 显示浏览器安装确认框
  deferredPrompt.value.prompt()
  
  // 等待用户反馈
  const { outcome } = await deferredPrompt.value.userChoice
  if (outcome === 'accepted') {
    show.value = false
  }
  deferredPrompt.value = null
}

const dismiss = () => {
  show.value = false
  localStorage.setItem('pwa-install-dismissed', 'true')
  localStorage.setItem('pwa-install-dismiss-time', Date.now().toString())
}
</script>

<template>
  <Transition name="pwa-fade">
    <div v-if="show" class="pwa-prompt" role="alert">
      <div class="pwa-content">
        <div class="pwa-icon">
          <img src="/logo.svg" alt="MatNoble Logo" width="40" height="40" />
        </div>
        
        <div v-if="!isIOS" class="pwa-text">
          <div class="pwa-title">安装 MatNoble 应用</div>
          <div class="pwa-desc">添加到主屏幕，离线访问更快捷。</div>
        </div>
        
        <div v-else class="pwa-text">
          <div class="pwa-title">添加到主屏幕</div>
          <div class="pwa-desc ios-desc">
            点击下方 <span class="ios-icon"><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .9 2 2z"/></svg></span> 按钮，然后选择“添加到主屏幕”。
          </div>
        </div>

        <div class="pwa-actions">
          <button v-if="!isIOS" class="pwa-install" @click="installPWA">立即安装</button>
          <button class="pwa-close" @click="dismiss" aria-label="关闭">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
      </div>
      <!-- iOS 底部指示箭头（仅移动端显示） -->
      <div v-if="isIOS" class="ios-arrow"></div>
    </div>
  </Transition>
</template>

<style scoped>
.pwa-prompt {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 500;
  width: calc(100% - 32px);
  max-width: 420px;
}

/* iOS 样式增强 */
.ios-desc {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.ios-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--mn-blue);
}

.ios-arrow {
  display: none;
}

@media (max-width: 640px) {
  .ios-arrow {
    display: block;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid rgba(255, 255, 255, 0.8);
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    filter: drop-shadow(0 4px 4px rgba(0, 0, 0, 0.1));
  }
  
  .dark .ios-arrow {
    border-top-color: rgba(30, 30, 30, 0.8);
  }
}

.pwa-content {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

.dark .pwa-content {
  background-color: rgba(30, 30, 30, 0.8);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}

.pwa-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 4px;
}

.pwa-text {
  flex: 1;
  min-width: 0;
}

.pwa-title {
  font-weight: 700;
  font-size: 15px;
  color: var(--vp-c-text-1);
  margin-bottom: 2px;
}

.pwa-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pwa-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pwa-install {
  background-color: var(--mn-blue);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.pwa-install:hover {
  background-color: var(--mn-red);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(224, 93, 82, 0.3);
}

.pwa-close {
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.pwa-close:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: var(--mn-red);
}

.dark .pwa-close:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

/* 进场动画 - 使用与项目中类似的 Spring 效果 */
.pwa-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.pwa-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.pwa-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, 40px) scale(0.9);
}
.pwa-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px) scale(0.95);
}

@media (max-width: 640px) {
  .pwa-prompt {
    bottom: 16px;
  }
  .pwa-content {
    padding: 12px 14px;
    gap: 10px;
  }
  .pwa-desc {
    display: none;
  }
}
</style>
