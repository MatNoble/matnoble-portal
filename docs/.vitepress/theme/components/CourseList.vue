<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'

interface Course {
  id: string
  code: string
  title: string
  enTitle: string
  category: 'stem' | 'business'
  semester: string
  description: string
  link: string
  status?: 'active' | 'completed'
}

// 核心数学课程
const courses = ref<Course[]>([
  {
    id: 'advanced-math-2',
    code: '理工数学',
    title: '高等数学II',
    enTitle: 'Advanced Mathematics II',
    category: 'stem',
    semester: '2026 春季',
    description: '理工科核心基础课。涵盖多元函数微积分学、重积分、常微分方程以及无穷级数，致力于重构空间几何直觉，提供严密精细的数理逻辑支撑。',
    link: '/courses/advanced-math-2',
    status: 'completed'
  },
  {
    id: 'discrete-math',
    code: '专业数学',
    title: '离散数学',
    enTitle: 'Discrete Mathematics',
    category: 'stem',
    semester: '2026 春季',
    description: '计算机类各专业核心基础课。本课程深入探讨集合论、二元关系、等价与偏序、图论及代数结构，为算法结构设计与数理逻辑证明奠定基础。',
    link: '/courses/discrete-math',
    status: 'completed'
  },
  {
    id: 'economic-math-2',
    code: '经管数学',
    title: '经济数学II',
    enTitle: 'Economic Mathematics II',
    category: 'business',
    semester: '2026 春季',
    description: '经管类专业核心工具课。课程以线性代数为主体，包含行列式、矩阵运算、线性方程组求解及向量组线性相关性，为经管决策分析构建代数基础。',
    link: '/courses/economic-math-2',
    status: 'completed'
  },
  {
    id: 'matlab-practice',
    code: '工程计算',
    title: 'MATLAB 编程与工程实践',
    enTitle: 'MATLAB Programming & Engineering Practice',
    category: 'stem',
    semester: '2026 夏季',
    description: '本课程以计算思维与算法实现为主线，深入学习 MATLAB 矩阵运算、自定义函数与编码规范、命令行计算器项目、GUI 设计以及特定目标识别应用，通过项目制学习培养工程实践能力。',
    link: '/courses/matlab/',
    status: 'active'
  }
])
</script>

<template>
  <div class="courses-hub">
    <!-- Header -->
    <div class="hub-header">
      <h1 class="hub-title">课程中心 <span class="subtitle">Course Hub</span></h1>
      <p class="hub-description">
        以数学直觉为引领，用计算与代码重构科学视野。在这里获取本学期主讲课程《高等数学II》与《离散数学》的章节化教学大纲及精品讲义课件。
      </p>
    </div>

    <!-- Courses Grid - Dual Card Premium Layout -->
    <div class="courses-grid">
      <div 
        v-for="course in courses.slice().reverse()" 
        :key="course.id" 
        class="course-card"
      >
        <!-- Overlay Grid Decoration -->
        <div class="card-matrix-overlay matrix-grid-pattern" aria-hidden="true"></div>

        <!-- Card Header -->
        <div class="card-header">
          <span class="course-code">{{ course.code }}</span>
          <span 
            class="status-badge" 
            :class="course.status === 'completed' ? 'completed-badge' : 'active-badge'"
          >
            {{ course.status === 'completed' ? '已结课' : '当前开课' }}
          </span>
        </div>

        <!-- Course Title -->
        <div class="card-body">
          <h2 class="course-title">{{ course.title }}</h2>
          <span class="course-subtitle">{{ course.enTitle }}</span>
          <p class="course-desc">{{ course.description }}</p>
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
          <span class="semester-tag">{{ course.semester }}</span>
        </div>

        <!-- Detail Link Overlay / Button -->
        <div v-if="course.link" class="card-action">
          <a :href="withBase(course.link)" class="action-link" :aria-label="'进入' + course.title + '课程主页'">
            进入课程主页
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
        <div v-else class="card-action-disabled">
          <span class="action-disabled-text">详情暂未开放</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.courses-hub {
  max-width: 1200px; /* Wider for 3-card layout */
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* Header Styles */
.hub-header {
  text-align: center;
  margin-bottom: 56px;
}

.hub-title {
  font-family: var(--vp-font-family-heading);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--mn-text);
  margin-bottom: 16px;
  line-height: 1.2;
}

.hub-title .subtitle {
  display: block;
  font-size: 1rem;
  font-weight: 500;
  color: var(--mn-text-muted);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-top: 4px;
}

.hub-description {
  max-width: 680px;
  margin: 0 auto;
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--mn-text-soft);
}

/* Dual Card Grid System */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

/* 当卡片数量仅有 1 个时，自适应单列并居中，保证极佳的视觉均衡度 */
.courses-grid:has(> :last-child:first-child) {
  grid-template-columns: 1fr;
  max-width: 520px;
  margin: 0 auto;
}

.course-card {
  background: var(--vp-c-bg-soft);
  border: 1.5px solid rgba(0, 0, 0, 0.03);
  border-radius: 20px;
  padding: 36px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: all 0.4s cubic-bezier(0.2, 1, 0.3, 1);
  z-index: 5;
}

.dark .course-card {
  background: rgba(15, 23, 42, 0.4);
  border-color: rgba(255, 255, 255, 0.03);
}

.card-matrix-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.08;
  pointer-events: none;
  z-index: -1;
  mask-image: linear-gradient(to bottom, black, transparent);
  -webkit-mask-image: linear-gradient(to bottom, black, transparent);
}

.course-card:hover {
  transform: translateY(-6px);
  border-color: var(--mn-primary);
  box-shadow: 0 12px 30px var(--mn-primary-soft);
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.course-code {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--mn-primary);
  background: var(--mn-primary-soft);
  padding: 3px 10px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
}

.active-badge {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.completed-badge {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
}

/* Card Body */
.card-body {
  flex-grow: 1;
  margin-bottom: 28px;
}

.course-title {
  font-family: var(--vp-font-family-noble);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--mn-text);
  margin: 0 0 6px;
  font-style: italic;
  letter-spacing: -0.012em;
}

.course-subtitle {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--mn-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 20px;
}

.course-desc {
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--mn-text-soft);
  margin: 0;
}

/* Card Footer */
.card-footer {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  padding-top: 20px;
}

.dark .card-footer {
  border-color: rgba(255, 255, 255, 0.04);
}

.semester-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--mn-text-muted);
  background: rgba(0, 0, 0, 0.03);
  padding: 3px 10px;
  border-radius: 6px;
}

.dark .semester-tag {
  background: rgba(255, 255, 255, 0.04);
}

/* Action Links */
.card-action {
  margin-top: auto;
}

.action-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: var(--mn-primary);
  color: #ffffff !important;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px var(--mn-primary-ring);
}

.action-link:hover {
  background: var(--mn-secondary);
  box-shadow: 0 4px 16px var(--mn-primary-ring);
  transform: translateY(-1px);
}

.arrow-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.2s ease;
}

.action-link:hover .arrow-icon {
  transform: translateX(4px);
}

.card-action-disabled {
  margin-top: auto;
  border: 1.5px dashed rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.01);
}

.dark .card-action-disabled {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.01);
}

.action-disabled-text {
  font-size: 0.95rem;
  color: var(--mn-text-muted);
  font-weight: 600;
}

@media (max-width: 992px) {
  .courses-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .hub-title { font-size: 2rem; }
  .course-card { padding: 28px; }
}
</style>
