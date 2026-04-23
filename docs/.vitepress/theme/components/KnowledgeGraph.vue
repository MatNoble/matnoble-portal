<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { withBase, useRouter } from 'vitepress'

interface Node {
  id: string
  x: number
  y: number
  label: string
  details: string
  link: string
  category: 'calculus' | 'algebra' | 'tool' | 'core'
}

interface Edge {
  from: string
  to: string
}

const router = useRouter()

const nodes = ref<Node[]>([
  { id: 'core', x: 400, y: 300, label: 'MatNoble Core', details: '数学作为底层架构', link: '/about', category: 'core' },
  // Calculus Branch
  { id: 'calculus', x: 250, y: 150, label: '微积分直觉', details: '微分万能公式与 DI 策略', link: '/teaching/calculus', category: 'calculus' },
  { id: 'derivative', x: 100, y: 100, label: '导数方法论', details: '计算深度的提升', link: '/teaching/derivative-method', category: 'calculus' },
  // Algebra Branch
  { id: 'algebra', x: 550, y: 150, label: '线性代数', details: '空间变换与几何直观', link: '/teaching/linear-algebra', category: 'algebra' },
  { id: 'matrix', x: 700, y: 80, label: '矩阵动画', details: '初等变换的可视化', link: '/teaching/linear-algebra/elementary-transformations', category: 'algebra' },
  { id: 'lab', x: 720, y: 220, label: '3D 实验室', details: '空间几何交互', link: '/teaching/space-geometry-lab', category: 'algebra' },
  // Tools Branch
  { id: 'tools', x: 400, y: 500, label: '研学套件', details: 'LaTeX 与记忆算法', link: '/tools/', category: 'tool' },
])

const edges = ref<Edge[]>([
  { from: 'core', to: 'calculus' },
  { from: 'core', to: 'algebra' },
  { from: 'core', to: 'tools' },
  { from: 'calculus', to: 'derivative' },
  { from: 'algebra', to: 'matrix' },
  { from: 'algebra', to: 'lab' },
  { from: 'calculus', to: 'algebra' }, // Cross link
])

const activeNode = ref<string | null>(null)

const handleNodeClick = (node: Node) => {
  if (activeNode.value === node.id) {
    window.location.href = withBase(node.link)
  } else {
    activeNode.value = node.id
  }
}

// Simple floating animation logic
const offset = ref({ x: 0, y: 0 })
onMounted(() => {
  let tick = 0
  const animate = () => {
    tick += 0.02
    offset.value = {
      x: Math.sin(tick) * 5,
      y: Math.cos(tick) * 5
    }
    requestAnimationFrame(animate)
  }
  animate()
})

const getPath = (edge: Edge) => {
  const from = nodes.value.find(n => n.id === edge.from)!
  const to = nodes.value.find(n => n.id === edge.to)!
  
  // Calculate quadratic bezier curve for more organic feel
  const mx = (from.x + to.x) / 2 + 20
  const my = (from.y + to.y) / 2 - 20
  
  return `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`
}
</script>

<template>
  <div class="knowledge-graph-container">
    <svg viewBox="0 0 800 600" class="graph-svg" preserveAspectRatio="xMidYMid meet">
      <!-- Defs for arrows and filters -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="25" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="var(--mn-accent)" opacity="0.5" />
        </marker>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Edges -->
      <path 
        v-for="(edge, i) in edges" 
        :key="i"
        :d="getPath(edge)"
        class="edge-path"
        marker-end="url(#arrowhead)"
      />

      <!-- Nodes -->
      <g 
        v-for="node in nodes" 
        :key="node.id" 
        class="node-group"
        :class="[node.category, { active: activeNode === node.id }]"
        @mouseenter="activeNode = node.id"
        @mouseleave="activeNode = null"
        @click="handleNodeClick(node)"
        @touchstart.stop="handleNodeClick(node)"
        :transform="`translate(${node.x}, ${node.y})`"
      >
        <circle r="8" class="node-dot" />
        <circle r="20" class="node-hitbox" fill="transparent" />
        
        <!-- Labels -->
        <g class="label-group">
          <text y="-25" class="node-label">{{ node.label }}</text>
          <text y="30" class="node-details" v-if="activeNode === node.id">{{ node.details }}</text>
        </g>
      </g>
    </svg>

    <div class="graph-hint">
      <svg class="hint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
      </svg>
      点击节点进入对应知识领域
    </div>
  </div>
</template>

<style scoped>
.knowledge-graph-container {
  width: 100%;
  max-width: 900px;
  margin: 40px auto;
  position: relative;
  background: var(--vp-c-bg-soft);
  border-radius: 32px;
  border: 1px solid rgba(0,0,0,0.03);
  overflow: hidden;
}

.graph-svg {
  width: 100%;
  height: auto;
  cursor: grab;
}

.edge-path {
  fill: none;
  stroke: var(--mn-accent);
  stroke-width: 1.5;
  stroke-dasharray: 4 4;
  opacity: 0.15;
  transition: opacity 0.3s ease, stroke-width 0.3s ease;
}

.node-group {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.node-dot {
  fill: var(--vp-c-bg);
  stroke: var(--mn-accent);
  stroke-width: 2;
  transition: all 0.3s ease;
}

.node-group.core .node-dot {
  fill: var(--mn-accent);
  r: 12;
}

.node-group:hover .node-dot {
  r: 14;
  filter: url(#glow);
  stroke-width: 3;
}

.node-label {
  font-family: var(--vp-font-family-noble);
  font-size: 1.1rem;
  font-weight: 600;
  fill: var(--mn-text);
  text-anchor: middle;
  pointer-events: none;
  font-style: italic;
}

.node-details {
  font-size: 0.75rem;
  fill: var(--mn-accent);
  text-anchor: middle;
  pointer-events: none;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.node-group.active ~ .edge-path {
  opacity: 0.05;
}

.graph-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8rem;
  color: var(--mn-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}

.hint-icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 640px) {
  .node-label { font-size: 0.9rem; }
  .graph-svg { min-height: 400px; }
}
</style>
