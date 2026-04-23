<script setup lang="ts">
interface Node {
  text: string
  active?: boolean
}

interface Props {
  nodes: Node[]
}

defineProps<Props>()
</script>

<template>
  <div class="learning-path-header">
    <div class="path-container">
      <template v-for="(node, index) in nodes" :key="index">
        <div class="path-node" :class="{ active: node.active }">
          <div class="node-bullet"></div>
          <span class="node-text">{{ node.text }}</span>
        </div>
        <div v-if="index < nodes.length - 1" class="path-connector">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.learning-path-header {
  margin: 40px 0;
  padding: 16px 0;
  overflow-x: auto;
  scrollbar-width: none; /* Hide scrollbar for clean look */
}

.learning-path-header::-webkit-scrollbar {
  display: none;
}

.path-container {
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
}

.path-node {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.4;
  transition: all 0.3s ease;
}

.path-node.active {
  opacity: 1;
}

.node-bullet {
  width: 6px;
  height: 6px;
  background: var(--mn-accent);
  border-radius: 50%;
}

.node-text {
  font-family: var(--vp-font-family-heading);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--mn-text);
  letter-spacing: 0.02em;
}

.path-connector {
  width: 16px;
  height: 16px;
  color: var(--mn-text-muted);
  opacity: 0.3;
}

svg {
  width: 100%;
  height: 100%;
}

@media (max-width: 640px) {
  .path-container { gap: 12px; }
  .node-text { font-size: 0.75rem; }
}
</style>
