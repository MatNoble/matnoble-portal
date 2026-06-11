<template>
  <div class="lazy-geometry-lab">
    <ClientOnly>
      <SpaceGeometryLab v-if="isActive" />
      <div v-else class="geometry-lab-placeholder">
        <div class="placeholder-card">
          <div class="icon-box" aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 21H16" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 18V21" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2>空间解析几何实验室</h2>
          <p>点击后加载 3D 演示、公式面板和教学展示控制。</p>
          <button class="btn-primary" type="button" @click="isActive = true">
            开启 3D 实验室
          </button>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { defineAsyncComponent, ref } from 'vue';

const isActive = ref(false);
const SpaceGeometryLab = defineAsyncComponent(() => import('./SpaceGeometryLab.vue'));
</script>

<style scoped>
.lazy-geometry-lab {
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 360px;
  margin: 24px 0 32px;
}

.geometry-lab-placeholder {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 24px;
  background:
    radial-gradient(circle at 25% 20%, rgba(37, 99, 235, 0.12), transparent 34%),
    linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
}

.placeholder-card {
  width: min(420px, calc(100% - 32px));
  padding: 32px 36px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.65);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.10);
}

.icon-box {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: #eff6ff;
}

.placeholder-card h2 {
  margin: 0 0 8px;
  border: 0;
  font-size: 1.25rem;
  line-height: 1.25;
  color: #1e293b;
}

.placeholder-card p {
  margin: 0 0 22px;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 24px;
  border: 0;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
}

.btn-primary:hover {
  background: #1d4ed8;
}

:global(.dark) .geometry-lab-placeholder {
  border-color: rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(circle at 25% 20%, rgba(96, 165, 250, 0.18), transparent 34%),
    linear-gradient(135deg, #0b0f1a 0%, #111827 100%);
}

:global(.dark) .placeholder-card {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(30, 41, 59, 0.86);
}

:global(.dark) .placeholder-card h2 {
  color: #f8fafc;
}

:global(.dark) .placeholder-card p {
  color: #cbd5e1;
}

@media (max-width: 768px) {
  .lazy-geometry-lab {
    aspect-ratio: 1 / 1.2;
    min-height: 420px;
  }

  .geometry-lab-placeholder {
    aspect-ratio: 1 / 1.2;
    min-height: 420px;
    border-radius: 16px;
  }

  .placeholder-card {
    padding: 28px 24px;
  }
}
</style>
