<template>
  <section ref="visualizerRef" class="cramer-visualizer" :class="{ fullscreen: isFullscreen }">
    <div class="visualizer-shell">
      <Transition name="fade-overlay">
        <div v-if="!isFullscreen" class="preview-overlay">
          <div class="launch-card">
            <div class="icon-box" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none">
                <path d="M4 18 9 7l5 8 6-11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4 18h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
                <circle cx="9" cy="7" r="1.6" fill="currentColor" />
                <circle cx="14" cy="15" r="1.6" fill="currentColor" />
              </svg>
            </div>
            <p class="eyebrow">Interactive model</p>
            <h3>克拉默法则面积演示</h3>
            <p>进入全屏后拖拽向量 b，观察 D1、D2 与解的变化。</p>
            <button class="primary-button" type="button" @click="toggleFullscreen">
              开启全屏演示
            </button>
          </div>
        </div>
      </Transition>

      <template v-if="isFullscreen">
        <div class="visualizer-topbar">
          <div>
            <p class="eyebrow">Interactive model</p>
            <h3>克拉默法则面积演示</h3>
          </div>
          <button class="mode-button" type="button" @click="toggleFullscreen">
            退出全屏
          </button>
        </div>

        <div class="visualizer-body">
          <div class="canvas-column">
            <div class="canvas-shell">
              <canvas
                ref="canvasRef"
                aria-label="克拉默法则面积比值交互图"
                @mousedown="startMouseDrag"
                @touchstart.prevent="startTouchDrag"
              />
            </div>
            <p class="interaction-hint">拖拽橙色向量 b 的端点，观察替换列面积与解的变化。</p>
          </div>

          <aside class="info-panel">
            <div class="panel-title">
              <span class="hex-icon" aria-hidden="true" />
              <h3>Cramer's Rule</h3>
            </div>

            <div class="math-card equation-panel">
              <span class="card-label">当前线性方程组</span>
              <div class="latex-block equation-system" aria-label="当前线性方程组" v-html="renderMath(equationLatex)" />
            </div>

            <div class="math-card rhs-card">
              <span class="card-label">右端项 RHS</span>
              <div class="latex-block vector-formula" v-html="renderMath(rhsLatex)" />
            </div>

            <div class="math-card determinant-card">
              <span class="card-label">行列式 面积</span>
              <div class="latex-block determinant-formulas" v-html="renderMath(determinantLatex)" />
            </div>

            <div class="math-card solution-card">
              <span class="card-label">求解结果 面积比值</span>
              <div class="latex-block solution-formula" v-html="renderMath(solutionLatex)" />
            </div>

            <div class="legend" aria-label="图例">
              <span><i class="base" />D 基准面积</span>
              <span><i class="first" />D1 / a1</span>
              <span><i class="second" />D2 / a2</span>
              <span><i class="rhs" />b 右端项</span>
            </div>
          </aside>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import katex from "katex";
import "katex/dist/katex.min.css";
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from "vue";

const visualizerRef = ref(null);
const canvasRef = ref(null);
const a1 = reactive({ x: 3, y: 1 });
const a2 = reactive({ x: 1, y: 3 });
const b = reactive({ x: 4, y: 4 });

const scale = ref(58);
const offset = reactive({ x: 0, y: 0 });
const isDragging = ref(false);
const isFullscreen = ref(false);
let ctx = null;

const determinants = computed(() => {
  const d = a1.x * a2.y - a1.y * a2.x;
  return {
    d,
    d1: b.x * a2.y - b.y * a2.x,
    d2: a1.x * b.y - a1.y * b.x,
  };
});

const solution = computed(() => ({
  x1: formatNumber(determinants.value.d1 / determinants.value.d),
  x2: formatNumber(determinants.value.d2 / determinants.value.d),
}));

const equationLatex = computed(() => String.raw`
\begin{cases}
\textcolor{#0b84ff}{${a1.x}}x_1+\textcolor{#22c55e}{${a2.x}}x_2=\textcolor{#f59e0b}{${b.x}}\\
\textcolor{#0b84ff}{${a1.y}}x_1+\textcolor{#22c55e}{${a2.y}}x_2=\textcolor{#f59e0b}{${b.y}}
\end{cases}
`);

const rhsLatex = computed(() => String.raw`
\boldsymbol{b}=
\begin{bmatrix}
\textcolor{#f59e0b}{${b.x}}\\
\textcolor{#f59e0b}{${b.y}}
\end{bmatrix}
`);

const determinantLatex = computed(() => String.raw`
\begin{aligned}
D_1&=
\begin{vmatrix}
\textcolor{#f59e0b}{${b.x}}&\textcolor{#22c55e}{${a2.x}}\\
\textcolor{#f59e0b}{${b.y}}&\textcolor{#22c55e}{${a2.y}}
\end{vmatrix}
=\textcolor{#0b84ff}{${determinants.value.d1}}
\quad
D_2=
\begin{vmatrix}
\textcolor{#0b84ff}{${a1.x}}&\textcolor{#f59e0b}{${b.x}}\\
\textcolor{#0b84ff}{${a1.y}}&\textcolor{#f59e0b}{${b.y}}
\end{vmatrix}
=\textcolor{#22c55e}{${determinants.value.d2}}\\[0.35em]
D&=
\begin{vmatrix}
\textcolor{#0b84ff}{${a1.x}}&\textcolor{#22c55e}{${a2.x}}\\
\textcolor{#0b84ff}{${a1.y}}&\textcolor{#22c55e}{${a2.y}}
\end{vmatrix}
=\textcolor{#ef4444}{${determinants.value.d}}
\end{aligned}
`);

const solutionLatex = computed(() => String.raw`
x_1=\frac{D_1}{D}=\textcolor{#0b84ff}{${solution.value.x1}}
\qquad
x_2=\frac{D_2}{D}=\textcolor{#22c55e}{${solution.value.x2}}
`);

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function renderMath(tex) {
  return katex.renderToString(tex, {
    displayMode: true,
    throwOnError: false,
    trust: false,
    strict: "ignore",
  });
}

function handleFullscreenChange() {
  isFullscreen.value = document.fullscreenElement === visualizerRef.value;
  if (isFullscreen.value) {
    nextTick(() => requestAnimationFrame(resize));
  } else {
    ctx = null;
  }
}

function resize() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.parentElement.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const baseScale = Math.min(rect.width / 9.5, rect.height / 7.5);
  scale.value = Math.max(34, Math.min(78, baseScale));
  offset.x = rect.width < 560 ? rect.width * 0.26 : rect.width * 0.24;
  offset.y = rect.height * 0.72;
  draw();
}

async function toggleFullscreen() {
  const el = visualizerRef.value;
  if (!el) return;

  if (!document.fullscreenElement) {
    await el.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
}

function toScreen(x, y) {
  return {
    x: offset.x + x * scale.value,
    y: offset.y - y * scale.value,
  };
}

function toMath(clientX, clientY) {
  if (!canvasRef.value) return { x: 0, y: 0 };
  const rect = canvasRef.value.getBoundingClientRect();
  return {
    x: (clientX - rect.left - offset.x) / scale.value,
    y: -(clientY - rect.top - offset.y) / scale.value,
  };
}

function startMouseDrag(event) {
  startDrag(event.clientX, event.clientY);
}

function startTouchDrag(event) {
  const touch = event.touches[0];
  startDrag(touch.clientX, touch.clientY);
}

function startDrag(clientX, clientY) {
  const point = toMath(clientX, clientY);
  const distance = Math.hypot(point.x - b.x, point.y - b.y);
  isDragging.value = distance < 0.45;
}

function handleMove(event) {
  if (!isDragging.value) return;
  const source = event.touches ? event.touches[0] : event;
  const point = toMath(source.clientX, source.clientY);
  b.x = Math.max(-2, Math.min(7, Math.round(point.x)));
  b.y = Math.max(-1, Math.min(7, Math.round(point.y)));
  draw();
}

function endDrag() {
  isDragging.value = false;
}

function drawGrid(width, height) {
  const isDark = document.documentElement.classList.contains("dark");
  ctx.strokeStyle = isDark ? "rgba(148, 163, 184, 0.10)" : "rgba(25, 39, 52, 0.08)";
  ctx.lineWidth = 1;

  for (let i = -8; i <= 12; i += 1) {
    const vertical = toScreen(i, 0);
    ctx.beginPath();
    ctx.moveTo(vertical.x, 0);
    ctx.lineTo(vertical.x, height);
    ctx.stroke();

    const horizontal = toScreen(0, i);
    ctx.beginPath();
    ctx.moveTo(0, horizontal.y);
    ctx.lineTo(width, horizontal.y);
    ctx.stroke();
  }

  const origin = toScreen(0, 0);
  ctx.strokeStyle = isDark ? "rgba(226, 232, 240, 0.32)" : "rgba(25, 39, 52, 0.28)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, origin.y);
  ctx.lineTo(width, origin.y);
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x, height);
  ctx.stroke();
}

function drawParallelogram(v1, v2, fill, stroke) {
  const p1 = toScreen(0, 0);
  const p2 = toScreen(v1.x, v1.y);
  const p3 = toScreen(v1.x + v2.x, v1.y + v2.y);
  const p4 = toScreen(v2.x, v2.y);

  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.lineTo(p3.x, p3.y);
  ctx.lineTo(p4.x, p4.y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawVector(vector, color, label, draggable = false) {
  const origin = toScreen(0, 0);
  const tip = toScreen(vector.x, vector.y);
  const angle = Math.atan2(origin.y - tip.y, tip.x - origin.x);
  const head = 14;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(tip.x, tip.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(tip.x, tip.y);
  ctx.lineTo(tip.x - head * Math.cos(angle - Math.PI / 6), tip.y + head * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(tip.x - head * Math.cos(angle + Math.PI / 6), tip.y + head * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();

  ctx.font = "700 18px Inter, sans-serif";
  ctx.fillText(label, tip.x + 10, tip.y - 10);

  if (draggable) {
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function draw() {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  ctx.clearRect(0, 0, width, height);
  drawGrid(width, height);
  const isDark = document.documentElement.classList.contains("dark");
  drawParallelogram(a1, a2, isDark ? "rgba(239, 68, 68, 0.18)" : "rgba(239, 68, 68, 0.14)", "rgba(239, 68, 68, 0.42)");
  drawParallelogram(b, a2, isDark ? "rgba(14, 165, 233, 0.22)" : "rgba(14, 165, 233, 0.18)", "rgba(14, 165, 233, 0.48)");
  drawParallelogram(a1, b, isDark ? "rgba(34, 197, 94, 0.18)" : "rgba(34, 197, 94, 0.15)", "rgba(34, 197, 94, 0.42)");
  drawVector(a1, "#0ea5e9", "a1");
  drawVector(a2, "#22c55e", "a2");
  drawVector(b, "#f59e0b", "b", true);
}

onMounted(() => {
  window.addEventListener("resize", resize);
  window.addEventListener("mousemove", handleMove);
  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchmove", handleMove, { passive: false });
  window.addEventListener("touchend", endDrag);
  document.addEventListener("fullscreenchange", handleFullscreenChange);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  window.removeEventListener("mousemove", handleMove);
  window.removeEventListener("mouseup", endDrag);
  window.removeEventListener("touchmove", handleMove);
  window.removeEventListener("touchend", endDrag);
  document.removeEventListener("fullscreenchange", handleFullscreenChange);
});
</script>

<style scoped>
.cramer-visualizer {
  margin: 32px 0;
  --cramer-surface: #ffffff;
  --cramer-surface-soft: #f8fafc;
  --cramer-border: rgba(15, 23, 42, 0.1);
  --cramer-text: #0f172a;
  --cramer-muted: #64748b;
  --cramer-grid-bg: #f8fbff;
}

:global(.dark) .cramer-visualizer {
  --cramer-surface: #101923;
  --cramer-surface-soft: #0b1420;
  --cramer-border: rgba(148, 163, 184, 0.2);
  --cramer-text: #e5eef8;
  --cramer-muted: #9aa9ba;
  --cramer-grid-bg: #0f1d29;
}

.visualizer-shell {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 320px;
  overflow: hidden;
  border: 1px solid var(--cramer-border);
  border-radius: 20px;
  background: var(--cramer-surface);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06);
}

:global(.dark) .visualizer-shell {
  box-shadow: none;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background:
    radial-gradient(circle at 18% 18%, rgba(14, 165, 233, 0.10), transparent 28%),
    linear-gradient(135deg, var(--cramer-surface-soft), var(--cramer-surface));
}

.launch-card {
  width: min(380px, 100%);
  padding: 36px 32px;
  border: 1px solid var(--cramer-border);
  border-radius: 18px;
  background: color-mix(in srgb, var(--cramer-surface) 94%, transparent);
  box-shadow: 0 22px 60px rgba(15, 23, 42, 0.10);
  text-align: center;
}

:global(.dark) .launch-card {
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.28);
}

.icon-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  margin-bottom: 18px;
  border-radius: 16px;
  background: rgba(14, 165, 233, 0.10);
  color: #0ea5e9;
}

.eyebrow {
  margin: 0 0 4px !important;
  color: var(--vp-c-brand-1);
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.2 !important;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.launch-card h3,
.visualizer-topbar h3 {
  margin: 0 !important;
  border: 0 !important;
  color: var(--cramer-text);
  font-size: 1.15rem;
  line-height: 1.4;
}

.launch-card h3 {
  margin-top: 8px !important;
  margin-bottom: 10px !important;
}

.launch-card p:not(.eyebrow) {
  max-width: 280px;
  margin: 0 auto 22px !important;
  color: var(--cramer-muted);
  font-size: 0.9rem;
  line-height: 1.7 !important;
}

.primary-button,
.mode-button {
  min-height: 44px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
}

.primary-button {
  border: 0;
  background: #2563eb;
  color: #ffffff;
  padding: 11px 22px;
  font-size: 0.92rem;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.22);
}

.primary-button:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(37, 99, 235, 0.28);
}

.visualizer-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  gap: 16px;
  min-height: 92px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--cramer-border);
  background: linear-gradient(180deg, var(--cramer-surface) 0%, var(--cramer-surface-soft) 100%);
}

.mode-button {
  flex: 0 0 auto;
  border: 1px solid rgba(14, 165, 233, 0.35);
  background: rgba(14, 165, 233, 0.08);
  color: var(--vp-c-brand-1);
  padding: 8px 14px;
  font-size: 0.84rem;
}

.mode-button:hover {
  background: rgba(14, 165, 233, 0.14);
}

.visualizer-body {
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: minmax(0, 1fr) minmax(390px, 440px);
  gap: 24px;
  padding: 18px 20px 16px;
  background: var(--cramer-surface-soft);
}

.canvas-column {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
}

.canvas-shell {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--cramer-border);
  border-radius: 8px;
  background: var(--cramer-grid-bg);
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
}

.interaction-hint {
  margin: 10px 2px 0;
  color: var(--cramer-muted);
  font-size: 0.86rem;
  line-height: 1.6;
}

.info-panel {
  display: flex;
  min-width: 0;
  max-height: 100%;
  overflow: auto;
  flex-direction: column;
  gap: 8px;
  padding: 0 4px 8px;
  overscroll-behavior: contain;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 2px 2px;
}

.hex-icon {
  width: 22px;
  height: 22px;
  background: #0b84ff;
  clip-path: polygon(50% 0, 92% 25%, 92% 75%, 50% 100%, 8% 75%, 8% 25%);
}

.panel-title h3 {
  margin: 0;
  border: 0;
  color: var(--cramer-text);
  font-size: 1.35rem;
  font-weight: 800;
  line-height: 1.2;
}

.math-card {
  position: relative;
  flex: 0 0 auto;
  overflow: visible;
  border: 1px solid var(--cramer-border);
  border-radius: 18px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--cramer-surface) 98%, transparent), var(--cramer-surface)),
    var(--cramer-surface);
  box-shadow: 0 16px 34px rgba(15, 23, 42, 0.05);
}

:global(.dark) .math-card {
  box-shadow: none;
}

.math-card::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  content: "";
}

.equation-panel::before {
  background: #0b84ff;
}

.rhs-card::before {
  background: #f59e0b;
}

.determinant-card::before {
  background: #ef4444;
}

.solution-card::before {
  background: #0ea5e9;
}

.card-label {
  display: block;
  margin-bottom: 8px;
  color: var(--cramer-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.equation-panel,
.rhs-card,
.determinant-card,
.solution-card {
  padding: 14px 18px;
}

.equation-system,
.vector-formula,
.determinant-formulas,
.solution-formula {
  color: var(--cramer-text);
  font-size: 1rem;
  line-height: 1.3;
}

.latex-block {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.latex-block :deep(.katex-display) {
  width: 100%;
  margin: 0 !important;
  overflow: visible;
  text-align: center;
}

.latex-block :deep(.katex) {
  color: var(--cramer-text);
  font-size: 1.08em;
  line-height: 1.25;
}

.equation-system {
  min-height: 48px;
}

.vector-formula,
.solution-formula {
  min-height: 42px;
}

.determinant-formulas :deep(.katex) {
  font-size: 0.92em;
}

.solution-formula :deep(.katex) {
  font-size: 1em;
}

.legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 12px;
  color: var(--cramer-muted);
  font-size: 0.86rem;
  padding: 0 4px;
}

.legend span {
  display: flex;
  align-items: center;
  gap: 7px;
}

.legend i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.base { background: #ef4444; }
.first { background: #0ea5e9; }
.second { background: #22c55e; }
.rhs { background: #f59e0b; }

.cramer-visualizer.fullscreen {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 20px;
  background: var(--vp-c-bg);
  box-sizing: border-box;
}

.cramer-visualizer.fullscreen .visualizer-shell {
  display: flex;
  height: 100%;
  flex-direction: column;
  border-radius: 0;
  aspect-ratio: auto;
}

@media (max-width: 920px) {
  .visualizer-shell {
    aspect-ratio: 1 / 1.12;
  }

  .cramer-visualizer.fullscreen {
    overflow: auto;
  }

  .cramer-visualizer.fullscreen .visualizer-body {
    grid-template-columns: 1fr;
  }

  .info-panel {
    max-height: none;
    overflow: visible;
  }
}

@media (max-width: 560px) {
  .visualizer-shell {
    aspect-ratio: 1 / 1.25;
    min-height: 360px;
  }

  .preview-overlay {
    padding: 18px;
  }

  .launch-card {
    padding: 28px 22px;
  }

  .visualizer-topbar {
    align-items: start;
    flex-direction: column;
  }

  .visualizer-body {
    padding: 14px;
  }

  .equation-panel,
  .rhs-card,
  .determinant-card,
  .solution-card {
    padding: 20px 18px;
  }

  .equation-system,
  .vector-formula,
  .determinant-formulas,
  .solution-formula {
    font-size: 1.12rem;
  }

  .solution-formula {
    grid-template-columns: 1fr;
  }

  .legend {
    grid-template-columns: 1fr;
  }
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
  transition: opacity 220ms ease;
}

.fade-overlay-enter-from,
.fade-overlay-leave-to {
  opacity: 0;
}
</style>
