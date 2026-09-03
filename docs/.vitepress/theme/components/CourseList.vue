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

interface SemesterGroup {
  semester: string
  status: 'current' | 'completed'
  tag: string
  courses: Course[]
}

// 分学期组织的主讲课程列表
const semesterGroups = ref<SemesterGroup[]>([
  {
    semester: '2026 秋季',
    status: 'current',
    tag: '当前学期',
    courses: [
      {
        id: 'advanced-math-1-2026-fall',
        code: '理工数学',
        title: '高等数学(A)I',
        enTitle: 'Advanced Mathematics (A) I',
        category: 'stem',
        semester: '2026 秋季',
        description: '理工科核心基础必修课。涵盖函数与极限、一元函数导数与微分、微分中值定理与导数应用、不定积分与定积分及其应用，为后续课程奠定坚实数理基础。',
        link: '',
        status: 'active'
      },
      {
        id: 'discrete-math-2026-fall',
        code: '专业数学',
        title: '离散数学',
        enTitle: 'Discrete Mathematics',
        category: 'stem',
        semester: '2026 秋季',
        description: '计算机类各专业核心基础课。本课程深入探讨命题逻辑、一阶逻辑、二元关系、等价与偏序、图论及代数结构，为算法结构设计与数理逻辑证明奠定基础。',
        link: '/courses/discrete-math-2026-fall',
        status: 'active'
      },
      {
        id: 'java-programming-2026-fall',
        code: '工程计算',
        title: 'Java程序设计',
        enTitle: 'Java Programming',
        category: 'stem',
        semester: '2026 秋季',
        description: '计算机与软件工程核心实践课。深入讲解面向对象编程思想、类与对象、继承多态、异常处理、集合框架与 I/O 操作，通过项目实战培养工程编码能力。',
        link: '',
        status: 'active'
      },
      {
        id: 'linear-algebra-b-2026-fall',
        code: '理工数学',
        title: '线性代数(B)',
        enTitle: 'Linear Algebra (B)',
        category: 'stem',
        semester: '2026 秋季',
        description: '理工及经管类专业核心工具课。课程涵盖行列式、矩阵运算、线性方程组求解、向量组线性相关性、特征值与特征向量及二次型，为科学计算构建代数基础。',
        link: '',
        status: 'active'
      }
    ]
  },
  {
    semester: '2026 夏季',
    status: 'completed',
    tag: '小学期',
    courses: [
      {
        id: 'matlab-practice-2026-summer',
        code: '工程计算',
        title: 'MATLAB 编程与工程实践',
        enTitle: 'MATLAB Programming & Engineering Practice',
        category: 'stem',
        semester: '2026 夏季',
        description: '本课程以计算思维与算法实现为主线，深入学习 MATLAB 矩阵运算、自定义函数与编码规范、命令行计算器项目、GUI 设计以及特定目标识别应用，通过项目制学习培养工程实践能力。',
        link: '/courses/matlab/',
        status: 'completed'
      }
    ]
  },
  {
    semester: '2026 春季',
    status: 'completed',
    tag: '已结课',
    courses: [
      {
        id: 'advanced-math-2-2026-spring',
        code: '理工数学',
        title: '高等数学(A)II',
        enTitle: 'Advanced Mathematics (A) II',
        category: 'stem',
        semester: '2026 春季',
        description: '理工科核心基础课。涵盖多元函数微积分学、重积分、常微分方程以及无穷级数，致力于重构空间几何直觉，提供严密精细的数理逻辑支撑。',
        link: '/courses/advanced-math-2-2026-spring',
        status: 'completed'
      },
      {
        id: 'discrete-math-2026-spring',
        code: '专业数学',
        title: '离散数学',
        enTitle: 'Discrete Mathematics',
        category: 'stem',
        semester: '2026 春季',
        description: '计算机类各专业核心基础课。本课程深入探讨集合论、二元关系、等价与偏序、图论及代数结构，为算法结构设计与数理逻辑证明奠定基础。',
        link: '/courses/discrete-math-2026-spring',
        status: 'completed'
      },
      {
        id: 'economic-math-2-2026-spring',
        code: '经管数学',
        title: '经济数学II',
        enTitle: 'Economic Mathematics II',
        category: 'business',
        semester: '2026 春季',
        description: '经管类专业核心工具课。课程以线性代数为主体，包含行列式、矩阵运算、线性方程组求解及向量组线性相关性，为经管决策分析构建代数基础。',
        link: '/courses/economic-math-2-2026-spring',
        status: 'completed'
      }
    ]
  }
])
</script>

<template>
  <div class="courses-hub">
    <!-- Header -->
    <div class="hub-header">
      <h1 class="hub-title">课程中心 <span class="subtitle">Course Hub</span></h1>
      <p class="hub-description">
        以数学直觉为引领，用计算与代码重构科学视野。按学期查阅主讲课程的章节化教学大纲及精品讲义课件。
      </p>
    </div>

    <!-- Semester Sections -->
    <section 
      v-for="group in semesterGroups" 
      :key="group.semester" 
      class="semester-section"
      :class="{ 'is-current': group.status === 'current', 'is-completed': group.status === 'completed' }"
    >
      <!-- Semester Section Divider Header -->
      <div class="semester-header">
        <div class="semester-title-wrapper">
          <span class="semester-indicator"></span>
          <h2 class="semester-title">{{ group.semester }}</h2>
          <span 
            class="semester-badge"
            :class="group.status === 'current' ? 'badge-current' : 'badge-completed'"
          >
            {{ group.tag }}
          </span>
        </div>
        <span class="semester-count">{{ group.courses.length }} 门课程</span>
      </div>

      <!-- Courses Grid -->
      <div class="courses-grid">
        <div 
          v-for="course in group.courses" 
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
            <h3 class="course-title">{{ course.title }}</h3>
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
    </section>
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

/* Semester Section Styles */
.semester-section {
  margin-bottom: 60px;
}

.semester-section:last-child {
  margin-bottom: 0;
}

.semester-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid rgba(0, 0, 0, 0.06);
}

.dark .semester-header {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.semester-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.semester-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--mn-primary);
  box-shadow: 0 0 0 3px var(--mn-primary-soft);
}

.semester-section.is-completed .semester-indicator {
  background: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.2);
}

.semester-title {
  font-family: var(--vp-font-family-heading);
  font-size: 1.45rem;
  font-weight: 700;
  color: var(--mn-text);
  margin: 0;
  border: none;
  padding: 0;
  line-height: 1.2;
}

.semester-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 12px;
  letter-spacing: 0.5px;
}

.badge-current {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.badge-completed {
  background: rgba(100, 116, 139, 0.1);
  color: #64748b;
  border: 1px solid rgba(100, 116, 139, 0.15);
}

.semester-count {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--mn-text-muted);
}

/* Dual Card Grid System */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

/* 当卡片数量仅有 1 个时，自适应单列居左并设置合适宽度 */
.courses-grid:has(> :last-child:first-child) {
  grid-template-columns: minmax(280px, 380px);
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
