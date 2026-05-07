<script setup lang="ts">
import { ref, computed } from 'vue'

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

const isPlaying = ref(false)
const showVideo = ref(!!props.src || !!props.bvid)

const bilibiliUrl = computed(() => {
  if (!props.bvid) return ''
  return `https://player.bilibili.com/player.html?bvid=${props.bvid}&page=1&high_quality=1&danmaku=0&autoplay=0`
})

const containerStyle = computed(() => ({
  aspectRatio: props.ratio.replace('/', ' / ')
}))
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

      <!-- Native HTML5 Video -->
      <video
        v-else-if="src"
        :src="src"
        :poster="poster"
        :autoplay="autoplay"
        :loop="loop"
        controls
        playsinline
        class="native-video"
      ></video>
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

.video-wrapper, .poster-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
