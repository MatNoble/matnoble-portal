<template>
  <div class="lr-demo-container" :class="{ 'fullscreen': isFullscreen }">
    <button v-if="isFullscreen" class="close-fullscreen-btn" @click="toggleFullscreen">×</button>
    <div class="controls">
      <h3>左乘 vs 右乘 对比演示</h3>
      <div class="btn-group">
        <button @click="doSwap(0, 1)">演示互换 E<sub>12</sub></button>
        <button @click="doAdd(2, 0, -2)">演示倍加 E<sub>31</sub>(-2)</button>
        <button @click="reset" class="secondary">重置</button>
        <button @click="toggleFullscreen" class="secondary" title="全屏演示以获得最佳体验">
          {{ isFullscreen ? '退出全屏' : '全屏演示' }}
        </button>
      </div>
      <div class="status-msg" v-html="statusMessage"></div>
    </div>

    <div class="split-view">
      <!-- 左乘区域 -->
      <div class="side-panel">
        <div class="panel-header">
          <h4>左乘 (行变换)</h4>
          <span class="formula">E · A</span>
        </div>
        <div class="equation-stage">
          <div class="matrix-wrapper e-wrapper" :class="{ 'impact-right': animState === 1 }">
            <div class="matrix-bracket left"></div>
            <div class="matrix" :style="{ width: cols * cellWidth + 'px', height: rows * cellHeight + 'px' }">
              <div v-for="(row, r) in eLeft" :key="'el-r-'+r" class="matrix-row">
                <div v-for="(val, c) in row" :key="'el-c-'+c" class="static-cell"
                     :style="{ width: cellWidth + 'px', height: cellHeight + 'px', top: r*cellHeight+'px', left: c*cellWidth+'px' }">
                  {{ val }}
                </div>
              </div>
            </div>
            <div class="matrix-bracket right"></div>
          </div>
          
          <div class="op-sign">·</div>

          <div class="matrix-wrapper a-wrapper">
            <div class="matrix-bracket left"></div>
            <div class="matrix" :style="{ width: cols * cellWidth + 'px', height: rows * cellHeight + 'px' }">
              <div
                v-for="cell in aLeftCells"
                :key="cell.id"
                class="anim-cell"
                :class="{ 'highlight-row': isHighlighting && activeRowsLeft.includes(cell.row) }"
                :style="{
                  transform: `translate(${cell.col * cellWidth}px, ${cell.row * cellHeight}px)`,
                  width: cellWidth + 'px', height: cellHeight + 'px'
                }"
              >
                <span :class="{'pulse': isPulsingLeft(cell.id)}">{{ cell.val }}</span>
              </div>
              
              <!-- Left Ghost Row (for row addition) -->
              <div v-if="ghostLeft" class="ghost-group row-ghost"
                   :style="{ transform: `translate(0px, ${ghostLeft.visualRow * cellHeight}px)` }">
                <div v-for="(val, colIndex) in ghostLeft.values" :key="colIndex" class="ghost-cell"
                     :style="{ width: cellWidth + 'px', height: cellHeight + 'px', left: colIndex * cellWidth + 'px' }">
                  {{ val }}
                </div>
              </div>
            </div>
            <div class="matrix-bracket right"></div>
          </div>
        </div>
        <div class="outcome-label" :class="{'visible': animState >= 2}">
          相当于对 A 执行 <strong class="color-row">行操作</strong>
        </div>
      </div>

      <!-- 右乘区域 -->
      <div class="side-panel">
        <div class="panel-header">
          <h4>右乘 (列变换)</h4>
          <span class="formula">A · E</span>
        </div>
        <div class="equation-stage">
          <div class="matrix-wrapper a-wrapper">
            <div class="matrix-bracket left"></div>
            <div class="matrix" :style="{ width: cols * cellWidth + 'px', height: rows * cellHeight + 'px' }">
              <div
                v-for="cell in aRightCells"
                :key="cell.id"
                class="anim-cell"
                :class="{ 'highlight-col': isHighlighting && activeColsRight.includes(cell.col) }"
                :style="{
                  transform: `translate(${cell.col * cellWidth}px, ${cell.row * cellHeight}px)`,
                  width: cellWidth + 'px', height: cellHeight + 'px'
                }"
              >
                <span :class="{'pulse': isPulsingRight(cell.id)}">{{ cell.val }}</span>
              </div>
              
              <!-- Right Ghost Column (for column addition) -->
              <div v-if="ghostRight" class="ghost-group col-ghost"
                   :style="{ transform: `translate(${ghostRight.visualCol * cellWidth}px, 0px)` }">
                <div v-for="(val, rowIndex) in ghostRight.values" :key="rowIndex" class="ghost-cell"
                     :style="{ width: cellWidth + 'px', height: cellHeight + 'px', top: rowIndex * cellHeight + 'px' }">
                  {{ val }}
                </div>
              </div>
            </div>
            <div class="matrix-bracket right"></div>
          </div>

          <div class="op-sign">·</div>

          <div class="matrix-wrapper e-wrapper" :class="{ 'impact-left': animState === 1 }">
            <div class="matrix-bracket left"></div>
            <div class="matrix" :style="{ width: cols * cellWidth + 'px', height: rows * cellHeight + 'px' }">
              <div v-for="(row, r) in eRight" :key="'er-r-'+r" class="matrix-row">
                <div v-for="(val, c) in row" :key="'er-c-'+c" class="static-cell"
                     :style="{ width: cellWidth + 'px', height: cellHeight + 'px', top: r*cellHeight+'px', left: c*cellWidth+'px' }">
                  {{ val }}
                </div>
              </div>
            </div>
            <div class="matrix-bracket right"></div>
          </div>
        </div>
        <div class="outcome-label" :class="{'visible': animState >= 2}">
          相当于对 A 执行 <strong class="color-col">列操作</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const rows = 3
const cols = 3
const cellWidth = 55
const cellHeight = 45

const initialData = [
  [1, 0, 1],
  [2, 1, 0],
  [-3, 2, -5]
]

const createIdentity = () => [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
]

const createCells = (prefix) => {
  const result = []
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      result.push({
        id: `${prefix}-${i}-${j}`,
        val: initialData[i][j],
        row: i,
        col: j
      })
    }
  }
  return result
}

const aLeftCells = ref(createCells('L'))
const aRightCells = ref(createCells('R'))
const eLeft = ref(createIdentity())
const eRight = ref(createIdentity())

// 0: idle, 1: E sliding, 2: A transforming, 3: done
const animState = ref(0)
const statusMessage = ref('准备就绪')
const isFullscreen = ref(false)

const isHighlighting = ref(false)
const activeRowsLeft = ref([])
const activeColsRight = ref([])

const pulsingLeft = ref(new Set())
const pulsingRight = ref(new Set())
const ghostLeft = ref(null)
const ghostRight = ref(null)

const isPulsingLeft = (id) => pulsingLeft.value.has(id)
const isPulsingRight = (id) => pulsingRight.value.has(id)

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const reset = () => {
  aLeftCells.value = createCells('L')
  aRightCells.value = createCells('R')
  eLeft.value = createIdentity()
  eRight.value = createIdentity()
  animState.value = 0
  isHighlighting.value = false
  activeRowsLeft.value = []
  activeColsRight.value = []
  statusMessage.value = '矩阵已重置'
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.body.style.overflow = 'hidden' // prevent body scrolling
  } else {
    document.body.style.overflow = ''
  }
}

// Play the "E hits A" animation sequence
const playImpactSequence = async () => {
  animState.value = 1
  await sleep(700) // wait for slide to complete
  animState.value = 2 // E disappears
  await sleep(100)
}

const doSwap = async (i, j) => {
  if (animState.value !== 0) {
    reset()
    await sleep(50)
  }
  
  statusMessage.value = `执行互换演示：E<sub>${i+1}${j+1}</sub>`
  
  // Setup E matrices for swap
  let I1 = createIdentity(); let I2 = createIdentity();
  let tempRow = I1[i]; I1[i] = I1[j]; I1[j] = tempRow;
  let tempRow2 = I2[i]; I2[i] = I2[j]; I2[j] = tempRow2;
  eLeft.value = I1; eRight.value = I2;

  // Highlight targets
  isHighlighting.value = true
  activeRowsLeft.value = [i, j]
  activeColsRight.value = [i, j]
  
  await sleep(800) // let user see E matrix
  await playImpactSequence()

  // Transform A Left (Row Swap)
  aLeftCells.value.forEach(cell => {
    if (cell.row === i) cell.row = j
    else if (cell.row === j) cell.row = i
  })

  // Transform A Right (Col Swap)
  aRightCells.value.forEach(cell => {
    if (cell.col === i) cell.col = j
    else if (cell.col === j) cell.col = i
  })

  await sleep(800)
  animState.value = 3
  isHighlighting.value = false
}

const doAdd = async (target, source, k) => {
  if (animState.value !== 0) {
    reset()
    await sleep(50)
  }
  
  statusMessage.value = `执行倍加演示：E<sub>${target+1}${source+1}</sub>(${k})`
  
  // Setup E matrices for add
  let I1 = createIdentity(); let I2 = createIdentity();
  I1[target][source] = k;
  I2[target][source] = k; // Note: for E_ij(k), it's the same matrix
  eLeft.value = I1; eRight.value = I2;

  isHighlighting.value = true
  activeRowsLeft.value = [source, target]
  // Right side column addition: target col receives from source col
  activeColsRight.value = [source, target]
  
  await sleep(800)
  await playImpactSequence()

  // ---- Left Side (Row Add) ghost ----
  const sourceCellsL = aLeftCells.value.filter(c => c.row === source).sort((a,b) => a.col - b.col)
  ghostLeft.value = { visualRow: source, values: sourceCellsL.map(c => `${k}×(${c.val})`) }
  
  // ---- Right Side (Col Add) ghost ----
  // Right multiplication by E_{target,source}(k) adds k*(source column) to (target column) 
  // Wait, E_31(-2):
  // (A * E)_31 -> Column 1 gets added -2 * Column 3?
  // Let's verify: A = [C1 C2 C3]. E_31(-2) = [1 0 0; 0 1 0; -2 0 1]
  // A * E = [C1-2C3, C2, C3]. So target column is 1, source column is 3.
  // This is because right multiplication by E_ij(k) adds k*(row i) to (row j) for the IDENTITY, 
  // which translates to adding k*(col i) to (col j) of A!
  // E_31(-2) has -2 at row 3, col 1. So it adds -2 * C3 to C1.
  // sourceCol = row index in E = 2 (which is 3rd col). targetCol = col index in E = 0 (which is 1st col).
  const sourceCol = target
  const targetCol = source
  const sourceCellsR = aRightCells.value.filter(c => c.col === sourceCol).sort((a,b) => a.row - b.row)
  ghostRight.value = { visualCol: sourceCol, values: sourceCellsR.map(c => `${k}×(${c.val})`) }

  await sleep(50) // DOM render
  ghostLeft.value.visualRow = target
  ghostRight.value.visualCol = targetCol

  await sleep(800)

  // Apply values
  let leftPulses = new Set(); let rightPulses = new Set()
  
  aLeftCells.value.forEach(cell => {
    if (cell.row === target) {
      cell.val += sourceCellsL.find(sc => sc.col === cell.col).val * k
      leftPulses.add(cell.id)
    }
  })
  
  aRightCells.value.forEach(cell => {
    if (cell.col === targetCol) {
      cell.val += sourceCellsR.find(sc => sc.row === cell.row).val * k
      rightPulses.add(cell.id)
    }
  })

  pulsingLeft.value = leftPulses
  pulsingRight.value = rightPulses

  ghostLeft.value = null
  ghostRight.value = null
  
  await sleep(600)
  pulsingLeft.value = new Set()
  pulsingRight.value = new Set()
  animState.value = 3
  isHighlighting.value = false
}
</script>

<style scoped>
.lr-demo-container {
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  position: relative;
  transition: all 0.3s ease;
}

.lr-demo-container.fullscreen {
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
  padding: 8px 16px;
  background: #003f88;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.9rem;
}

button:hover { background: #004da1; }
button.secondary { background: #e5e7eb; color: #374151; }
button.secondary:hover { background: #d1d5db; }
button:active { transform: scale(0.96); }

.status-msg {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  min-height: 1.5em;
}

.split-view {
  display: flex;
  gap: 20px;
  justify-content: space-around;
  flex-wrap: wrap;
}

.side-panel {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--vp-c-bg-alt);
  border-radius: 8px;
  padding: 1.5rem 1rem;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.02);
  flex-shrink: 0;
}

.panel-header {
  text-align: center;
  margin-bottom: 2rem;
}

.panel-header h4 {
  margin: 0 0 5px 0;
  color: var(--vp-c-text-1);
}

.formula {
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  font-size: 1.1rem;
  color: #003f88;
  background: rgba(0, 63, 136, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
}

.equation-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 150px;
  width: 100%;
}

.op-sign {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 10px;
  color: var(--vp-c-text-2);
  transition: opacity 0.3s;
}

.hidden {
  opacity: 0 !important;
  pointer-events: none;
}

.matrix-wrapper {
  position: relative;
  display: inline-flex;
  padding: 0 10px;
  transition: transform 0.7s cubic-bezier(0.5, 0, 0.2, 1), opacity 0.4s;
  flex-shrink: 0;
}

/* 冲击动画：撞击后弹回，保持可见 */
.impact-right { animation: impact-right-keyframes 0.8s ease-in-out; }
.impact-left { animation: impact-left-keyframes 0.8s ease-in-out; }

@keyframes impact-right-keyframes {
  0% { transform: translateX(0); }
  50% { transform: translateX(110%); opacity: 0.7; }
  100% { transform: translateX(0); }
}

@keyframes impact-left-keyframes {
  0% { transform: translateX(0); }
  50% { transform: translateX(-110%); opacity: 0.7; }
  100% { transform: translateX(0); }
}

.matrix-bracket {
  width: 10px;
  height: calc(100% + 10px);
  position: absolute;
  top: -5px;
  border: 2px solid var(--vp-c-text-1);
}
.matrix-bracket.left { left: 0; border-right: none; }
.matrix-bracket.right { right: 0; border-left: none; }

.matrix { position: relative; }

.static-cell, .anim-cell {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}

.e-wrapper .static-cell {
  color: #003f88;
}

.anim-cell {
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 4px;
}

.anim-cell span { transition: color 0.3s, transform 0.3s; }
.anim-cell span.pulse {
  animation: pop 0.5s ease-out;
  color: #e63946;
}

.highlight-row { background-color: rgba(0, 63, 136, 0.1); }
.highlight-col { background-color: rgba(42, 157, 143, 0.1); }

.ghost-group {
  position: absolute;
  display: flex;
  transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
  background-color: rgba(230, 57, 70, 0.15);
  border-radius: 4px;
  z-index: 10;
}

.row-ghost { flex-direction: row; left: 0; }
.col-ghost { flex-direction: column; top: 0; }

.ghost-cell {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.85rem;
  color: #e63946;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
}

.placeholder-e {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: var(--vp-c-text-3);
  font-family: 'Times New Roman', Times, serif;
  font-style: italic;
  font-weight: bold;
}

.outcome-label {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  opacity: 0;
  transition: opacity 0.5s;
  height: 1.5em;
}
.outcome-label.visible { opacity: 1; }

.color-row { color: #003f88; }
.color-col { color: #2a9d8f; }

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.6); }
  100% { transform: scale(1); }
}

:root.dark .lr-demo-container { background: var(--vp-c-bg-mute); }
:root.dark button { background: #4cc9f0; color: #1a1a1a; font-weight: 600; }
:root.dark button:hover { background: #3ab1d6; }
:root.dark button.secondary { background: #3a3a3a; color: #e0e0e0; }
:root.dark button.secondary:hover { background: #4a4a4a; }
:root.dark .controls h3 { color: #4cc9f0; }
:root.dark .formula { color: #4cc9f0; background: rgba(76, 201, 240, 0.15); }
:root.dark .e-wrapper .static-cell { color: #4cc9f0; }
:root.dark .highlight-row { background-color: rgba(76, 201, 240, 0.2); }
:root.dark .highlight-col { background-color: rgba(42, 157, 143, 0.25); }
:root.dark .color-row { color: #4cc9f0; }
:root.dark .color-col { color: #48cae4; }

/* Fullscreen Typography Adjustments */
.lr-demo-container.fullscreen .controls h3 {
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
}

.lr-demo-container.fullscreen button {
  font-size: 1.1rem;
  padding: 10px 24px;
}

.lr-demo-container.fullscreen .status-msg {
  font-size: 1.2rem;
  margin-top: 1rem;
}

.lr-demo-container.fullscreen .panel-header h4 {
  font-size: 1.5rem;
}

.lr-demo-container.fullscreen .formula {
  font-size: 1.3rem;
}

.lr-demo-container.fullscreen .outcome-label {
  font-size: 1.1rem;
}
</style>
