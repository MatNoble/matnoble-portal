<script setup lang="ts">
const socialLinks = [
  { icon: 'youtube', link: 'https://www.youtube.com/@RossMatNoble', label: 'YouTube' },
  { icon: 'github', link: 'https://github.com/matnoble', label: 'GitHub' },
  { icon: 'telegram', link: 'https://t.me/HUSTMatNoble', label: 'Telegram' },
  { icon: 'mail', link: 'mailto:me@matnoble.top', label: 'Email' },
  { icon: 'rss', link: '/atom.xml', label: 'RSS' }
]
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
         rel="noopener">
        <span class="icon-label">{{ social.label }}</span>
      </a>
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
  transition: all var(--duration-fast) ease;
  opacity: 0.7;
  position: relative;
}

.social-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--mn-primary);
  transition: width var(--duration-fast) ease;
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
</style>
