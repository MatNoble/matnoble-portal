<script setup lang="ts">
import { withBase } from 'vitepress'

interface MapNode {
  title: string
  details: string
  link: string
  tag?: string
}

interface Props {
  nodes: MapNode[]
}

defineProps<Props>()
</script>

<template>
  <div class="scholar-map">
    <div class="map-container">
      <div v-for="(node, index) in nodes" :key="index" class="map-node">
        <!-- Connecting Line -->
        <div v-if="index < nodes.length - 1" class="connecting-line"></div>
        
        <!-- Node Content -->
        <div class="node-marker">
          <div class="marker-dot"></div>
          <div class="marker-number">{{ index + 1 }}</div>
        </div>
        
        <div class="node-body">
          <div v-if="node.tag" class="node-tag">{{ node.tag }}</div>
          <h3 class="node-title">{{ node.title }}</h3>
          <p class="node-details">{{ node.details }}</p>
          <a :href="withBase(node.link)" class="node-link">
            进入探索
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scholar-map {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.map-container {
  display: flex;
  flex-direction: column;
  gap: 80px;
  position: relative;
}

.map-node {
  display: flex;
  gap: 40px;
  position: relative;
  align-items: flex-start;
}

.connecting-line {
  position: absolute;
  top: 60px;
  left: 24px;
  width: 1px;
  height: calc(100% + 40px);
  background: repeating-linear-gradient(
    to bottom,
    var(--mn-primary) 0,
    var(--mn-primary) 4px,
    transparent 4px,
    transparent 8px
  );
  opacity: 0.3;
}

.node-marker {
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--mn-primary);
  border-radius: 50%;
  z-index: 2;
}

.marker-number {
  position: absolute;
  top: -15px;
  font-family: var(--vp-font-family-heading);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--mn-primary);
  opacity: 0.5;
}

.node-body {
  padding-top: 4px;
}

.node-tag {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--mn-primary);
  margin-bottom: 8px;
}

.node-title {
  font-family: var(--vp-font-family-noble);
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 12px;
  color: var(--mn-text);
  font-style: italic;
}

.node-details {
  font-size: 1.1rem;
  color: var(--mn-text-soft);
  line-height: 1.6;
  margin-bottom: 20px;
  max-width: 500px;
}

.node-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--mn-primary);
  font-weight: 600;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  padding-bottom: 2px;
  border-bottom: 1px solid transparent;
}

.node-link:hover {
  border-bottom-color: var(--mn-primary);
  gap: 12px;
}

.node-link .icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 640px) {
  .map-node { gap: 20px; }
  .node-title { font-size: 1.4rem; }
  .node-details { font-size: 0.95rem; }
  .connecting-line { left: 16px; }
  .node-marker { width: 32px; }
  .marker-dot { width: 8px; height: 8px; }
}
</style>
