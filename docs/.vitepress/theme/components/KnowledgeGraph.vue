<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { withBase, useRouter } from 'vitepress'

interface NodeData {
  id: string
  label: string
  details: string
  link?: string
  children?: NodeData[]
}

const router = useRouter()

// Hierarchical Knowledge Map
const fullData: NodeData = {
  id: 'core',
  label: 'MatNoble Core',
  details: '数学作为底层架构',
  children: [
    {
      id: 'calculus',
      label: '微积分直觉',
      details: '微分万能公式与 DI 策略',
      children: [
        { id: 'derivative', label: '导数方法论', details: '计算深度的提升', link: '/teaching/derivative-method' },
        { id: 'integral', label: '积分心法', details: 'DI 表格法演示', link: '/tools/di-method' },
        { id: 'ode', label: '常微分方程', details: '二阶解析直觉', link: '/teaching/ode-intuition' }
      ]
    },
    {
      id: 'algebra',
      label: '线性代数',
      details: '空间变换与几何直观',
      children: [
        { id: 'matrix', label: '初等变换', details: '矩阵动画演示', link: '/teaching/linear-algebra/elementary-transformations' },
        { id: 'geometric', label: '几何直观', details: '线性代数核心心法', link: '/teaching/linear-algebra' },
        { id: 'space', label: '3D 实验室', details: '空间几何交互', link: '/teaching/space-geometry-lab' }
      ]
    },
    {
      id: 'tools',
      label: '研学套件',
      details: '高效学习工具链',
      children: [
        { id: 'memorize', label: 'Memorize', details: '核心公式记忆', link: '/tools/memorize' },
        { id: 'countdown', label: '沉浸计时', details: '专注力辅助', link: '/tools/countdown' },
        { id: 'cheatsheet', label: '速查表', details: '考研级精炼内容', link: '/teaching/cheatsheet' }
      ]
    }
  ]
}

// Navigation State
const history = ref<NodeData[]>([fullData])
const currentParent = computed(() => history.value[history.value.length - 1])
const currentNodes = computed(() => currentParent.value.children || [])

// Layout Constants
const centerX = 400
const centerY = 300
const radius = 180

// Calculate node positions dynamically based on current list
const positionedNodes = computed(() => {
  const nodes = currentNodes.value
  return nodes.map((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2 - Math.PI / 2
    return {
      ...node,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    }
  })
})

const handleNodeClick = (node: NodeData) => {
  if (node.children && node.children.length > 0) {
    // Drill down
    history.value.push(node)
  } else if (node.link) {
    // Navigate to page
    router.go(withBase(node.link))
  }
}

const goBack = () => {
  if (history.value.length > 1) {
    history.value.pop()
  }
}

const activeNodeId = ref<string | null>(null)
</script>

<template>
  <div class="knowledge-graph-container">
    <!-- Navigation / Breadcrumbs -->
    <div class="graph-nav">
      <button v-if="history.length > 1" @click="goBack" class="back-btn">
        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        返回
      </button>
      <span class="current-path">
        {{ history.map(h => h.label).join(' / ') }}
      </span>
    </div>

    <svg viewBox="0 0 800 600" class="graph-svg">
      <!-- Central Parent Node -->
      <g class="node-group parent" @click="goBack">
        <circle :cx="centerX" :cy="centerY" r="45" class="center-ring" />
        <text :x="centerX" :y="centerY + 5" class="center-label">{{ currentParent.label }}</text>
      </g>

      <!-- Child Nodes -->
      <g v-for="node in positionedNodes" 
         :key="node.id"
         class="node-group child"
         :class="{ hasChildren: node.children, isActive: activeNodeId === node.id }"
         @mouseenter="activeNodeId = node.id"
         @mouseleave="activeNodeId = null"
         @click="handleNodeClick(node)"
      >
        <!-- Connecting Line -->
        <line :x1="centerX" :y1="centerY" :x2="node.x" :y2="node.y" class="connection-line" />
        
        <!-- Node Circle -->
        <circle :cx="node.x" :cy="node.y" r="10" class="node-dot" />
        <circle :cx="node.x" :cy="node.y" r="25" class="hitbox" fill="transparent" />

        <!-- Node Label -->
        <text :x="node.x" :y="node.y - 25" class="node-label">{{ node.label }}</text>
        
        <!-- Details Popup -->
        <g v-if="activeNodeId === node.id" class="details-group">
          <text :x="node.x" :y="node.y + 35" class="node-details">{{ node.details }}</text>
          <text v-if="node.children" :x="node.x" :y="node.y + 52" class="drill-hint">点击进入分类</text>
        </g>
      </g>
    </svg>

    <div class="graph-footer">
      <p v-if="history.length === 1">点击节点探索子领域</p>
      <p v-else>点击中心圆圈或返回按钮可回到上一级</p>
    </div>
  </div>
</template>

<style scoped>
.knowledge-graph-container {
  width: 100%;
  max-width: 900px;
  min-height: 500px;
  margin: 40px auto;
  position: relative;
  background: var(--mn-primary-soft);
  border-radius: 2rem;
  overflow: hidden;
  border: 1px solid rgba(var(--mn-primary-rgb), 0.1);
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05);
}

.graph-nav {
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: var(--mn-primary);
  color: white;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.back-btn:hover {
  transform: translateX(-3px);
}

.current-path {
  font-family: var(--mn-font-heading);
  font-size: 0.9rem;
  color: var(--mn-text-muted);
  font-style: italic;
  opacity: 0.8;
}

.graph-svg {
  width: 100%;
  height: auto;
}

/* Central Node */
.center-ring {
  fill: white;
  stroke: var(--mn-primary);
  stroke-width: 2;
  stroke-dasharray: 4 4;
  cursor: pointer;
}

.center-label {
  text-anchor: middle;
  font-family: var(--mn-font-heading);
  font-weight: 700;
  font-size: 0.95rem;
  fill: var(--mn-primary);
  pointer-events: none;
}

/* Connections */
.connection-line {
  stroke: var(--mn-primary);
  stroke-width: 1;
  opacity: 0.15;
  stroke-dasharray: 5 5;
}

/* Child Nodes */
.node-dot {
  fill: white;
  stroke: var(--mn-primary);
  stroke-width: 2.5;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.node-group:hover .node-dot {
  r: 12;
  fill: var(--mn-primary);
}

.node-label {
  text-anchor: middle;
  font-family: var(--mn-font-heading);
  font-size: 1.05rem;
  font-weight: 600;
  fill: var(--mn-text);
  pointer-events: none;
}

.node-details {
  text-anchor: middle;
  font-size: 0.75rem;
  fill: var(--mn-primary);
  font-weight: 500;
  opacity: 0.9;
}

.drill-hint {
  text-anchor: middle;
  font-size: 0.65rem;
  fill: var(--mn-accent);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
}

.graph-footer {
  position: absolute;
  bottom: 24px;
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  color: var(--mn-text-muted);
  opacity: 0.6;
}

/* Animations */
.node-group {
  cursor: pointer;
}

@media (max-width: 640px) {
  .node-label { font-size: 0.9rem; }
  .center-ring { r: 35; }
  .center-label { font-size: 0.75rem; }
}
</style>
