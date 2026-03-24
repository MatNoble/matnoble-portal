<script setup>
import { ref, computed, onUnmounted, onMounted } from 'vue'

const isRunning = ref(false)
const timeLeft = ref(300)
const totalTime = ref(300)
const timer = ref(null)
const isFullscreen = ref(false)

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  const s = timeLeft.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const dashOffset = computed(() => {
  const circumference = 2 * Math.PI * 46
  return circumference * (1 - timeLeft.value / totalTime.value)
})

const startTimer = () => {
  if (isRunning.value) return
  isRunning.value = true
  timer.value = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      stopTimer()
      if (typeof window !== 'undefined' && window.navigator.vibrate) {
        window.navigator.vibrate([300, 100, 300])
      }
    }
  }, 1000)
}

const stopTimer = () => {
  isRunning.value = false
  clearInterval(timer.value)
}

const resetTimer = (seconds) => {
  stopTimer()
  if (seconds) {
    totalTime.value = seconds
    timeLeft.value = seconds
  } else {
    timeLeft.value = totalTime.value
  }
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`)
    })
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
  // 激活计时器专属样式
  document.documentElement.classList.add('is-countdown-active')
})

onUnmounted(() => {
  clearInterval(timer.value)
  // 离开页面时恢复原样
  document.documentElement.classList.remove('is-countdown-active')
})

const presets = [
  { label: '1m', val: 60 },
  { label: '2m', val: 120 },
  { label: '5m', val: 300 },
  { label: '10m', val: 600 },
]
</script>

<template>
  <div class="timer-wrapper" :class="{ 'is-fs': isFullscreen }">
    <div class="timer-card">
      <div class="watch-face">
        <svg class="progress-ring" viewBox="0 0 100 100">
          <circle
            class="ring-bg"
            cx="50"
            cy="50"
            r="46"
          />
          <circle
            class="ring-active"
            :class="{ 'warning': timeLeft < 10 && timeLeft > 0 }"
            cx="50"
            cy="50"
            r="46"
            :style="{
              strokeDasharray: `${2 * Math.PI * 46}`,
              strokeDashoffset: dashOffset
            }"
          />
        </svg>

        <div class="display-group">
          <div class="time-nums" :class="{ 'danger': timeLeft < 10 && timeLeft > 0 }">
            {{ formattedTime }}
          </div>
        </div>
      </div>

      <div class="action-bar">
        <button v-if="!isRunning" @click="startTimer" class="ctrl-btn play">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <button v-else @click="stopTimer" class="ctrl-btn pause">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
        </button>
        
        <button @click="resetTimer()" class="ctrl-btn reset">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
      </div>

      <div class="preset-grid">
        <button 
          v-for="p in presets" 
          :key="p.val" 
          @click="resetTimer(p.val)"
          class="p-pill"
          :class="{ active: totalTime === p.val }"
        >
          {{ p.label }}
        </button>
      </div>
      
      <button @click="toggleFullscreen" class="fs-toggle" title="全屏模式">
        <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/></svg>
      </button>

      <a href="/" class="home-link" title="返回主页">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </a>
    </div>
  </div>
</template>

<style scoped>
.timer-wrapper {
  --accent: #FF9F0A;
  --danger: #FF453A;
  --bg: #000;
  --card-bg: #111;
  
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  transition: all 0.5s ease;
}

.timer-card {
  position: relative;
  background: var(--card-bg);
  padding: 40px 60px;
  border-radius: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 30px 60px rgba(0,0,0,0.8);
  border: 1px solid #222;
}

.watch-face {
  position: relative;
  width: 300px;
  height: 300px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: transparent;
  stroke: #1c1c1e;
  stroke-width: 1.5;
}

.ring-active {
  fill: transparent;
  stroke: var(--accent);
  stroke-width: 1.5;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear, stroke 0.3s;
}

.ring-active.warning {
  stroke: var(--danger);
}

.time-nums {
  font-family: 'SF Mono', 'Outfit', monospace;
  font-size: 84px;
  font-weight: 500;
  color: #fff;
  letter-spacing: -3px;
  font-variant-numeric: tabular-nums;
}

.time-nums.danger {
  color: var(--danger);
  animation: breathe 1s infinite ease-in-out;
}

.action-bar {
  margin-top: 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.ctrl-btn {
  width: 64px;
  height: 64px;
  border-radius: 32px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.ctrl-btn svg { width: 28px; height: 28px; }

.play { background: #34C759; color: #fff; }
.pause { background: #FF3B30; color: #fff; }
.reset { background: #2C2C2E; color: #8E8E93; }

.ctrl-btn:hover { transform: scale(1.1); filter: brightness(1.2); }
.ctrl-btn:active { transform: scale(0.95); }

.preset-grid {
  margin-top: 32px;
  display: flex;
  gap: 12px;
}

.p-pill {
  background: #1C1C1E;
  border: 1px solid #333;
  color: #8E8E93;
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.p-pill.active {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
}

.fs-toggle {
  position: absolute;
  top: 24px;
  right: 24px;
  background: transparent;
  border: none;
  color: #333;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s;
}

.fs-toggle:hover { color: #888; background: rgba(255,255,255,0.05); }
.fs-toggle svg { width: 20px; height: 20px; }

.home-link {
  position: absolute;
  top: 24px;
  left: 24px;
  color: #333;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-link:hover { color: #888; background: rgba(255,255,255,0.05); }
.home-link svg { width: 20px; height: 20px; }

@keyframes breathe {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.02); }
}

@media (max-width: 768px) {
  .timer-card {
    padding: 30px 40px;
    border-radius: 36px;
    width: 90vw;
  }
  .watch-face {
    width: 240px;
    height: 240px;
  }
  .time-nums {
    font-size: 64px;
  }
  .ctrl-btn {
    width: 54px;
    height: 54px;
  }
}

@media (max-width: 480px) {
  .timer-card {
    padding: 24px 16px;
    width: 92vw;
    border-radius: 32px;
  }
  .watch-face {
    width: 65vw;
    max-width: 240px;
  }
  .time-nums {
    font-size: min(15vw, 64px);
  }
  .action-bar {
    gap: 16px;
    margin-top: 16px;
  }
  .ctrl-btn {
    width: 48px;
    height: 48px;
  }
  .ctrl-btn svg { width: 22px; height: 22px; }
  .preset-grid {
    gap: 6px;
    margin-top: 24px;
  }
  .p-pill {
    padding: 6px 10px;
    font-size: 12px;
  }
  .home-link, .fs-toggle {
    top: 16px;
  }
  .home-link { left: 16px; }
  .fs-toggle { right: 16px; }
}

/* 横屏手机优化 */
@media (max-height: 500px) and (orientation: landscape) {
  .timer-card {
    flex-direction: row;
    gap: 40px;
    padding: 20px 40px;
    height: 90vh;
  }
  .watch-face {
    width: 180px;
    height: 180px;
  }
  .time-nums {
    font-size: 48px;
  }
  .action-bar {
    flex-direction: column;
    margin-top: 0;
  }
  .preset-grid {
    display: none; /* 横屏空间有限，隐藏预设 */
  }
}

/* 全屏样式优化 */
:global(.is-countdown-page) {
  background: #000 !important;
}

.is-fs .timer-card {
  border: none;
  background: transparent;
  box-shadow: none;
  width: 100vw;
  height: 100vh;
  padding: 0;
  border-radius: 0;
  justify-content: center;
}

.is-fs .watch-face {
  width: 60vh;
  height: 60vh;
}

.is-fs .time-nums {
  font-size: 20vh;
}

.is-fs .action-bar { margin-top: 5vh; }
.is-fs .ctrl-btn { width: 10vh; height: 10vh; border-radius: 5vh; }
.is-fs .ctrl-btn svg { width: 4vh; height: 4vh; }
.is-fs .p-pill { font-size: 2.5vh; padding: 1.5vh 3vh; border-radius: 3vh; }

.is-fs .home-link, .is-fs .fs-toggle {
  top: 4vh;
  padding: 1.5vh;
}
.is-fs .home-link { left: 4vh; }
.is-fs .fs-toggle { right: 4vh; }
.is-fs .home-link svg, .is-fs .fs-toggle svg { width: 4vh; height: 4vh; }
</style>
