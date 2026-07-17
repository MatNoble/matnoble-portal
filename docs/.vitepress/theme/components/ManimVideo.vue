<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface Props {
  src?: string      // Direct video URL (CDN)
  bvid?: string     // Bilibili BV ID
  poster?: string   // Video poster/thumbnail
  caption?: string  // Optional caption
  autoplay?: boolean
  loop?: boolean
  ratio?: string    // Aspect ratio, default 16/9
}

const props = withDefaults(defineProps<Props>(), {
  autoplay: false,
  loop: true,
  ratio: '16/9'
})

// Centralized CDN Base URL
const CDN_BASE = '/v'

const isPlaying = ref(false)
const showVideo = ref(!!props.src || !!props.bvid)
const videoPlayer = ref<HTMLVideoElement | null>(null)
let player: any = null // Use any or videojs.Player

const videoSrc = computed(() => {
  if (!props.src) return ''
  if (props.src.startsWith('http') || props.src.startsWith('/')) {
    return props.src
  }
  return `${CDN_BASE}/${props.src}`
})

const bilibiliUrl = computed(() => {
  if (!props.bvid) return ''
  return `https://player.bilibili.com/player.html?bvid=${props.bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`
})

const containerStyle = computed(() => ({
  aspectRatio: props.ratio.replace('/', ' / ')
}))

const captureSnapshot = () => {
  if (!player) return
  const video = player.el().querySelector('video')
  if (!video) return

  try {
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return // 增加 null 检查

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataURL = canvas.toDataURL('image/jpeg', 0.9)
    const link = document.createElement('a')
    link.href = dataURL
    link.download = `cover_${props.src?.split('/').pop()?.split('.')[0] || 'snapshot'}.jpg`
    link.click()
  } catch (err) {
    console.error('Failed to capture snapshot:', err)
    alert('截图失败，请确保 R2 已配置 CORS 跨域规则。')
  }
}

onMounted(() => {
  if (videoPlayer.value && props.src) {
    player = videojs(videoPlayer.value, {
      autoplay: props.autoplay,
      loop: props.loop,
      controls: true,
      preload: 'auto',
      responsive: true,
      fluid: true,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      controlBar: {
        // Disable unnecessary components to prevent layout conflicts
        remainingTimeDisplay: false,
        pictureInPictureToggle: false,
        liveDisplay: false,
        seekToLive: false,
        children: [
          'playToggle',
          'currentTimeDisplay',
          'spacer',
          'playbackRateMenuButton',
          'volumePanel',
          'fullscreenToggle',
          'progressControl'
        ]
      }
    })

    // Add Custom Snapshot Button
    const controlBar = player.controlBar
    const snapshotButton = controlBar.addChild('button', {
      controlText: '截图封面',
      className: 'vjs-snapshot-button'
    })
    
    if (snapshotButton) {
      snapshotButton.on('click', captureSnapshot)
    }

    player.src({ src: videoSrc.value, type: 'video/mp4' })
  }
})

onUnmounted(() => {
  if (player) {
    player.dispose()
    player = null
  }
})

// Watch for src changes to update the player
watch(() => videoSrc.value, (newSrc) => {
  if (player && newSrc) {
    player.src({ src: newSrc, type: 'video/mp4' })
  }
})
</script>

<template>
  <div class="manim-video-container" :style="containerStyle">
    <!-- Video Player -->
    <div v-if="showVideo" class="video-wrapper">
      <!-- Bilibili Iframe -->
      <iframe
        v-if="bvid"
        :src="bilibiliUrl"
        scrolling="no"
        border="0"
        frameborder="no"
        framespacing="0"
        allowfullscreen="true"
        class="bilibili-iframe"
      ></iframe>

      <!-- Video.js Player -->
      <div v-else-if="src" class="video-js-wrapper">
        <video
          ref="videoPlayer"
          class="video-js vjs-big-play-centered vjs-theme-matnoble"
          crossorigin="anonymous"
          :poster="poster"
        ></video>
      </div>
    </div>

    <!-- Fallback / Poster State -->
    <div v-else-if="poster" class="poster-wrapper" @click="showVideo = true">
      <img :src="poster" alt="Video poster" class="poster-img" />
      <div class="play-button-overlay">
        <div class="play-icon"></div>
      </div>
    </div>

    <!-- Caption -->
    <p v-if="caption" class="video-caption">{{ caption }}</p>
  </div>
</template>

<style scoped>
.manim-video-container {
  width: 100%;
  max-width: 960px;
  margin: var(--space-xl) auto;
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #000;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.video-wrapper, .poster-wrapper, .video-js-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-js-wrapper {
  background: #000;
}

/* Custom MatNoble Video.js Theme */
:deep(.vjs-theme-matnoble) {
  --vjs-theme-primary: var(--mn-primary);
}

:deep(.video-js) {
  font-family: var(--vp-font-family-base);
  background-color: transparent;
}

:deep(.vjs-big-play-button) {
  width: 80px !important;
  height: 80px !important;
  line-height: 80px !important;
  border-radius: 50% !important;
  background-color: rgba(var(--mn-primary-rgb, 100, 100, 255), 0.8) !important;
  border: 3px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(8px) !important;
  left: 50% !important;
  top: 50% !important;
  margin-left: -40px !important;
  margin-top: -40px !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.3) !important;
}

:deep(.vjs-big-play-button .vjs-icon-placeholder::before) {
  font-size: 50px !important;
  line-height: 74px !important; /* Adjust for perfect centering */
}

:deep(.video-js:hover .vjs-big-play-button) {
  background-color: var(--mn-primary) !important;
  transform: scale(1.1);
  box-shadow: 0 0 50px rgba(var(--mn-primary-rgb), 0.5) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
}

/* ==========================================================================
   Complete Control Bar Reconstruction (YouTube Style)
   ========================================================================== */

:deep(.vjs-control-bar) {
  display: flex !important;
  flex-wrap: wrap !important;
  align-items: center !important;
  background: linear-gradient(transparent, rgba(0,0,0,0.9)) !important;
  height: auto !important;
  padding: 0 12px 8px 12px !important;
  bottom: 0 !important;
  box-sizing: border-box !important;
}

/* 1. 进度条 (Full Width Top) */
:deep(.vjs-progress-control) {
  width: 100% !important;
  height: 12px !important;
  order: -1 !important;
  margin-bottom: 6px !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.vjs-progress-holder) {
  height: 3px !important;
  margin: 0 !important;
  transition: height 0.15s ease;
}

:deep(.vjs-progress-control:hover .vjs-progress-holder) {
  height: 6px !important;
}

/* 2. 按钮全局样式 */
:deep(.vjs-button), :deep(.vjs-playback-rate) {
  width: 36px !important;
  height: 36px !important;
  margin: 0 2px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
}

/* 3. 播放、全屏、音量图标 */
:deep(.vjs-icon-placeholder::before) {
  line-height: 36px !important;
  font-size: 1.6em !important;
}

/* 4. 时间显示组合 (左侧) */
:deep(.vjs-current-time) { 
  order: 2 !important; 
  display: flex !important; 
  padding: 0 2px 0 10px !important; 
  align-items: center !important;
}

/* 5. 左右隔离 */
:deep(.vjs-spacer) {
  order: 5 !important;
  flex: 1 1 auto !important;
  display: block !important;
}

/* 6. 右侧功能区 */
:deep(.vjs-playback-rate) { order: 6 !important; }
:deep(.vjs-volume-panel) { order: 7 !important; }
:deep(.vjs-fullscreen-toggle) { order: 8 !important; }
:deep(.vjs-snapshot-button) { order: 9 !important; }

/* 7. 倍速菜单 - 彻底修复错位 */
:deep(.vjs-playback-rate .vjs-menu) {
  bottom: 40px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: 60px !important;
  margin-bottom: 10px !important;
}

:deep(.vjs-playback-rate .vjs-menu-content) {
  bottom: 0 !important;
  width: 60px !important;
}

/* 8. 相机按钮对齐 */
:deep(.vjs-snapshot-button .vjs-icon-placeholder::before) {
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2.2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 20px;
  width: 36px;
  height: 36px;
  display: block;
  opacity: 0.8;
  transition: all 0.2s ease;
}

:deep(.vjs-snapshot-button:hover .vjs-icon-placeholder::before) {
  opacity: 1;
  transform: scale(1.1);
}

.bilibili-iframe {
  background-color: var(--mn-primary);
}

:deep(.vjs-slider) {
  background-color: rgba(255,255,255,0.2);
}

:deep(.vjs-load-progress) {
  background-color: rgba(255,255,255,0.3);
}

/* Playback Rate & Menus */
:deep(.vjs-menu-button-popup .vjs-menu) {
  bottom: 1.5em;
  left: -2em;
}

:deep(.vjs-menu-content) {
  background-color: #1a1a1a !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 6px !important;
  box-shadow: 0 12px 24px rgba(0,0,0,0.6);
  list-style: none !important;
  overflow: hidden !important;
}

:deep(.vjs-menu-title) {
  display: none !important;
}

:deep(.vjs-menu-item) {
  border-radius: 6px;
  margin: 2px 0;
  text-transform: none;
  font-size: 0.95rem;
  padding: 8px 12px !important;
  text-align: center;
  cursor: pointer;
}

:deep(.vjs-menu-item-text) {
  text-transform: none;
}

:deep(.vjs-menu-item:hover) {
  background-color: rgba(var(--mn-primary-rgb), 0.2) !important;
  color: var(--mn-primary);
}

:deep(.vjs-menu-item.vjs-selected) {
  background-color: var(--mn-primary) !important;
  color: #fff;
}

/* Snapshot Button Icon */
:deep(.vjs-snapshot-button .vjs-icon-placeholder::before) {
  content: "";
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15a2.25 2.25 0 002.25-2.25V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z' /%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 18px;
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

:deep(.vjs-snapshot-button:hover .vjs-icon-placeholder::before) {
  opacity: 1;
}

.bilibili-iframe {
  width: 100%;
  height: 100%;
  aspect-ratio: 16/9;
}

.native-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.poster-wrapper {
  cursor: pointer;
  position: relative;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.poster-wrapper:hover .poster-img {
  transform: scale(1.02);
}

.play-button-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  transition: background 0.3s ease;
}

.poster-wrapper:hover .play-button-overlay {
  background: rgba(0, 0, 0, 0.4);
}

.play-icon {
  width: 64px;
  height: 64px;
  background: var(--mn-primary);
  clip-path: polygon(25% 20%, 85% 50%, 25% 80%);
  transition: transform 0.3s ease, background 0.3s ease;
}

.poster-wrapper:hover .play-icon {
  transform: scale(1.1);
  background: #fff;
}

.video-caption {
  margin-top: var(--space-sm);
  text-align: center;
  font-size: 0.9rem;
  color: var(--mn-text-soft);
  font-family: var(--vp-font-family-base);
  font-style: italic;
}

/* Optimization for mobile */
@media (max-width: 640px) {
  .manim-video-container {
    border-radius: var(--radius-md);
  }
  .play-icon {
    width: 48px;
    height: 48px;
  }
}
</style>
