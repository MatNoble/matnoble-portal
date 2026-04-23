<template>
  <div class="matrix-demo-container" :class="{ 'fullscreen': isFullscreen }">
    <button v-if="isFullscreen" class="close-fullscreen-btn" @click="toggleFullscreen">×</button>
    <div class="controls">
      <h3>初等行变换演示</h3>
      <div class="btn-group">
        <button @click="swapRows(0, 1)">互换 r<sub>1</sub> ↔ r<sub>2</sub></button>
        <button @click="multiplyRow(1, 3)">倍乘 r<sub>2</sub> × 3</button>
        <button @click="addRow(0, 2, -2)">倍加 r<sub>3</sub> - 2r<sub>1</sub></button>
        <button @click="reset" class="secondary">重置</button>
        <button @click="toggleFullscreen" class="secondary" title="全屏演示以获得最佳体验">
          {{ isFullscreen ? '退出全屏' : '全屏演示' }}
        </button>
      </div>
      <div class="status-msg" v-html="statusMessage"></div>
    </div>

    <div class="matrix-wrapper">
      <div class="matrix-bracket left"></div>
      <div class="matrix" :style="{ width: cols * cellWidth + 'px', height: rows * cellHeight + 'px' }">
        <div
          v-for="cell in cells"
          :key="cell.id"
          class="matrix-cell"
          :class="{ 'highlight-primary': cell.row === activeRow1, 'highlight-secondary': cell.row === activeRow2 }"
          :style="{
            transform: `translate(${cell.col * cellWidth}px, ${cell.row * cellHeight}px)`,
            width: cellWidth + 'px',
            height: cellHeight + 'px'
          }"
        >
          <span class="cell-content" :class="{ 'pulse': isPulsing(cell.id) }">
            {{ cell.val }}
          </span>
        </div>

        <!-- Ghost Row for Addition Animation -->
        <div
          v-if="ghostRow"
          class="ghost-row"
          :style="{
            transform: `translate(0px, ${ghostRow.visualRow * cellHeight}px)`,
            width: cols * cellWidth + 'px',
            height: cellHeight + 'px'
          }"
        >
          <div
            v-for="(val, colIndex) in ghostRow.values"
            :key="colIndex"
            class="ghost-cell"
            :style="{
              width: cellWidth + 'px',
              height: cellHeight + 'px',
              left: colIndex * cellWidth + 'px'
            }"
          >
            {{ val }}
          </div>
        </div>
      </div>
      <div class="matrix-bracket right"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rows = 3
const cols = 3
const cellWidth = 80
const cellHeight = 60

// 课件中的习题矩阵
const initialData = [
  [1, 0, 1],
  [2, 1, 0],
  [-3, 2, -5]
]

const createCells = () => {
  const result = []
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result.push({
        id: `c-${i}-${j}`,
        val: initialData[i][j],
        row: i,
        col: j
      })
    }
  }
  return result
}

const cells = ref(createCells())
const activeRow1 = ref(null)
const activeRow2 = ref(null)
const pulsingCells = ref(new Set())
const statusMessage = ref('请选择一种初等变换进行演示')
const ghostRow = ref(null)
const isFullscreen = ref(false)

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const reset = () => {
  cells.value = createCells()
  activeRow1.value = null
  activeRow2.value = null
  statusMessage.value = '矩阵已重置'
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const isPulsing = (id) => pulsingCells.value.has(id)

const swapRows = async (r1, r2) => {
  statusMessage.value = `执行互换：r<sub>${r1+1}</sub> ↔ r<sub>${r2+1}</sub> (对应左乘初等矩阵 E<sub>${r1+1}${r2+1}</sub>)`
  activeRow1.value = r1
  activeRow2.value = r2
  await sleep(600) // Highlight delay

  // Swap row indices for animation
  cells.value.forEach(cell => {
    if (cell.row === r1) {
      cell.row = r2
    } else if (cell.row === r2) {
      cell.row = r1
    }
  })

  await sleep(800) // Wait for animation
  activeRow1.value = null
  activeRow2.value = null
}

const multiplyRow = async (r, k) => {
  statusMessage.value = `执行倍乘：r<sub>${r+1}</sub> × ${k} (对应左乘初等矩阵 E<sub>${r+1}</sub>(${k}))`
  activeRow1.value = r
  await sleep(600)

  // Trigger pulse animation and update values
  const idsToPulse = new Set()
  cells.value.forEach(cell => {
    if (cell.row === r) {
      cell.val = cell.val * k
      idsToPulse.add(cell.id)
    }
  })
  pulsingCells.value = idsToPulse

  await sleep(600)
  pulsingCells.value = new Set()
  activeRow1.value = null
}

const addRow = async (sourceR, targetR, k) => {
  statusMessage.value = `执行倍加：r<sub>${targetR+1}</sub> + (${k}) × r<sub>${sourceR+1}</sub> (对应左乘 E<sub>${targetR+1}${sourceR+1}</sub>(${k}))`
  activeRow1.value = sourceR
  activeRow2.value = targetR
  
  await sleep(600)

  // Create ghost row
  const sourceCells = cells.value.filter(c => c.row === sourceR).sort((a,b) => a.col - b.col)
  const ghostValues = sourceCells.map(c => {
    return k === 1 ? c.val : `${k}×(${c.val})`
  })
  
  ghostRow.value = {
    visualRow: sourceR,
    values: ghostValues
  }

  // Animate ghost row moving
  await sleep(100) // render tick
  ghostRow.value.visualRow = targetR

  await sleep(800) // travel time

  // Add to target cells
  cells.value.forEach(cell => {
    if (cell.row === targetR) {
      const sourceVal = sourceCells.find(sc => sc.col === cell.col).val
      cell.val += sourceVal * k
      pulsingCells.value.add(cell.id)
    }
  })

  ghostRow.value = null
  await sleep(600)
  pulsingCells.value = new Set()
  activeRow1.value = null
  activeRow2.value = null
}
</script>

<style scoped>
.matrix-demo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: all 0.3s ease;
}

.matrix-demo-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  margin: 0;
  border-radius: 0;
  background: var(--vp-c-bg);
  justify-content: center;
  align-items: center;
  overflow: auto;
}

.close-fullscreen-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  color: var(--vp-c-text-1);
  font-size: 2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  padding: 0;
}

.close-fullscreen-btn:hover {
  background: var(--vp-c-bg-mute);
}

.controls {
  text-align: center;
  margin-bottom: 2rem;
}

.controls h3 {
  margin-top: 0;
  color: #003f88;
  font-weight: 600;
}

.btn-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1rem;
}

button {
  padding: 8px 18px;
  background: #003f88;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.95rem;
}

button:hover {
  background: #004da1;
}

button.secondary {
  background: #e5e7eb;
  color: #374151;
}

button.secondary:hover {
  background: #d1d5db;
}

button:active {
  transform: scale(0.96);
}

.status-msg {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  min-height: 1.5em;
  font-family: var(--vp-font-family-mono);
}

.matrix-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0 24px;
}

.matrix-bracket {
  width: 16px;
  height: calc(100% + 20px);
  position: absolute;
  top: -10px;
  border: 3px solid var(--vp-c-text-1);
  border-radius: 4px;
}

.matrix-bracket.left {
  left: 0;
  border-right: none;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.matrix-bracket.right {
  right: 0;
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.matrix {
  position: relative;
}

.matrix-cell {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.3s;
  border-radius: 8px;
}

.cell-content {
  display: inline-block;
  transition: transform 0.3s, color 0.3s;
}

.cell-content.pulse {
  animation: pop 0.6s ease-out;
  color: #e63946;
}

.highlight-primary {
  background-color: rgba(0, 63, 136, 0.15);
}

.highlight-secondary {
  background-color: rgba(42, 157, 143, 0.15);
}

.ghost-row {
  position: absolute;
  left: 0;
  display: flex;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  pointer-events: none;
  background-color: rgba(230, 57, 70, 0.15);
  border-radius: 8px;
  z-index: 10;
}

.ghost-cell {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  color: #e63946;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  opacity: 0.9;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.6); }
  100% { transform: scale(1); }
}

/* Dark mode support in VitePress */
:root.dark .matrix-demo-container {
  background: var(--vp-c-bg-mute);
}

:root.dark button {
  background: #4cc9f0;
  color: #1a1a1a;
  font-weight: 600;
}

:root.dark button:hover {
  background: #3ab1d6;
}

:root.dark button.secondary {
  background: #3a3a3a;
  color: #e0e0e0;
}

:root.dark button.secondary:hover {
  background: #4a4a4a;
}

:root.dark .controls h3 {
  color: #4cc9f0;
}

:root.dark .highlight-primary {
  background-color: rgba(76, 201, 240, 0.2);
}

:root.dark .highlight-secondary {
  background-color: rgba(42, 157, 143, 0.25);
}

:root.dark .cell-content.pulse {
  color: #ff5c6a;
}

:root.dark .ghost-row {
  background-color: rgba(255, 92, 106, 0.2);
}

:root.dark .ghost-cell {
  color: #ff5c6a;
}

/* Fullscreen Typography Adjustments */
.matrix-demo-container.fullscreen .controls h3 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
}

.matrix-demo-container.fullscreen button {
  font-size: 1.1rem;
  padding: 10px 24px;
}

.matrix-demo-container.fullscreen .status-msg {
  font-size: 1.2rem;
  margin-top: 1rem;
}
</style>
