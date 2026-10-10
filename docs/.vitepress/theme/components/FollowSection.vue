<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface SocialLink {
  icon: string
  link: string
  label: string
  hasModal?: boolean
}

const socialLinks: SocialLink[] = [
  { icon: 'youtube', link: 'https://www.youtube.com/@RossMatNoble', label: 'YouTube' },
  { icon: 'github', link: 'https://github.com/matnoble', label: 'GitHub' },
  { icon: 'xiaohongshu', link: 'https://www.xiaohongshu.com/user/profile/5590f9bfa75c951aecf6c2fa', label: 'Xiaohongshu', hasModal: true },
  { icon: 'telegram', link: 'https://t.me/HUSTMatNoble', label: 'Telegram' },
  { icon: 'mail', link: 'mailto:me@matnoble.top', label: 'Email' },
  { icon: 'rss', link: '/feed.xml', label: 'RSS' }
]

const showXhsModal = ref(false)

function handleClick(social: SocialLink, event: MouseEvent) {
  if (social.hasModal) {
    event.preventDefault()
    showXhsModal.value = true
  }
}

function closeModal() {
  showXhsModal.value = false
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && showXhsModal.value) {
    closeModal()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div class="follow-section">
    <div class="divider"></div>
    <h3 class="follow-title">Stay Connected</h3>
    <div class="social-links-grid">
      <a v-for="social in socialLinks" 
         :key="social.label" 
         :href="social.link" 
         class="social-link"
         target="_blank" 
         rel="noopener"
         @click="handleClick(social, $event)">
        <span class="icon-label">{{ social.label }}</span>
      </a>
    </div>

    <!-- Xiaohongshu QR Code Modal -->
    <div 
      v-if="showXhsModal" 
      class="modal-overlay" 
      @click="closeModal" 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="xhs-modal-title"
    >
      <div class="modal-card" @click.stop>
        <div class="modal-header">
          <div class="modal-brand">
            <span class="brand-badge">RED</span>
            <h4 id="xhs-modal-title" class="modal-title">小红书</h4>
          </div>
          <button class="close-btn" @click="closeModal" aria-label="关闭">&times;</button>
        </div>

        <div class="modal-body">
          <div class="qr-container">
            <img 
              src="/qrcode_xiaohongshu.jpg" 
              alt="MatNoble 小红书关注二维码" 
              class="qr-image" 
              width="240" 
              height="328" 
              loading="eager" 
              decoding="async"
            />
          </div>
        </div>

        <div class="modal-footer">
          <a 
            href="https://www.xiaohongshu.com/user/profile/5590f9bfa75c951aecf6c2fa" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="xhs-open-link"
          >
            <span>访问网页版主页</span>
            <svg viewBox="0 0 24 24" class="external-icon" aria-hidden="true">
              <path d="M14 3h7v7h-2V6.414l-9.293 9.293-1.414-1.414L17.586 5H14V3zM5 5h6v2H5v12h12v-6h2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.follow-section {
  padding: 60px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
}

.divider {
  width: 60px;
  height: 2px;
  background: var(--mn-primary-soft);
  margin-bottom: 32px;
  opacity: 0.5;
}

.follow-title {
  font-family: var(--vp-font-family-heading);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--mn-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 32px;
}

.social-links-grid {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.social-link {
  font-family: var(--vp-font-family-base);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--mn-text);
  text-decoration: none;
  transition: all var(--duration-fast, 0.2s) ease;
  opacity: 0.7;
  position: relative;
  cursor: pointer;
}

.social-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--mn-primary);
  transition: width var(--duration-fast, 0.2s) ease;
}

.social-link:hover {
  opacity: 1;
  color: var(--mn-primary);
}

.social-link:hover::after {
  width: 100%;
}

@media (max-width: 640px) {
  .social-links-grid {
    gap: 1.5rem;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 16px;
}

.modal-card {
  background-color: var(--vp-c-bg, #0e1117);
  border: 1px solid var(--vp-c-divider, rgba(255, 255, 255, 0.1));
  border-radius: 16px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.35);
  max-width: 310px;
  width: 100%;
  overflow: hidden;
  animation: modal-enter 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px 10px;
  border-bottom: 1px solid var(--vp-c-divider, rgba(255, 255, 255, 0.08));
}

.modal-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-badge {
  background: #ff2442;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 4px;
  letter-spacing: 0.04em;
  line-height: 1.3;
}

.modal-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--mn-text, #e2e8f0);
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.4rem;
  line-height: 1;
  color: var(--mn-text-muted, #94a3b8);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.close-btn:hover {
  color: var(--mn-text, #ffffff);
  background-color: var(--vp-c-bg-soft, rgba(255, 255, 255, 0.08));
}

.modal-body {
  padding: 16px 18px 12px;
  display: flex;
  justify-content: center;
}

.qr-container {
  width: 100%;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px 10px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: center;
}

.qr-image {
  width: 100%;
  max-width: 240px;
  height: auto;
  display: block;
  border-radius: 6px;
}

.modal-footer {
  padding: 10px 18px 16px;
  display: flex;
  justify-content: center;
}

.xhs-open-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.86rem;
  color: var(--mn-text-soft, #94a3b8);
  text-decoration: none;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider, rgba(255, 255, 255, 0.1));
  background-color: var(--vp-c-bg-soft, rgba(255, 255, 255, 0.04));
  transition: all 0.2s ease;
}

.xhs-open-link:hover {
  color: #ffffff;
  background-color: #ff2442;
  border-color: #ff2442;
}

.external-icon {
  width: 14px;
  height: 14px;
}
</style>
