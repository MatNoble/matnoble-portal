<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let animationFrameId: number;
let particles: Particle[] = [];
let particleCount = 60; // Default for desktop
const mouse = { x: -1000, y: -1000, active: false };

class Particle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 1;
    this.baseVx = (Math.random() - 0.5) * 0.5;
    this.baseVy = (Math.random() - 0.5) * 0.5;
    this.vx = this.baseVx;
    this.vy = this.baseVy;
  }

  update(w: number, h: number) {
    // Brownian motion (slight random fluctuations)
    this.vx += (Math.random() - 0.5) * 0.1;
    this.vy += (Math.random() - 0.5) * 0.1;

    // Limit speed
    const maxSpeed = 1.5;
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }

    // Mouse interaction (gentle attraction)
    if (mouse.active) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        this.vx += dx * 0.005;
        this.vy += dy * 0.005;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    // Boundary check
    if (this.x < 0) this.x = w;
    if (this.x > w) this.x = 0;
    if (this.y < 0) this.y = h;
    if (this.y > h) this.y = 0;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fillStyle = 'rgba(77, 132, 196, 0.15)'; // mn-blue with low opacity
    context.fill();
  }
}

const init = () => {
  if (!canvasRef.value) return;
  
  // Performance Check: Reduced Motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Performance Check: Mobile Device Adjustment
  const isMobile = window.innerWidth < 768;
  particleCount = isMobile ? 15 : 60; // Reduce particles significantly on mobile

  const canvas = canvasRef.value;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');
  
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas.width, canvas.height));
  }

  // Only start animation loop if not already running to avoid duplicates on resize
  if (!animationFrameId) {
    animate();
  }
};

const animate = () => {
  if (!ctx || !canvasRef.value) return;
  const canvas = canvasRef.value;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update(canvas.width, canvas.height);
    p.draw(ctx!);
  });

  // Draw lines between close particles for a "neural" look
  // Optimization: Lower opacity and connection distance on mobile if needed
  ctx.lineWidth = 0.5;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        ctx.strokeStyle = `rgba(77, 132, 196, ${0.1 * (1 - dist / 150)})`;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  animationFrameId = requestAnimationFrame(animate);
};

// Debounce resize to prevent excessive re-initialization
let resizeTimeout: any;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // If context exists, it means we initialized. Re-init to adjust canvas size.
    if (ctx) init(); 
  }, 200);
};

const handleMouseMove = (e: MouseEvent) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
};

const handleMouseLeave = () => {
  mouse.active = false;
};

const handleClick = () => {
  particles.forEach(p => {
    const dx = mouse.x - p.x;
    const dy = mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 300) {
      p.vx += (p.x - mouse.x) * 0.05;
      p.vy += (p.y - mouse.y) * 0.05;
    }
  });
};

onMounted(() => {
  init();
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('click', handleClick);
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
  window.removeEventListener('click', handleClick);
});
</script>

<template>
  <canvas ref="canvasRef" class="brownian-bg"></canvas>
</template>

<style scoped>
.brownian-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  background: transparent;
}

/* Ensure the background doesn't visually interfere with code blocks */
.dark .brownian-bg {
  opacity: 0.6;
}
</style>
