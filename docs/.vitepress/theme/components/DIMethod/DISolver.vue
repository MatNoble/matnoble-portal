<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from 'vue';
import { problems } from './problems';
import type { DIProblem } from './types';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const selectedProblem = ref<DIProblem>(problems[0]);
const currentStepIndex = ref(0);
const isFinished = ref(false);
const selectionMode = ref(true);
const selectionFeedback = ref<{ type: 'success' | 'error' | 'none', msg: string }>({ type: 'none', msg: '' });
const isFullscreen = ref(false);

const containerRef = ref<HTMLElement | null>(null);
const lines = ref<{ path: string, midX: number, midY: number, sign: string }[]>([]);

const currentSteps = computed(() => {
  return selectedProblem.value.steps.slice(0, currentStepIndex.value + 1);
});

// 随机化选项
const shuffledChoices = computed(() => {
  return [
    selectedProblem.value.parts.u,
    selectedProblem.value.parts.dv,
    selectedProblem.value.parts.trap
  ].sort(() => {
    // 固定的随机种子，基于题目 ID，保证切换题目时顺序变化但同一题目内稳定
    let hash = 0;
    for (let i = 0; i < selectedProblem.value.id.length; i++) {
      hash = selectedProblem.value.id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash % 2 ? 0.5 - Math.random() : Math.random() - 0.5;
  });
});

// 手动渲染 LaTeX
const renderMath = (tex: string, large = false) => {
  try {
    return katex.renderToString(tex, { 
      throwOnError: false, 
      displayMode: false,
      fontSize: large ? '1.5em' : '1.1em'
    });
  } catch (e) {
    return tex;
  }
};

const updateLines = async () => {
  await nextTick();
  setTimeout(() => {
    if (!containerRef.value || selectionMode.value) return;

    const tableWrapper = containerRef.value.querySelector('.di-table-container');
    const containerRect = tableWrapper?.getBoundingClientRect();
    if (!containerRect) return;

    const rows = containerRef.value.querySelectorAll('.di-table tbody tr');
    const newLines = [];

    for (let i = 0; i < currentStepIndex.value; i++) {
      const fromRow = rows[i];
      const toRow = rows[i + 1];
      
      const dCell = fromRow.querySelector('.col-d');
      const iCell = toRow.querySelector('.col-i');

      if (dCell && iCell) {
        const dRect = dCell.getBoundingClientRect();
        const iRect = iCell.getBoundingClientRect();
        
        const x1 = dRect.left + dRect.width / 2 - containerRect.left;
        const y1 = dRect.top + dRect.height / 2 - containerRect.top;
        const x2 = iRect.left + iRect.width / 2 - containerRect.left;
        const y2 = iRect.top + iRect.height / 2 - containerRect.top;
        
        // 缩减路径长度，避免箭头刺入文本
        const gap = 30;
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const nx1 = x1 + Math.cos(angle) * (gap - 5);
        const ny1 = y1 + Math.sin(angle) * (gap - 5);
        const nx2 = x2 - Math.cos(angle) * (gap + 5);
        const ny2 = y2 - Math.sin(angle) * (gap + 5);

        // 控制点取缩短后路径的中点并纵向偏移
        const cpX = (nx1 + nx2) / 2;
        const cpY = (ny1 + ny2) / 2; // 移除垂直偏移，使其成为直线中点
        
        newLines.push({
          path: `M ${nx1} ${ny1} L ${nx2} ${ny2}`, // 改为直线 L
          midX: cpX,
          midY: cpY,
          sign: selectedProblem.value.steps[i].sign
        });
      }
    }
    lines.value = newLines;
  }, 150);
};

const toggleFullscreen = async () => {
  if (!containerRef.value) return;
  try {
    if (!document.fullscreenElement) {
      await containerRef.value.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (err) {
    console.error("Fullscreen toggle failed", err);
  }
};

const checkChoice = async (choice: string) => {
  if (choice === selectedProblem.value.parts.u) {
    selectionFeedback.value = { type: 'success', msg: '选择正确！即刻开启沉浸推演...' };
    setTimeout(async () => {
      await toggleFullscreen();
      selectionMode.value = false;
      nextTick(updateLines);
    }, 800);
  } else if (choice === selectedProblem.value.parts.trap) {
    selectionFeedback.value = { 
      type: 'error', 
      msg: `扰乱项！该项并非当前 U 项的最佳候选。` 
    };
  } else {
    selectionFeedback.value = { 
      type: 'error', 
      msg: `根据 LIATE 原则，${selectedProblem.value.parts.u} 更适合求导。` 
    };
  }
};

const nextStep = () => {
  if (currentStepIndex.value < selectedProblem.value.steps.length - 1) {
    currentStepIndex.value++;
    updateLines();
  } else {
    isFinished.value = true;
  }
};

const reset = () => {
  currentStepIndex.value = 0;
  isFinished.value = false;
  selectionMode.value = true;
  selectionFeedback.value = { type: 'none', msg: '' };
  lines.value = [];
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
};

const changeProblem = (p: DIProblem) => {
  selectedProblem.value = p;
  reset();
};

let resizeObserver: ResizeObserver | null = null;

const handleFSChange = () => {
  isFullscreen.value = !!document.fullscreenElement;
  updateLines();
};

onMounted(() => {
  window.addEventListener('resize', updateLines);
  document.addEventListener('fullscreenchange', handleFSChange);
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(updateLines);
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateLines);
  document.removeEventListener('fullscreenchange', handleFSChange);
  resizeObserver?.disconnect();
});

watch(selectedProblem, () => {
  nextTick(updateLines);
});
</script>

<template>
  <div class="di-solver" :class="{ 'is-fullscreen': isFullscreen }" ref="containerRef">
    <!-- Exit Fullscreen Button -->
    <button v-if="isFullscreen" class="exit-fs-btn" @click="toggleFullscreen" title="退出全屏">
      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" fill="none" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>

    <div class="di-header">
      <div class="problem-selector" v-if="!isFullscreen">
        <button 
          v-for="p in problems" 
          :key="p.id"
          :class="{ active: selectedProblem.id === p.id }"
          @click="changeProblem(p)"
        >
          {{ p.title }}
        </button>
      </div>
      <div class="problem-display" :class="{ 'fs-title': isFullscreen }">
        <span class="label">当前课题：</span>
        <span v-html="renderMath(`\\int ${selectedProblem.parts.u} \\cdot ${selectedProblem.parts.dv} \\, \\mathrm{d}x`, isFullscreen)"></span>
      </div>
    </div>

    <transition name="slide-fade" mode="out-in">
      <!-- Stage 1: Selection -->
      <div v-if="selectionMode" class="selection-stage">
        <h3>💡 选角挑战</h3>
        <p>谁应该作为 <b>(D)erivate</b> 项以简化运算？</p>
        
        <div class="choice-container">
          <button 
            v-for="choice in shuffledChoices" 
            :key="choice"
            @click="checkChoice(choice)" 
            class="choice-card" 
            v-html="renderMath(choice, true)"
          ></button>
        </div>

        <div v-if="selectionFeedback.type !== 'none'" :class="['feedback-msg', selectionFeedback.type]">
          {{ selectionFeedback.msg }}
        </div>
      </div>

      <!-- Stage 2: Solver -->
      <div v-else class="di-main">
        <div class="di-table-area">
          <div class="di-table-container">
            <div class="table-scroll-wrapper">
              <table class="di-table">
                <thead>
                  <tr>
                    <th class="col-sign-head">Sign</th>
                    <th class="col-d-head">(D)erivate</th>
                    <th class="col-i-head">(I)ntegrate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(step, index) in currentSteps" :key="index" :class="{ 'step-entry': true, 'terminator': step.isTerminator }">
                    <td class="col-sign">{{ step.sign }}</td>
                    <td class="col-d" v-html="renderMath(step.derivative, isFullscreen)"></td>
                    <td class="col-i" v-html="renderMath(step.integral, isFullscreen)"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <svg class="di-arrows-overlay" v-if="lines.length > 0">
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                  <path d="M0,0 L8,4 L0,8 L1.5,4 Z" fill="var(--vp-c-brand)" />
                </marker>
              </defs>
              <g v-for="(line, idx) in lines" :key="idx">
                <path 
                  :d="line.path" 
                  stroke="var(--vp-c-brand)" 
                  stroke-width="2" 
                  fill="none"
                  marker-end="url(#arrowhead)"
                  class="draw-line"
                />
                <circle :cx="line.midX" :cy="line.midY - 15" r="10" fill="var(--vp-c-bg)" stroke="var(--vp-c-brand-soft)" stroke-width="1" />
                <text 
                  :x="line.midX" 
                  :y="line.midY - 11" 
                  fill="var(--vp-c-brand)" 
                  font-size="16" 
                  font-weight="bold"
                  text-anchor="middle"
                  class="line-sign-text"
                >
                  {{ line.sign }}
                </text>
              </g>
            </svg>
          </div>
        </div>

        <!-- Sidebar / Floating Guide -->
        <div class="di-sidebar">
          <div class="guide-box">
            <div class="guide-header">
              <span class="icon">✍️</span>
              <h3>推演引导</h3>
            </div>
            <transition name="fade" mode="out-in">
              <div :key="currentStepIndex" class="guide-content">
                <div v-if="currentStepIndex === 0">
                  <b>初始项：</b> 点击“下一步”观察 DI 的衍生过程。
                </div>
                <div v-else-if="!isFinished">
                  <b>推导中：</b> 进行第 {{ currentStepIndex }} 次迭代。左侧求导，右侧积分。
                </div>
                <div v-else>
                  <b>已完成！</b> 按照曲线箭头指示，将对应的项相乘并累加。
                </div>
              </div>
            </transition>
          </div>

          <div class="actions">
            <button class="btn-next" @click="nextStep" :disabled="isFinished">
              {{ isFinished ? '推导已终结' : '下一步 (Next)' }}
            </button>
            <button class="btn-reset" @click="reset">重置重选</button>
          </div>

          <transition name="fade">
            <div v-if="isFinished" class="result-box">
              <h4>最终解构：</h4>
              <div class="final-latex" v-html="renderMath(`= ${selectedProblem.result}`, isFullscreen)"></div>
            </div>
          </transition>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* --- 沉浸式全屏模式 --- */
.di-solver.is-fullscreen {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 10000;
  background: var(--vp-c-bg); /* 纯色背景更干净，或使用极淡的底色 */
  border-radius: 0;
  padding: 0; /* 移除内边距，交由内部容器控制 */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.exit-fs-btn {
  position: fixed; /* 固定在视口右上角 */
  top: 30px; right: 40px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  border-radius: 50%; /* 圆形按钮更优雅 */
  width: 56px; height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10002;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.exit-fs-btn:hover { 
  transform: rotate(90deg) scale(1.1); 
  background: var(--vp-c-bg-soft);
}

/* 全屏下的 Header */
.di-header {
  margin-bottom: 32px;
  transition: all 0.3s ease;
}
.is-fullscreen .di-header {
  padding: 60px 0 40px;
  background: var(--vp-c-bg);
  position: sticky; /* 标题不固定，随页面滚动，或者固定？这里选择随页面 */
  top: 0;
  z-index: 9000;
  width: 100%;
  text-align: center;
  border-bottom: 1px solid transparent; /* 预留滚动边框 */
}

/* 全屏下的内容区布局 */
.is-fullscreen .di-main {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 60px;
  width: 100%;
  max-width: 1200px; /* 显著收缩总宽，更紧凑 */
  margin: 0 auto;
  padding: 0 40px 100px;
  box-sizing: border-box;
}

.is-fullscreen .di-table-area {
  flex: 1;
  display: flex;
  justify-content: center;
}

.is-fullscreen .di-table-container {
  width: 100%;
  max-width: 720px; /* 压缩表格宽度，缩短箭头 */
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider-light);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.12);
  overflow: visible;
}

.is-fullscreen .di-sidebar {
  width: 320px; /* 进一步收窄侧边栏 */
  padding: 32px;
  background: var(--vp-c-bg-soft); /* 侧边栏底色稍深 */
  border-radius: 24px;
  box-shadow: none; /* 去掉阴影，让它看起来像镶嵌在背景里的 */
  border: 1px solid var(--vp-c-divider);
  position: sticky;
  top: 40px; /* 悬浮定位 */
  flex-shrink: 0;
}

/* 全屏下的字体放大 */
.fs-title {
  font-size: 2.4rem !important;
  margin-bottom: 0;
  justify-content: center;
  font-family: 'Times New Roman', serif; /* 数学公式用衬线体更有质感 */
}

/* --- 头部与选择器 --- */
.di-header {
  margin-bottom: 32px;
}

.problem-selector {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.problem-selector button {
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.3s ease;
}

.problem-selector button.active {
  background: var(--vp-c-brand);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--vp-c-brand-rgb), 0.3);
}

.problem-display {
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 15px;
}
.problem-display .label {
  font-size: 0.9rem;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* --- 选角阶段 --- */
.selection-stage {
  text-align: center;
  padding: 60px 20px;
  background: var(--vp-c-bg);
  border-radius: 20px;
  border: 2px dashed var(--vp-c-divider);
}

.choice-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 48px 0;
}

.choice-card {
  padding: 20px 30px;
  background: var(--vp-c-bg-alt);
  border: 2px solid var(--vp-c-divider);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  min-width: 140px;
  flex: 0 1 auto;
}
.choice-card:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-10px);
  background: var(--vp-c-bg-soft);
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
}

/* --- 推导表格区 --- */
.di-main {
  display: flex;
  gap: 40px;
}

@media (max-width: 960px) {
  .di-main { flex-direction: column; }
  .di-sidebar { width: 100% !important; }
}

.di-table-container {
  position: relative;
  background: var(--vp-c-bg);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
}

.di-table {
  width: 100%;
  border-collapse: collapse;
}

.di-table th {
  background: var(--vp-c-bg-alt);
  padding: 15px;
  font-size: 12px;
  letter-spacing: 1px;
  color: var(--vp-c-text-2);
  border-bottom: 2px solid var(--vp-c-divider);
}

.di-table td {
  padding: 40px 20px;
  text-align: center;
  border-bottom: 1px solid var(--vp-c-divider);
}

/* 全屏表格样式重构 */
.is-fullscreen .di-table-area,
.is-fullscreen .table-scroll-wrapper,
.is-fullscreen .di-table {
  width: 100% !important;
  min-width: 100% !important;
}

.is-fullscreen .di-table {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

/* 显式定义全屏下的列宽比例 */
.is-fullscreen .col-sign-head { width: 120px; }
.is-fullscreen .col-d-head { width: 45%; }
.is-fullscreen .col-i-head { width: 45%; }

.is-fullscreen .di-table td {
  padding: 45px 30px;
  font-size: 1.8rem;
  border-bottom: 1px solid var(--vp-c-divider-light);
  vertical-align: middle;
}

.is-fullscreen .di-table tr:nth-child(even) td {
  background: var(--vp-c-bg-soft) / 0.5; /* 极淡的条纹 */
}

.is-fullscreen .col-sign {
  font-size: 2.2rem;
  font-weight: bold;
}

.col-sign {
  font-size: 1.5rem;
  font-weight: 200;
  color: var(--vp-c-text-3);
  font-family: 'Inter', sans-serif;
}

/* --- SVG 连线系统 --- */
.di-arrows-overlay {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  pointer-events: none;
  z-index: 5;
}

.draw-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 0.8s cubic-bezier(0.45, 0, 0.55, 1) forwards;
}

@keyframes draw { to { stroke-dashoffset: 0; } }

/* --- 引导与控制 --- */
.di-sidebar {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.guide-box {
  background: var(--vp-c-brand-soft);
  padding: 24px;
  border-radius: 20px;
}
.guide-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}
.guide-header h3 { margin: 0; font-size: 16px; color: var(--vp-c-brand); }
.guide-content { font-size: 15px; line-height: 1.6; color: var(--vp-c-text-1); }

.actions {
  display: flex;
  gap: 15px;
}

.btn-next {
  flex: 1;
  padding: 16px;
  background: var(--vp-c-brand);
  color: #ffffff !important;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-next:hover:not(:disabled) { 
  transform: scale(1.02); 
  background: var(--vp-c-brand-1); 
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.btn-next:active:not(:disabled) {
  transform: scale(0.98);
  background: var(--vp-c-brand-2);
}
.btn-next:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-reset {
  padding: 16px 24px;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  cursor: pointer;
}

.result-box {
  background: var(--vp-c-bg-mute);
  padding: 24px;
  border-radius: 20px;
  border: 1px solid var(--vp-c-brand-soft);
}
.result-box h4 { margin: 0 0 10px 0; color: var(--vp-c-text-2); font-size: 14px; }
.final-latex { overflow-x: auto; padding: 10px 0; }

/* 动画过度 */
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.4s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateY(20px); }
.slide-fade-leave-to { opacity: 0; transform: translateY(-20px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>





