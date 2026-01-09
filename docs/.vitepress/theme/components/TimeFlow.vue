<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue'

const activeTab = ref<'clock' | 'pomodoro' | 'timer'>('clock')

// --- Global Options ---
const isFullscreen = ref(false)
const isSoundEnabled = ref(true)
const showSeconds = ref(true)
const containerRef = ref<HTMLElement | null>(null)
const idleTimer = ref<any>(null)
const isIdle = ref(false)

// --- Sound Logic (Web Audio API) ---
const playNotificationSound = () => {
  if (!isSoundEnabled.value) return
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime) // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    osc.start()
    osc.stop(ctx.currentTime + 0.5)
  } catch (e) {
    console.error('Audio play failed', e)
  }
}

// --- Clock Logic ---
const now = ref(new Date())
const timeFormatter = computed(() => new Intl.DateTimeFormat('zh-CN', {
  hour: 'numeric',
  minute: 'numeric',
  second: showSeconds.value ? 'numeric' : undefined,
  hour12: false
}))
const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
})

// --- Pomodoro Logic ---
const POMODORO_WORK = 25 * 60
const POMODORO_BREAK = 5 * 60
const pomodoroTime = ref(POMODORO_WORK)
const isPomodoroRunning = ref(false)
const pomodoroMode = ref<'work' | 'break'>('work')

// --- Timer Logic ---
const timerInput = ref(5) // minutes
const timerTime = ref(5 * 60)
const isTimerRunning = ref(false)

// Shared Interval
let intervalId: any = null

const startInterval = () => {
  if (intervalId) return
  intervalId = setInterval(() => {
    // Clock
    now.value = new Date()

    // Pomodoro
    if (isPomodoroRunning.value) {
      if (pomodoroTime.value > 0) {
        pomodoroTime.value--
      } else {
        isPomodoroRunning.value = false
        playNotificationSound()
        togglePomodoroMode()
      }
    }

    // Timer
    if (isTimerRunning.value) {
      if (timerTime.value > 0) {
        timerTime.value--
      } else {
        isTimerRunning.value = false
        playNotificationSound()
      }
    }
  }, 1000)
}

// --- Fullscreen & Idle Logic ---
const toggleFullscreen = async () => {
  if (!containerRef.value) return

  if (!document.fullscreenElement) {
    try {
      await containerRef.value.requestFullscreen()
    } catch (err) {
      // Fallback for iOS which often doesn't support requestFullscreen on div
      isFullscreen.value = true 
    }
  } else {
    try {
      await document.exitFullscreen()
    } catch (err) {
      isFullscreen.value = false
    }
  }
}

const handleActivity = () => {
  if (!isFullscreen.value) return 
  
  isIdle.value = false
  if (idleTimer.value) clearTimeout(idleTimer.value)
  
  idleTimer.value = setTimeout(() => {
    if (isFullscreen.value) {
      isIdle.value = true
    }
  }, 3000)
}

onMounted(() => {
  startInterval()
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
    if (!isFullscreen.value) isIdle.value = false
  })
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (idleTimer.value) clearTimeout(idleTimer.value)
})

// --- Pomodoro Actions ---
const togglePomodoro = () => {
  isPomodoroRunning.value = !isPomodoroRunning.value
}

const resetPomodoro = () => {
  isPomodoroRunning.value = false
  pomodoroTime.value = pomodoroMode.value === 'work' ? POMODORO_WORK : POMODORO_BREAK
}

const togglePomodoroMode = () => {
  isPomodoroRunning.value = false
  if (pomodoroMode.value === 'work') {
    pomodoroMode.value = 'break'
    pomodoroTime.value = POMODORO_BREAK
  } else {
    pomodoroMode.value = 'work'
    pomodoroTime.value = POMODORO_WORK
  }
}

const pomodoroProgress = computed(() => {
  const total = pomodoroMode.value === 'work' ? POMODORO_WORK : POMODORO_BREAK
  const progress = ((total - pomodoroTime.value) / total) * 100
  return 100 - progress // Countdown circle
})

// --- Timer Actions ---
const toggleTimer = () => {
  isTimerRunning.value = !isTimerRunning.value
}

const resetTimer = () => {
  isTimerRunning.value = false
  timerTime.value = timerInput.value * 60
}

watch(timerInput, (val) => {
  if (!isTimerRunning.value) {
    timerTime.value = val * 60
  }
})

// --- Formatting Helpers ---
const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// --- Translation Helpers ---
const tabNames: Record<string, string> = {
  clock: '时钟',
  pomodoro: '专注',
  timer: '计时器'
}
</script>

<template>
  <div 
    ref="containerRef" 
    class="timeflow-container" 
    :class="{ 'fullscreen-mode': isFullscreen, 'ui-idle': isIdle }"
    @mousemove="handleActivity"
    @touchstart="handleActivity"
    @click="handleActivity"
  >
    <!-- Background for Zen Mode -->
    <div v-if="isFullscreen" class="zen-background"></div>

    <!-- Glassmorphic Card (becomes transparent container in Zen Mode) -->
    <div class="glass-card">
      
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="toolbar-left">
           <!-- Seconds Toggle (Only for Clock) -->
           <button 
            v-if="activeTab === 'clock'"
            class="icon-btn" 
            @click="showSeconds = !showSeconds"
            title="显示/隐藏秒针"
          >
            <span class="btn-text" :class="{ active: showSeconds }">:.s</span>
          </button>
        </div>
        
        <div class="toolbar-right">
          <button class="icon-btn" @click="isSoundEnabled = !isSoundEnabled" :title="isSoundEnabled ? '静音' : '开启声音'">
             <svg v-if="isSoundEnabled" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93L15.54 8.46M15.54 15.54l3.53 3.53M19.07 19.07L15.54 15.54M15.54 8.46l3.53 3.53"/></svg>
             <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>
          </button>
          
          <button class="icon-btn" @click="toggleFullscreen" title="禅模式 (全屏壁纸)">
            <svg v-if="!isFullscreen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
          </button>
        </div>
      </div>

      <!-- Header / Tabs -->
      <div class="tabs">
        <button 
          v-for="tab in ['clock', 'pomodoro', 'timer']" 
          :key="tab"
          @click="activeTab = tab as any"
          :class="{ active: activeTab === tab }"
          class="tab-btn"
        >
          {{ tabNames[tab] }}
        </button>
      </div>

      <!-- Content Area -->
      <div class="content">
        
        <!-- Clock View -->
        <transition name="fade" mode="out-in">
          <div v-if="activeTab === 'clock'" class="view clock-view">
            <div class="time-display" :class="{ 'no-seconds': !showSeconds }">
              {{ timeFormatter.format(now) }}
            </div>
            <div class="date-display">{{ dateFormatter.format(now) }}</div>
          </div>
        
          <!-- Pomodoro View -->
          <div v-else-if="activeTab === 'pomodoro'" class="view pomodoro-view">
            <div class="status-badge" :class="pomodoroMode">
              {{ pomodoroMode === 'work' ? '专注时刻' : '休息一下' }}
            </div>
            
            <div class="timer-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" class="circle-bg" />
                <circle 
                  cx="50" cy="50" r="45" 
                  class="circle-progress"
                  :style="{ strokeDashoffset: 283 * (1 - pomodoroProgress / 100) }" 
                />
              </svg>
              <div class="timer-text">{{ formatDuration(pomodoroTime) }}</div>
            </div>

            <div class="controls">
              <button @click="togglePomodoro" class="action-btn primary">
                {{ isPomodoroRunning ? '暂停' : '开始' }}
              </button>
              <button @click="resetPomodoro" class="action-btn secondary">重置</button>
            </div>
          </div>

          <!-- Timer View -->
          <div v-else-if="activeTab === 'timer'" class="view timer-view">
             <div class="input-group">
                <label>设定分钟:</label>
                <input type="number" v-model="timerInput" min="1" max="120" @focus="isTimerRunning = false">
             </div>

             <div class="digital-display">
               {{ formatDuration(timerTime) }}
             </div>

             <div class="controls">
              <button @click="toggleTimer" class="action-btn primary">
                {{ isTimerRunning ? '暂停' : '开始' }}
              </button>
              <button @click="resetTimer" class="action-btn secondary">重置</button>
            </div>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* 
  Apple Design System Inspired Variables with Semantic Naming 
  Using CSS Variables for robust Dark Mode support
*/
.timeflow-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  font-family: 'Outfit', sans-serif;
  transition: all 0.5s ease;

  /* Default Light Mode Colors */
  --tf-card-bg: rgba(255, 255, 255, 0.7);
  --tf-card-border: rgba(255, 255, 255, 0.4);
  --tf-card-shadow: rgba(0, 0, 0, 0.05);
  --tf-tab-bg: rgba(0, 0, 0, 0.05);
  --tf-tab-active-bg: #ffffff;
  --tf-tab-active-shadow: rgba(0,0,0,0.08);
  --tf-text-main: var(--vp-c-text-1);
  --tf-text-dim: var(--vp-c-text-2);
  --tf-input-bg: rgba(0, 0, 0, 0.05);
  --tf-input-color: var(--vp-c-text-1);
}

/* Dark Mode Overrides - Applied via global .dark class */
:global(.dark) .timeflow-container {
  /* Dark Mode Colors - Obsidian Style */
  --tf-card-bg: rgba(0, 0, 0, 0.75); /* Pure black base */
  --tf-card-border: rgba(255, 255, 255, 0.08); /* Very subtle highlight */
  --tf-card-shadow: rgba(0, 0, 0, 0.8);
  
  /* Critical change: Use black transparency for inner elements, NOT white */
  --tf-tab-bg: rgba(0, 0, 0, 0.5); 
  --tf-tab-active-bg: rgba(255, 255, 255, 0.1);
  --tf-tab-active-shadow: rgba(0,0,0,0.5);
  
  --tf-input-bg: rgba(0, 0, 0, 0.5);
  
  /* Ensure text pops against black */
  --tf-text-main: #ffffff;
  --tf-text-dim: rgba(255, 255, 255, 0.6);
  --tf-input-color: #ffffff;
}

.glass-card {
  width: 100%;
  max-width: 480px;
  min-height: 400px;
  background: var(--tf-card-bg); /* Use variable */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 32px;
  box-shadow: 
    0 20px 40px var(--tf-card-shadow),
    0 1px 2px rgba(255, 255, 255, 0.1) inset; /* Subtle top highlight */
  border: 1px solid var(--tf-card-border); /* Use variable */
  padding: 24px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.5s ease;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  opacity: 0.6;
  transition: opacity 0.3s;
}
.toolbar:hover {
  opacity: 1;
}
.toolbar-right {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: var(--tf-text-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.icon-btn:hover {
  background: var(--tf-tab-bg);
  color: var(--tf-text-main);
}
.icon-btn svg {
  width: 20px;
  height: 20px;
}
.btn-text {
  font-size: 14px;
  font-weight: 700;
  opacity: 0.5;
}
.btn-text.active {
  opacity: 1;
  color: var(--vp-c-brand);
}

.tabs {
  display: flex;
  background: var(--tf-tab-bg); /* Use variable */
  padding: 4px;
  border-radius: 16px;
  margin-bottom: 32px;
  transition: all 0.5s;
}

.tab-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px 16px; /* Increased side padding */
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  color: var(--tf-text-dim);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap; /* Prevent text wrapping */
  min-width: 80px; /* Ensure enough width for 3 characters */
}

.tab-btn.active {
  background: var(--tf-tab-active-bg); /* Use variable */
  color: var(--tf-text-main);
  box-shadow: 0 2px 8px var(--tf-tab-active-shadow);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* Clock Styles */
.clock-view {
  text-align: center;
}
.time-display {
  font-size: 48px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;
  color: var(--tf-text-main);
  transition: all 0.5s;
}
.date-display {
  font-size: 18px;
  color: var(--tf-text-dim);
  margin-top: 8px;
  transition: all 0.5s;
}

/* Pomodoro Styles */
.status-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  background: rgba(var(--vp-c-brand-rgb), 0.1);
  color: var(--vp-c-brand);
  transition: all 0.5s;
}
.status-badge.break {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.timer-circle {
  position: relative;
  width: 220px;
  height: 220px;
  margin-bottom: 32px;
  transition: all 0.5s;
}
.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -2px;
  transition: all 0.5s;
  color: var(--tf-text-main);
}
svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}
.circle-bg {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 6;
}
.circle-progress {
  fill: none;
  stroke: var(--vp-c-brand);
  stroke-width: 6;
  stroke-dasharray: 283; /* 2 * PI * 45 */
  stroke-dashoffset: 0;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
}

/* Timer Styles */
.digital-display {
  font-size: 64px;
  font-weight: 200;
  font-family: 'Inter', monospace;
  margin: 24px 0;
  font-variant-numeric: tabular-nums;
  transition: all 0.5s;
  color: var(--tf-text-main);
}
.input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--tf-text-dim);
  transition: all 0.5s;
}
.input-group input {
  background: var(--tf-input-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 4px 8px;
  width: 60px;
  text-align: center;
  color: var(--tf-input-color);
}

/* Controls */
.controls {
  display: flex;
  gap: 16px;
  transition: all 0.5s;
}
.action-btn {
  padding: 12px 32px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  border: none;
  transition: transform 0.1s;
}
.action-btn:active {
  transform: scale(0.96);
}
.action-btn.primary {
  background: var(--vp-c-brand);
  color: white;
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-rgb), 0.3);
}
.action-btn.secondary {
  background: var(--tf-input-bg);
  color: var(--tf-text-main);
  border: 1px solid var(--vp-c-divider);
}
.action-btn.secondary:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* --- FULLSCREEN / ZEN MODE STYLES --- */
.timeflow-container.fullscreen-mode {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10000;
  background: var(--vp-c-bg); /* Clean background */
  color: var(--tf-text-main);
  padding: 0;
  margin: 0;
}

.zen-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Subtle Gradient using VitePress variables for auto dark mode support */
  background: radial-gradient(circle at center, var(--vp-c-bg-alt), var(--vp-c-bg));
  z-index: -1;
}

.fullscreen-mode .glass-card {
  width: 100%;
  height: 100%;
  max-width: none;
  border: none;
  box-shadow: none;
  background: transparent;
  backdrop-filter: none;
  border-radius: 0;
  justify-content: center;
}

/* Scale up elements in Zen Mode - Responsive for Mobile */
.fullscreen-mode .time-display {
  font-size: 20vmin; /* Large and responsive */
  letter-spacing: -2px;
  color: var(--tf-text-main);
}
@media (min-width: 768px) {
  .fullscreen-mode .time-display {
    font-size: 15vw;
    letter-spacing: -4px;
  }
}

.fullscreen-mode .date-display {
  font-size: 5vmin;
  margin-top: 2vmin;
  opacity: 0.8;
  color: var(--tf-text-dim);
}
@media (min-width: 768px) {
  .fullscreen-mode .date-display {
    font-size: 2rem;
    margin-top: 2rem;
  }
}

.fullscreen-mode .timer-circle {
  width: 70vmin; /* Responsive huge circle on mobile */
  height: 70vmin;
  max-width: 500px;
  max-height: 500px;
}
.fullscreen-mode .timer-text {
  font-size: 15vmin;
  color: var(--tf-text-main);
}
@media (min-width: 768px) {
  .fullscreen-mode .timer-text {
    font-size: 8rem;
  }
}

.fullscreen-mode .digital-display {
  font-size: 25vmin;
  color: var(--tf-text-main);
}

/* Hide non-essentials in Idle Mode */
.fullscreen-mode.ui-idle .toolbar,
.fullscreen-mode.ui-idle .tabs,
.fullscreen-mode.ui-idle .controls,
.fullscreen-mode.ui-idle .input-group,
.fullscreen-mode.ui-idle .status-badge {
  opacity: 0;
  pointer-events: none;
}

.fullscreen-mode .toolbar {
  position: absolute;
  top: env(safe-area-inset-top, 20px);
  right: 20px;
  width: auto;
  gap: 12px;
  z-index: 20; 
}

.fullscreen-mode .tabs {
  position: absolute;
  bottom: calc(env(safe-area-inset-bottom, 20px) + 20px);
  margin-bottom: 0;
  width: auto;
  max-width: 95vw;
  z-index: 20; /* Ensure tabs are clickable */
  display: flex;
  justify-content: center;
}

@media (max-width: 480px) {
  .fullscreen-mode .tab-btn {
    padding: 6px 4px;
    font-size: 12px;
  }
}
</style>