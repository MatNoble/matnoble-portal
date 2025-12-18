<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const logoRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 稍微延迟一点触发，让用户感觉到动画
        setTimeout(() => {
          isVisible.value = true
        }, 100)
        // 触发一次后即可取消监听，避免反复闪烁（除非你希望反复触发，这里设定为一次性入场）
        if (logoRef.value) observer?.unobserve(logoRef.value)
      }
    })
  }, { threshold: 0.1 }) // 10% 可见即触发

  if (logoRef.value) {
    observer.observe(logoRef.value)
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="logo" ref="logoRef" :class="{ 'is-active': isVisible }">
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 
        Initial state: Triangles are slightly exploded outwards.
        Active state: Triangles converge to form the square.
      -->
      <g class="shapes">
        <!-- Top (Red) -->
        <g class="piece top">
          <polygon points="0,0 100,0 36,48" class="red" />
        </g>
        <!-- Right (Yellow) -->
        <g class="piece right">
          <polygon points="100,0 100,100 52,36" class="yellow" />
        </g>
        <!-- Bottom (Green) -->
        <g class="piece bottom">
          <polygon points="100,100 0,100 64,52" class="green" />
        </g>
        <!-- Left (Blue) -->
        <g class="piece left">
          <polygon points="0,100 0,0 48,64" class="blue" />
        </g>
      </g>
    </svg>
    <span class="logo-text">MatNoble</span>
  </div>
</template>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  /* 初始不可见状态的文字也可以淡入 */
  opacity: 0; 
  transform: translateY(5px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  cursor: pointer;
}

.logo.is-active {
  opacity: 1;
  transform: translateY(0);
}

.logo:hover {
  opacity: 0.85;
}

svg {
  width: 36px; /* 稍微调大一点以展示细节 */
  height: 36px;
  overflow: visible; /* 允许微小的溢出位移 */
}

/* 颜色定义 (继承自 custom.css) */
.red { fill: var(--mn-red); }
.yellow { fill: var(--mn-yellow); }
.green { fill: var(--mn-green); }
.blue { fill: var(--mn-blue); }

/* 文字样式 */
.logo-text {
  font-family: 'Outfit', sans-serif; /* 应用几何字体 */
  font-weight: 700;
  font-size: 1.35rem;
  letter-spacing: -0.02em; /* 紧凑一点更显现代 */
  color: var(--vp-c-text-1);
  line-height: 1;
}

/* === 微动效逻辑 === */
.piece {
  transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 1s ease;
  transform-origin: 50% 50%;
  opacity: 0;
}

/* 初始爆炸状态 (Exploded View) */
.top    { transform: translateY(-15px); }
.right  { transform: translateX(15px); }
.bottom { transform: translateY(15px); }
.left   { transform: translateX(-15px); }

/* 激活聚合状态 (Assembled View) */
.logo.is-active .piece {
  opacity: 1;
  transform: translate(0, 0);
}

/* 鼠标悬停时的呼吸效果 */
.logo:hover .piece.top    { transform: translateY(-2px); }
.logo:hover .piece.right  { transform: translateX(2px); }
.logo:hover .piece.bottom { transform: translateY(2px); }
.logo:hover .piece.left   { transform: translateX(-2px); }

</style>