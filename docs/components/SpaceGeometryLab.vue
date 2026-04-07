<template>
  <ClientOnly>
    <div 
      class="geometry-lab-container" 
      ref="containerRef"
      :class="{ 'fullscreen': isFullscreen }"
    >
      <!-- 页面顶部页签 (桌面端靠左，移动端置顶) -->
      <Transition name="fade-ui">
        <div v-show="isFullscreen" class="glass-panel tabs">
          <button
            class="tab-btn"
            :class="{ active: currentTopic === 'surfaces' }"
            @click="setTopic('surfaces')"
          >空间曲面</button>
          <button
            class="tab-btn"
            :class="{ active: currentTopic === 'curves' }"
            @click="setTopic('curves')"
          >空间曲线</button>
          <button
            class="tab-btn"
            :class="{ active: currentTopic === 'planes' }"
            @click="setTopic('planes')"
          >空间平面</button>
          <button
            class="tab-btn"
            :class="{ active: currentTopic === 'lines' }"
            @click="setTopic('lines')"
          >空间直线</button>
        </div>
      </Transition>

      <Transition name="fade-ui">
        <div v-show="isFullscreen && isMathPanelVisible" class="panels-stack right-panels-container">
          <div class="glass-panel math-panel" v-if="currentData">
            <div class="panel-header">
              <h3 class="panel-title">{{ currentData.title }}</h3>
              <!-- 移动端关闭按钮 -->
              <button v-show="isMobile" class="close-btn" @click="isMathPanelVisible = false">✕</button>
            </div>
            <div class="panel-content">
              <div class="equation" v-html="renderedEquation"></div>
              <div class="desc" v-html="renderedDesc"></div>
            </div>
          </div>

          <!-- 交互式参数控制面板 -->
          <div class="glass-panel param-panel" v-if="showParamPanel">
            <div class="panel-header">
              <h3 class="panel-title">参数调整</h3>
              <button class="close-btn" @click="showParamPanel = false">✕</button>
            </div>
            <div class="panel-content">
              <div v-for="(param, key) in currentParams" :key="key" class="param-control">
                <label class="param-label">{{ param.label }} = {{ param.value.toFixed(2) }}</label>
                <input
                  type="range"
                  class="param-slider"
                  v-model.number="param.value"
                  :min="param.min"
                  :max="param.max"
                  :step="param.step"
                  @input="updateScene"
                />
              </div>
              <button class="reset-param-btn" @click="resetParams">重置参数</button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- 参数面板切换按钮 -->
      <Transition name="fade-ui">
        <button
          v-show="isFullscreen && !showParamPanel && ['planes', 'lines'].includes(currentTopic)"
          class="glass-panel param-toggle-btn"
          @click="showParamPanel = true"
        >
          <span>🎛️</span>
        </button>
      </Transition>

      <!-- 移动端侧边呼出图标 -->
      <Transition name="fade-ui">
        <button 
          v-show="isFullscreen && !isMathPanelVisible && isMobile" 
          class="glass-panel info-toggle-btn"
          @click="isMathPanelVisible = true"
        >
          <span>ℹ️</span>
        </button>
      </Transition>

      <Transition name="fade-ui">
        <div v-show="isFullscreen" class="glass-panel controls">
          <!-- 移动端抽屉拉手指示 -->
          <div v-show="isMobile" class="drawer-handle"></div>
          
          <div v-show="currentTopic === 'surfaces'" class="controls-layout">
          <div class="control-section">
            <span class="sub-category-title">概念引入</span>
            <div class="btn-group">
              <button @click="setScene('dimension_concept')" class="scene-btn" :class="{ active: currentType === 'dimension_concept' }">维度的展开</button>
            </div>
          </div>
          <div class="control-section">
            <span class="sub-category-title">旋转曲面解析</span>
            <div class="btn-group">
              <button @click="setScene('rot_z')" class="scene-btn" :class="{ active: currentType === 'rot_z' }">抛物面 (绕z)</button>
              <button @click="setScene('rot_y')" class="scene-btn" :class="{ active: currentType === 'rot_y' }">单叶 (绕y)</button>
              <button @click="setScene('rot_x')" class="scene-btn" :class="{ active: currentType === 'rot_x' }">双叶 (绕x)</button>
            </div>
          </div>
          <div class="control-section">
            <span class="sub-category-title">柱面</span>
            <div class="btn-group">
              <button @click="setScene('cyl_circular')" class="scene-btn" :class="{ active: currentType === 'cyl_circular' }">圆柱面</button>
              <button @click="setScene('cyl_parabolic')" class="scene-btn" :class="{ active: currentType === 'cyl_parabolic' }">抛物柱面</button>
            </div>
          </div>
          <div class="control-section">
            <span class="sub-category-title">二次曲面</span>
            <div class="btn-group">
              <button @click="setScene('ellipsoid')" class="scene-btn" :class="{ active: currentType === 'ellipsoid' }">椭球面</button>
              <button @click="setScene('hyperboloid')" class="scene-btn" :class="{ active: currentType === 'hyperboloid' }">单叶双曲面</button>
              <button @click="setScene('saddle')" class="scene-btn" :class="{ active: currentType === 'saddle' }">马鞍面</button>
            </div>
          </div>
        </div>

        <div v-show="currentTopic === 'planes'" class="controls-layout">
          <div class="control-section">
            <span class="sub-category-title">平面方程</span>
            <div class="btn-group">
              <button @click="setScene('plane_point_normal')" class="scene-btn" :class="{ active: currentType === 'plane_point_normal' }">点法式方程</button>
              <button @click="setScene('plane_general')" class="scene-btn" :class="{ active: currentType === 'plane_general' }">一般方程</button>
              <button @click="setScene('plane_intercept')" class="scene-btn" :class="{ active: currentType === 'plane_intercept' }">截距式方程</button>
            </div>
          </div>
          <div class="control-section">
            <span class="sub-category-title">平面关系</span>
            <div class="btn-group">
              <button @click="setScene('plane_angle')" class="scene-btn" :class="{ active: currentType === 'plane_angle' }">两平面夹角</button>
              <button @click="setScene('plane_distance')" class="scene-btn" :class="{ active: currentType === 'plane_distance' }">点到平面距离</button>
            </div>
          </div>
        </div>

        <div v-show="currentTopic === 'lines'" class="controls-layout">
          <div class="control-section">
            <span class="sub-category-title">直线方程</span>
            <div class="btn-group">
              <button @click="setScene('line_point_direction')" class="scene-btn" :class="{ active: currentType === 'line_point_direction' }">点向式方程</button>
              <button @click="setScene('line_parametric')" class="scene-btn" :class="{ active: currentType === 'line_parametric' }">参数方程</button>
              <button @click="setScene('line_general')" class="scene-btn" :class="{ active: currentType === 'line_general' }">一般方程(交线)</button>
            </div>
          </div>
          <div class="control-section">
            <span class="sub-category-title">位置关系</span>
            <div class="btn-group">
              <button @click="setScene('line_angle')" class="scene-btn" :class="{ active: currentType === 'line_angle' }">两直线夹角</button>
              <button @click="setScene('line_plane_angle')" class="scene-btn" :class="{ active: currentType === 'line_plane_angle' }">线面夹角</button>
              <button @click="setScene('line_distance')" class="scene-btn" :class="{ active: currentType === 'line_distance' }">点到直线距离</button>
            </div>
          </div>
        </div>

        <div v-show="currentTopic === 'curves'" class="controls-layout">
          <div class="control-section">
            <span class="sub-category-title">投影理论</span>
            <div class="btn-group">
              <button @click="setScene('curve_cylinder')" class="scene-btn" :class="{ active: currentType === 'curve_cylinder' }">投射柱面概念</button>
            </div>
          </div>
          <div class="control-section">
            <span class="sub-category-title">投影推导过程</span>
            <div class="btn-group">
              <button @click="setScene('curve_intersect')" class="scene-btn" :class="{ active: currentType === 'curve_intersect' }">消元法(二曲面)</button>
              <button @click="setScene('curve_parametric')" class="scene-btn" :class="{ active: currentType === 'curve_parametric' }">参数方程投影</button>
            </div>
          </div>
        </div>
        </div>
      </Transition>
      
      <Transition name="fade-ui">
        <div v-show="isFullscreen" class="glass-panel bottom-right-controls tools-stack">
          <button class="btn-tool" @click="resetCamera" title="视角复位">
            <span class="icon">🔄</span> <span class="label">复位</span>
          </button>
          <button class="btn-tool" @click="toggleCamera" :title="isOrthographic ? '切换透视' : '切换正交'">
            <span class="icon">{{ isOrthographic ? '👁️' : '📐' }}</span> <span class="label">{{ isOrthographic ? '透视' : '正交' }}</span>
          </button>
          <button class="btn-tool exit-btn" @click="toggleFullscreen">
            <span class="icon">⛶</span> <span class="label">退出</span>
          </button>
        </div>
      </Transition>

      <!-- 闲置/预览模式遮罩层 -->
      <Transition name="fade-overlay">
        <div v-show="!isFullscreen" class="preview-overlay">
          <div class="overlay-card">
            <div class="icon-box">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 21H16" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 18V21" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
               </svg>
            </div>
            <h3>空间解析几何实验室</h3>
            <p>控制面板较多，请进入全屏沉浸模式开启教学展示与交互。</p>
            <button class="btn-primary" @click="toggleFullscreen">
              ⛶ 开启教学展示
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useData } from 'vitepress';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const { isDark } = useData();

const containerRef = ref(null);
const currentTopic = ref('surfaces');
const currentType = ref('rotation');
const isFullscreen = ref(false);
const isOrthographic = ref(false);
const isMathPanelVisible = ref(true); // 公式面板可见性
const isMobile = ref(false); // 是否为移动端环境
const showParamPanel = ref(false); // 参数面板可见性
const currentParams = ref({}); // 当前场景的可调整参数

const resetCamera = () => {
    if (!camera || !controls) return;
    // 重内置视角: Math Y (向右) = 14, Math Z (向上) = 8, Math X (向外迎向面门) = 16
    camera.position.set(14, 8, 16);
    controls.target.set(0, 0, 0);
    controls.update();
};

// 参数配置模板
const paramTemplates = {
    'plane_point_normal': {
        A: { label: 'A', value: 1, min: -2, max: 2, step: 0.1 },
        B: { label: 'B', value: 1, min: -2, max: 2, step: 0.1 },
        C: { label: 'C', value: 1, min: -2, max: 2, step: 0.1 },
        D: { label: 'D', value: -2, min: -5, max: 5, step: 0.1 }
    },
    'plane_general': {
        A: { label: 'A', value: 2, min: -3, max: 3, step: 0.1 },
        B: { label: 'B', value: -1, min: -3, max: 3, step: 0.1 },
        C: { label: 'C', value: 1, min: -3, max: 3, step: 0.1 },
        D: { label: 'D', value: 0, min: -5, max: 5, step: 0.1 }
    },
    'plane_intercept': {
        a: { label: 'x轴截距 a', value: 2, min: 1, max: 5, step: 0.1 },
        b: { label: 'y轴截距 b', value: 3, min: 1, max: 5, step: 0.1 },
        c: { label: 'z轴截距 c', value: 4, min: 1, max: 5, step: 0.1 }
    },
    'plane_angle': {
        n1x: { label: '平面1法向 x', value: 1, min: -2, max: 2, step: 0.1 },
        n1y: { label: '平面1法向 y', value: 0, min: -2, max: 2, step: 0.1 },
        n1z: { label: '平面1法向 z', value: 1, min: -2, max: 2, step: 0.1 },
        n2x: { label: '平面2法向 x', value: 0, min: -2, max: 2, step: 0.1 },
        n2y: { label: '平面2法向 y', value: 1, min: -2, max: 2, step: 0.1 },
        n2z: { label: '平面2法向 z', value: 1, min: -2, max: 2, step: 0.1 }
    },
    'plane_distance': {
        A: { label: '平面系数 A', value: 3, min: -5, max: 5, step: 0.1 },
        B: { label: '平面系数 B', value: -4, min: -5, max: 5, step: 0.1 },
        C: { label: '平面系数 C', value: 12, min: -5, max: 5, step: 0.1 },
        D: { label: '平面系数 D', value: -13, min: -20, max: 20, step: 0.1 },
        px: { label: '点 x 坐标', value: 0, min: -3, max: 3, step: 0.1 },
        py: { label: '点 y 坐标', value: 0, min: -3, max: 3, step: 0.1 },
        pz: { label: '点 z 坐标', value: 0, min: -3, max: 3, step: 0.1 }
    },
    'line_point_direction': {
        x0: { label: '定点 x₀', value: 1, min: -3, max: 3, step: 0.1 },
        y0: { label: '定点 y₀', value: 0, min: -3, max: 3, step: 0.1 },
        z0: { label: '定点 z₀', value: -2, min: -3, max: 3, step: 0.1 },
        m: { label: '方向 m', value: 2, min: -3, max: 3, step: 0.1 },
        n: { label: '方向 n', value: -1, min: -3, max: 3, step: 0.1 },
        p: { label: '方向 p', value: 1, min: -3, max: 3, step: 0.1 }
    },
    'line_parametric': {
        x0: { label: 'x₀', value: 1, min: -3, max: 3, step: 0.1 },
        y0: { label: 'y₀', value: 0, min: -3, max: 3, step: 0.1 },
        z0: { label: 'z₀', value: 1, min: -3, max: 3, step: 0.1 },
        vx: { label: 'x 方向', value: 1, min: -2, max: 2, step: 0.1 },
        vy: { label: 'y 方向', value: 1, min: -2, max: 2, step: 0.1 },
        vz: { label: 'z 方向', value: -1, min: -2, max: 2, step: 0.1 }
    },
    'line_general': {
        A1: { label: '平面1 A₁', value: 1, min: -2, max: 2, step: 0.1 },
        B1: { label: '平面1 B₁', value: -1, min: -2, max: 2, step: 0.1 },
        C1: { label: '平面1 C₁', value: 1, min: -2, max: 2, step: 0.1 },
        D1: { label: '平面1 D₁', value: -1, min: -5, max: 5, step: 0.1 },
        A2: { label: '平面2 A₂', value: 2, min: -2, max: 2, step: 0.1 },
        B2: { label: '平面2 B₂', value: 1, min: -2, max: 2, step: 0.1 },
        C2: { label: '平面2 C₂', value: 1, min: -2, max: 2, step: 0.1 },
        D2: { label: '平面2 D₂', value: -3, min: -5, max: 5, step: 0.1 }
    },
    'line_angle': {
        s1x: { label: '直线1方向 x', value: 1, min: -2, max: 2, step: 0.1 },
        s1y: { label: '直线1方向 y', value: 1, min: -2, max: 2, step: 0.1 },
        s1z: { label: '直线1方向 z', value: -1, min: -2, max: 2, step: 0.1 },
        s2x: { label: '直线2方向 x', value: -1, min: -2, max: 2, step: 0.1 },
        s2y: { label: '直线2方向 y', value: 1, min: -2, max: 2, step: 0.1 },
        s2z: { label: '直线2方向 z', value: 1, min: -2, max: 2, step: 0.1 }
    },
    'line_plane_angle': {
        nx: { label: '平面法向 x', value: 1, min: -2, max: 2, step: 0.1 },
        ny: { label: '平面法向 y', value: 1, min: -2, max: 2, step: 0.1 },
        nz: { label: '平面法向 z', value: Math.sqrt(2), min: -3, max: 3, step: 0.1 },
        sx: { label: '直线方向 x', value: 1, min: -2, max: 2, step: 0.1 },
        sy: { label: '直线方向 y', value: 1, min: -2, max: 2, step: 0.1 },
        sz: { label: '直线方向 z', value: Math.sqrt(2), min: -3, max: 3, step: 0.1 }
    },
    'line_distance': {
        lx0: { label: '直线定点 x', value: 0, min: -3, max: 3, step: 0.1 },
        ly0: { label: '直线定点 y', value: 0, min: -3, max: 3, step: 0.1 },
        lz0: { label: '直线定点 z', value: 0, min: -3, max: 3, step: 0.1 },
        sm: { label: '方向 m', value: 0, min: -2, max: 2, step: 0.1 },
        sn: { label: '方向 n', value: 1, min: -2, max: 2, step: 0.1 },
        sp: { label: '方向 p', value: 1, min: -2, max: 2, step: 0.1 },
        px: { label: '外点 x', value: 1, min: -3, max: 3, step: 0.1 },
        py: { label: '外点 y', value: 2, min: -3, max: 3, step: 0.1 },
        pz: { label: '外点 z', value: 3, min: -3, max: 3, step: 0.1 }
    }
};

// 重置当前场景参数
const resetParams = () => {
    if (paramTemplates[currentType.value]) {
        currentParams.value = JSON.parse(JSON.stringify(paramTemplates[currentType.value]));
        updateScene();
    }
};

// 更新场景（参数变化时重新渲染）
const updateScene = () => {
    setScene(currentType.value);
};

const sceneData = {
    'dimension_concept': { 
        title: '曲面方程的概念', 
        eq: 'F(x, y, z) = 0', 
        desc: '<span style="font-weight: 600; color: #2563EB;">▍定义</span><br/>如果曲面 $S$ 与三元方程 $F(x,y,z) = 0$ 有如下关系：<br/><br/>1. 曲面 $S$ 上任意一点的坐标都满足该方程；<br/>2. 凡是满足方程的坐标所对应的点都在曲面 $S$ 上。<br/><br/>则称方程 $F(x,y,z)=0$ 为曲面 $S$ 的方程。<br/><br/><span style="font-size: 0.75rem; opacity: 0.8;">(注：左侧动画展现了方程缺少 $z$ 变量束缚时，内部自由度扩充导致一维圆周在空间中升维映射为二维柱面)</span>' 
    },
    'rot_z': { 
        title: '代换规律：抛物面', 
        eq: '\\begin{aligned} &z = y^2 \\\\[0.8ex] \\Longrightarrow\\; &z = x^2 + y^2 \\end{aligned}', 
        desc: '<span style="font-weight: 600; color: #2563EB;">▍核心口诀</span><br/>绕哪轴哪轴不动，另一变量换成到轴距离。<br/>(抛物线绕 $z$ 轴：$z$ 恒定不动，$y$ 换成 $\\pm\\sqrt{x^2+y^2}$，即生成旋转抛物面)' 
    },
    'rot_y': { 
        title: '代换示例：绕 y 轴', 
        eq: '\\begin{aligned} &\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1 \\\\[0.8ex] \\Longrightarrow\\; &\\frac{x^2+z^2}{a^2} - \\frac{y^2}{b^2} = 1 \\end{aligned}', 
        desc: '<span style="font-weight: 600; color: #2563EB;">▍曲面生成推解</span><br/>将 $xOy$ 面的双曲线绕 $y$ 轴旋转。遵循口诀：$y$ 维持不动，$x$ 距离扩展替换为 $\\pm\\sqrt{x^2+z^2}$。<br/>由于代换后同侧系数同号，形成的是上下连通的**单叶双曲面**。' 
    },
    'rot_x': { 
        title: '代换示例：绕 x 轴', 
        eq: '\\begin{aligned} &\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1 \\\\[0.8ex] \\Longrightarrow\\; &\\frac{x^2}{a^2} - \\frac{y^2+z^2}{b^2} = 1 \\end{aligned}', 
        desc: '<span style="font-weight: 600; color: #2563EB;">▍曲面生成推解</span><br/>同一双曲线若改绕 $x$ 轴旋转。遵循口诀：$x$ 不动，$y$ 替换为扩展距离 $\\pm\\sqrt{y^2+z^2}$。<br/>代换后由于符号异号产生间断，生发出两瓣分离的**双叶双曲面**。' 
    },
    'ellipsoid': { title: '椭球面', eq: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} + \\frac{z^2}{c^2} = 1', desc: '三个截面均为椭圆的空间曲面。' },
    'hyperboloid': { title: '单叶双曲面', eq: '\\frac{x^2}{a^2} + \\frac{y^2}{b^2} - \\frac{z^2}{c^2} = 1', desc: '形如冷却塔，截痕包含双曲线与椭圆。' },
    'cyl_circular': { title: '圆柱面', eq: 'x^2 + y^2 = R^2', desc: '准线为圆，母线平行于 $z$ 轴。注意方程中缺 $z$。' },
    'cyl_parabolic': { title: '抛物柱面', eq: 'y = x^2', desc: '准线为抛物线，母线平行于 $z$ 轴。' },
    'saddle': { title: '双曲抛物面 (马鞍面)', eq: 'z = \\frac{x^2}{a^2} - \\frac{y^2}{b^2}', desc: '具有两个方向相反的弧度，形如马鞍。' },
    'curve_cylinder': { 
        title: '投射柱面概念', 
        eq: '\\begin{cases} F(x,y,z)=0 \\\\[0.5ex] G(x,y,z)=0 \\end{cases} \\implies H(x,y)=0', 
        desc: '<span style="font-weight: 600; color: #2563EB;">▍解析本质</span><br/>从空间曲线方程组中消去变量 <i>z</i>，得到的二元方程 $H(x,y)=0$ 在空间中表示的是**投射柱面**。它垂直于 <i>xy</i> 面且穿过空间曲线。' 
    },
    'curve_intersect': { 
        title: '消元法求投影', 
        eq: '\\begin{aligned} &\\begin{cases} x^2+y^2 = z \\\\[0.5ex] x^2+y^2 = 4-z \\end{cases} \\\\[1.2ex] \\implies &x^2+y^2 = 2 \\end{aligned}', 
        desc: '<span style="font-weight: 600; color: #2563EB;">▍推导逻辑</span><br/>1. 消去 <i>z</i> 得到交线在 <i>xy</i> 面的投影方程：$x^2+y^2=2$。<br/>2. 请注意：空间投影线方程必须成组书写为 $\\begin{cases} x^2+y^2=2 \\\\[0.2ex] z=0 \\end{cases}$。' 
    },
    'curve_parametric': {
        title: '参数方程投影',
        eq: '\\begin{cases} x=2\\cos t \\\\[0.5ex] y=2\\sin t \\\\[0.5ex] z=0.5t \\end{cases} \\implies x^2+y^2=4',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍参数消元</span><br/>消去参数 <i>t</i> 即可得到投影轨迹。对于螺旋线，其余弦平方关系导致其在垂直方向上的投影呈现为一个标准的圆周。'
    },

    // 空间平面相关场景
    'plane_point_normal': {
        title: '平面的点法式方程',
        eq: 'A(x - x_0) + B(y - y_0) + C(z - z_0) = 0',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍几何含义</span><br/>已知平面上一点 $M_0(x_0,y_0,z_0)$ 和法向量 $\\mathbf{n}=\\{A,B,C\\}$，平面上任意点 $M(x,y,z)$ 满足 $\\vec{M_0M} \\perp \\mathbf{n}$，即点积为零。<br/><br/>法向量垂直于平面内所有直线，是平面的核心几何属性。'
    },
    'plane_general': {
        title: '平面的一般方程',
        eq: 'Ax + By + Cz + D = 0',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍系数含义</span><br/>三元一次方程的系数 $\\{A,B,C\\}$ 对应平面的法向量。<br/><br/>- $D=0$ 时平面过原点<br/>- 缺 $x$ 项时平面平行于 $x$ 轴<br/>- 缺 $x,y$ 项时平面平行于 $xOy$ 平面'
    },
    'plane_intercept': {
        title: '平面的截距式方程',
        eq: '\\frac{x}{a} + \\frac{y}{b} + \\frac{z}{c} = 1',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍几何意义</span><br/>$a,b,c$ 分别为平面在 $x,y,z$ 轴上的截距。截距式便于绘制平面草图和计算平面与坐标轴围成的体积。'
    },
    'plane_angle': {
        title: '两平面的夹角',
        eq: '\\cos\\theta = \\frac{|A_1A_2 + B_1B_2 + C_1C_2|}{\\sqrt{A_1^2+B_1^2+C_1^2}\\sqrt{A_2^2+B_2^2+C_2^2}}',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍夹角定义</span><br/>两平面的夹角等于其法向量夹角的锐角值。<br/><br/>- 垂直：$\\mathbf{n}_1 \\cdot \\mathbf{n}_2 = 0$<br/>- 平行：$\\frac{A_1}{A_2} = \\frac{B_1}{B_2} = \\frac{C_1}{C_2}$'
    },
    'plane_distance': {
        title: '点到平面的距离',
        eq: 'd = \\frac{|Ax_0 + By_0 + Cz_0 + D|}{\\sqrt{A^2 + B^2 + C^2}}',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍几何原理</span><br/>距离是点到平面的垂线段长度，等于向量在法向量上的投影绝对值。分子的绝对值保证距离非负。'
    },

    // 空间直线相关场景
    'line_point_direction': {
        title: '直线的点向式方程',
        eq: '\\frac{x - x_0}{m} = \\frac{y - y_0}{n} = \\frac{z - z_0}{p}',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍几何含义</span><br/>已知直线上一点 $M_0(x_0,y_0,z_0)$ 和方向向量 $\\mathbf{s}=\\{m,n,p\\}$，直线上任意点 $M(x,y,z)$ 满足 $\\vec{M_0M} \\parallel \\mathbf{s}$，分量成比例。'
    },
    'line_parametric': {
        title: '直线的参数方程',
        eq: '\\begin{cases} x = x_0 + mt \\\\[0.5ex] y = y_0 + nt \\\\[0.5ex] z = z_0 + pt \\end{cases}',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍参数意义</span><br/>参数 $t$ 为任意实数，对应直线上的不同点。参数方程在求线面交点、分析直线运动时非常方便。'
    },
    'line_general': {
        title: '直线的一般方程',
        eq: '\\begin{cases} A_1x + B_1y + C_1z + D_1 = 0 \\\\[0.5ex] A_2x + B_2y + C_2z + D_2 = 0 \\end{cases}',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍几何含义</span><br/>直线可视为两个不平行平面的交线。方向向量等于两个平面法向量的叉乘：$\\mathbf{s} = \\mathbf{n}_1 \\times \\mathbf{n}_2$。'
    },
    'line_angle': {
        title: '两直线的夹角',
        eq: '\\cos\\varphi = \\frac{|\\mathbf{s}_1 \\cdot \\mathbf{s}_2|}{|\\mathbf{s}_1||\\mathbf{s}_2|}',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍夹角定义</span><br/>两直线的夹角等于其方向向量夹角的锐角值。<br/><br/>- 垂直：$\\mathbf{s}_1 \\cdot \\mathbf{s}_2 = 0$<br/>- 平行：方向向量分量成比例'
    },
    'line_plane_angle': {
        title: '直线与平面的夹角',
        eq: '\\sin\\phi = \\frac{|\\mathbf{n} \\cdot \\mathbf{s}|}{|\\mathbf{n}||\\mathbf{s}|}',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍夹角定义</span><br/>直线与平面的夹角是直线与它在平面内投影的夹角，与法线夹角互余，故使用正弦计算。<br/><br/>线面垂直时 $\\phi = 90^\\circ$，线面平行时 $\\phi = 0^\\circ$。'
    },
    'line_distance': {
        title: '点到直线的距离',
        eq: 'd = \\frac{|\\vec{M_1P_0} \\times \\mathbf{s}|}{|\\mathbf{s}|}',
        desc: '<span style="font-weight: 600; color: #2563EB;">▍几何原理</span><br/>利用向量外积的几何意义：外积的模等于平行四边形的面积，除以底边长（方向向量模长）即得到高（点到直线的距离）。'
    }
};

const currentData = ref(sceneData['dimension_concept']);

const renderedEquation = computed(() => {
    if (currentData.value && currentData.value.eq) {
        try {
            return katex.renderToString(currentData.value.eq, { displayMode: true, throwOnError: false });
        } catch (e) {
            return currentData.value.eq; // Fallback
        }
    }
    return '';
});

const renderedDesc = computed(() => {
    if (!currentData.value || !currentData.value.desc) return '';
    let text = currentData.value.desc;
    
    // 1. 处理 Markdown 加粗 **...**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #1E293B; font-weight: 600;">$1</strong>');
    
    // 2. 处理内联 LaTeX 公式 $...$
    text = text.replace(/\$([\s\S]*?)\$/g, (match, formula) => {
        try {
            return katex.renderToString(formula, {
                throwOnError: false,
                displayMode: false
            });
        } catch (e) {
            return match;
        }
    });

    return text;
});

let scene, camera, renderer, controls, currentGroup;
let animationId;
let rotationAngle = 0;
let THREE_local;
let ParametricGeometry_local;

const onResize = () => {
  if (!containerRef.value || !renderer || !camera) return;
  const width = containerRef.value.clientWidth;
  const height = containerRef.value.clientHeight;
  const aspect = width / height;
  
  isMobile.value = width < 768; // 同步移动端状态
  if (isMobile.value) {
      isMathPanelVisible.value = false; // 初始进入小屏默认收起
  } else {
      isMathPanelVisible.value = true;
  }
  
  if (isOrthographic.value) {
      const frustumHeight = camera.top - camera.bottom;
      camera.left = -frustumHeight * aspect / 2;
      camera.right = frustumHeight * aspect / 2;
  } else {
      camera.aspect = aspect;
  }
  
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

// 暴露给外部或内部使用的重置函数
const refreshState = () => {
    onResize();
};

const toggleCamera = () => {
    if (!renderer || !THREE_local) return;
    isOrthographic.value = !isOrthographic.value;
    
    const width = containerRef.value.clientWidth;
    const height = containerRef.value.clientHeight;
    const aspect = width / height;
    
    const oldPosition = camera.position.clone();
    const oldTarget = controls.target.clone();
    const distance = oldPosition.distanceTo(oldTarget) || 12;
    
    if (isOrthographic.value) {
        // Perspective -> Orthographic (视野大小等效转换)
        const frustumSize = distance * 0.828; 
        camera = new THREE_local.OrthographicCamera(
            frustumSize * aspect / -2,
            frustumSize * aspect / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            2000
        );
    } else {
        // Orthographic -> Perspective 
        camera = new THREE_local.PerspectiveCamera(45, aspect, 0.1, 2000);
    }
    
    camera.position.copy(oldPosition);
    controls.object = camera;
    controls.update();
    onResize();
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
  setTimeout(onResize, 50); 
};

onMounted(async () => {
    // SSR safe lazy load
    THREE_local = await import('three');
    const { OrbitControls } = await import('three/addons/controls/OrbitControls.js');
    const { ParametricGeometry } = await import('three/addons/geometries/ParametricGeometry.js');
    ParametricGeometry_local = ParametricGeometry;

    init(THREE_local, OrbitControls);
    onResize(); // 确保初始状态（如 mobile 适配）同步
    window.addEventListener('resize', onResize);

    // 监听深色模式切换，同步更新 3D 背景
    watch(isDark, (val) => {
        if (scene) {
            scene.background = new THREE_local.Color(val ? '#0B0F1A' : '#F8FAFC');
        }
    }, { immediate: true });
});

onBeforeUnmount(() => {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', onResize);
    if (renderer) {
        renderer.dispose();
        renderer.domElement.remove();
    }
});

function init(THREE, OrbitControls) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark.value ? '#0B0F1A' : '#F8FAFC');

    const width = containerRef.value.clientWidth;
    const height = containerRef.value.clientHeight;

    // 默认视角：X(向外) 朝向观察者，Z(向上) 被撑起，Y(向右)
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(14, 8, 16);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.value.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // --- 强制接管坐标系为大学数学高数板书绝对标准：X向着脸，Y向右，Z向上 ---
    // (Three.js Z = Math X, Three.js X = Math Y, Three.js Y = Math Z)
    const origin = new THREE.Vector3(0, 0, 0);
    const axisColor = 0x64748B; 
    const arrowLength = 5.5;
    const arrowHeadLength = 0.4;
    const arrowHeadWidth = 0.2;
    
    scene.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), origin, arrowLength, axisColor, arrowHeadLength, arrowHeadWidth)); // Math X (Three Z)
    scene.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, arrowLength, axisColor, arrowHeadLength, arrowHeadWidth)); // Math Y (Three X)
    scene.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), origin, arrowLength, axisColor, arrowHeadLength, arrowHeadWidth)); // Math Z (Three Y)

    const createLabel = (text, pos) => {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.font = 'bold 36px "Jost", sans-serif';
        ctx.fillStyle = '#DC2626'; 
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(text, 32, 32);
        const sprite = new THREE_local.Sprite(new THREE_local.SpriteMaterial({ map: new THREE_local.CanvasTexture(canvas), depthTest: false }));
        sprite.position.copy(pos);
        sprite.scale.set(1.5, 1.5, 1.5);
        scene.add(sprite);
    };
    createLabel('x', new THREE_local.Vector3(0, 0, 6.2)); // Three Z = Math X
    createLabel('y', new THREE_local.Vector3(6.2, 0, 0)); // Three X = Math Y
    createLabel('z', new THREE_local.Vector3(0, 6.2, 0)); // Three Y = Math Z

    const gridHelper = new THREE.GridHelper(10, 20, 0xe2e8f0, 0xf1f5f9);
    // GridHelper 默认是 XZ 平面 (y=0)，将其旋转到 XY 平面 (z=0) 更符合黑板二维习惯，或者保留三维地板网格
    // scene.add(gridHelper); 
    // 若要画地板，留作 XZ 面的背景也可以，但完全干净的白板更高级！

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 8);
    scene.add(directionalLight);

    currentGroup = new THREE.Group();
    scene.add(currentGroup);

    setTopic('surfaces');
    animate();
}

function setTopic(topic) {
    currentTopic.value = topic;
    if (topic === 'surfaces') setScene('dimension_concept');
    else if (topic === 'curves') setScene('curve_cylinder');
    else if (topic === 'planes') setScene('plane_point_normal');
    else if (topic === 'lines') setScene('line_point_direction');
}

function setScene(type) {
    if (!THREE_local || !ParametricGeometry_local) return;

    currentType.value = type;
    rotationAngle = 0;
    currentData.value = sceneData[type];

    // 加载对应场景的参数配置
    if (paramTemplates[type]) {
        currentParams.value = JSON.parse(JSON.stringify(paramTemplates[type]));
        showParamPanel.value = !isMobile.value; // 桌面端默认显示参数面板
    } else {
        showParamPanel.value = false;
    }

    while(currentGroup.children.length > 0){ 
        currentGroup.remove(currentGroup.children[0]); 
    }

    const material = new THREE_local.MeshPhongMaterial({ 
        color: 0x2563eb, 
        side: THREE_local.DoubleSide, 
        transparent: true, 
        opacity: 0.85,
        wireframe: true 
    });

    if (type === 'dimension_concept') {
        const curvePoints = [];
        for(let i=0; i<=64; i++){
            const t = (i/64) * Math.PI * 2;
            curvePoints.push(new THREE_local.Vector3(2 * Math.sin(t), 0, 2 * Math.cos(t))); // Math X(ThreeZ), Math Y(ThreeX)
        }
        const curveGeom = new THREE_local.BufferGeometry().setFromPoints(curvePoints);
        const curveMat = new THREE_local.LineBasicMaterial({ color: 0xF97316, linewidth: 4 });
        const line = new THREE_local.Line(curveGeom, curveMat);
        currentGroup.add(line);

        const cylGeom = new THREE_local.CylinderGeometry(2, 2, 1, 64, 1, true); // 立于 Three Y (Math Z)
        const mesh = new THREE_local.Mesh(cylGeom, material);
        mesh.scale.set(1, 0.001, 1); 
        mesh.material.opacity = 0;
        mesh.name = 'extrusionMesh';
        currentGroup.add(mesh);

    } else if (type.startsWith('rot_')) {
        let points1, points2;
        let groupRot = new THREE_local.Euler(0, 0, 0);
        let meshLocalRot = 0;
        let mapCurveTo3D = p => new THREE_local.Vector3(0, 0, 0);

        if (type === 'rot_z') {
            points1 = [];
            for (let h = 0; h <= 3; h += 0.2) {
                points1.push(new THREE_local.Vector2(Math.sqrt(h), h)); 
            }
            mapCurveTo3D = p => new THREE_local.Vector3(p.x, p.y, 0); // Math X=0, h=Math Z(ThreeY), r=Math Y(ThreeX)
            groupRot.set(0, 0, 0); 
            meshLocalRot = 0;
        } else if (type === 'rot_y') {
            points1 = [];
            for (let h = -2.2; h <= 2.2; h += 0.1) {
                points1.push(new THREE_local.Vector2(Math.sqrt(1 + h * h), h)); 
            }
            mapCurveTo3D = p => new THREE_local.Vector3(p.y, 0, p.x); // Math X(ThreeZ)=p.x, Math Y(ThreeX)=p.y
            groupRot.set(0, 0, -Math.PI / 2); // Local Y 转向 Three X
            meshLocalRot = Math.PI / 2; // 抵消 Lathe 默认起点差异
        } else if (type === 'rot_x') {
            points1 = [];
            points2 = [];
            for (let h = 1; h <= 2.8; h += 0.1) {
                points1.push(new THREE_local.Vector2(Math.sqrt(h * h - 1), h)); 
                points2.push(new THREE_local.Vector2(Math.sqrt(h * h - 1), -h));
            }
            mapCurveTo3D = p => new THREE_local.Vector3(p.x, 0, p.y); // Math X(ThreeZ)=p.y, Math Y(ThreeX)=p.x
            groupRot.set(Math.PI / 2, 0, 0); // Local Y 转向 Three Z
            meshLocalRot = 0;
        }

        const rotGroup = new THREE_local.Group();
        rotGroup.name = 'rotGroup';
        rotGroup.rotation.copy(groupRot);
        currentGroup.add(rotGroup);

        const lineMat = new THREE_local.LineBasicMaterial({ color: 0xF97316, linewidth: 4 });
        const staticLineMat = new THREE_local.LineBasicMaterial({ color: 0x94A3B8, linewidth: 2, transparent: true, opacity: 0.5 });
        
        const createPart = (pts, index) => {
            const staticLine = new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(pts.map(mapCurveTo3D)), staticLineMat);
            currentGroup.add(staticLine);

            const line3D = pts.map(p => new THREE_local.Vector3(p.x, p.y, 0));
            const line = new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(line3D), lineMat);
            line.name = 'gen' + index;
            line.rotation.y = meshLocalRot;
            rotGroup.add(line);

            const m = new THREE_local.Mesh(new THREE_local.LatheGeometry(pts, 64, 0, 0.01), material);
            m.name = 'lathe' + index;
            m.userData = { points: pts, startRot: meshLocalRot };
            m.rotation.y = meshLocalRot;
            rotGroup.add(m);
        };
        
        createPart(points1, 1);
        if (points2) createPart(points2, 2);

    } else if (type === 'ellipsoid') {
        const geom = new THREE_local.SphereGeometry(1, 64, 64);
        const mesh = new THREE_local.Mesh(geom, material);
        mesh.scale.set(2, 1.5, 3); // Three X(Math Y), Three Y(Math Z), Three Z(Math X)
        currentGroup.add(mesh);

    } else if (type === 'hyperboloid') {
        const geom = new ParametricGeometry_local((u, v, target) => {
            const z = (u - 0.5) * 4;
            const theta = v * Math.PI * 2;
            const r = Math.sqrt(1 + z*z);
            target.set(r * Math.sin(theta), z, r * Math.cos(theta)); 
        }, 40, 40);
        const mesh = new THREE_local.Mesh(geom, material);
        currentGroup.add(mesh);

    } else if (type === 'cyl_circular') {
        const geom = new THREE_local.CylinderGeometry(2, 2, 6, 64, 1, true); 
        const mesh = new THREE_local.Mesh(geom, material);
        currentGroup.add(mesh);

    } else if (type === 'cyl_parabolic') {
        const geom = new ParametricGeometry_local((u, v, target) => {
            const x = (u - 0.5) * 4;
            const z = (v - 0.5) * 6;
            const y = (x * x) / 2; // y=x^2
            target.set(y, z, x); // Three X(Math Y), Three Y(Math Z), Three Z(Math X)
        }, 40, 40);
        const mesh = new THREE_local.Mesh(geom, material);
        currentGroup.add(mesh);

    } else if (type === 'saddle') {
        const geom = new ParametricGeometry_local((u, v, target) => {
            const x = (u - 0.5) * 4;
            const y = (v - 0.5) * 4;
            const z = (x*x - y*y) / 2;
            target.set(y, z, x);
        }, 40, 40);
        const mesh = new THREE_local.Mesh(geom, material);
        currentGroup.add(mesh);

    } else if (type === 'curve_cylinder') {
        // 模型：平面 z = x + y 与圆柱 x^2 + y^2 = 1 相交
        const r = 2;
        const curvePoints = [];
        for (let t = 0; t <= Math.PI * 2; t += 0.1) {
            const x = r * Math.cos(t);
            const y = r * Math.sin(t);
            const z = (x + y) / 1.5 + 2; 
            curvePoints.push(new THREE_local.Vector3(y, z, x));
        }
        const curveGeom = new THREE_local.BufferGeometry().setFromPoints(curvePoints);
        const curveMat = new THREE_local.LineBasicMaterial({ color: 0xF97316, linewidth: 4 });
        currentGroup.add(new THREE_local.Line(curveGeom, curveMat));

        // 投射柱面 (Genesis Wall)
        const wallMat = new THREE_local.MeshPhongMaterial({ color: 0x94A3B8, transparent: true, opacity: 0.2, side: THREE_local.DoubleSide });
        const wallGeom = new THREE_local.CylinderGeometry(r, r, 6, 64, 1, true);
        wallGeom.translate(0, 3, 0); // 底部对齐 xy 面
        const wallMesh = new THREE_local.Mesh(wallGeom, wallMat);
        currentGroup.add(wallMesh);

        // 地面投影圆周轨迹
        const projPts_cyl = [];
        for (let t = 0; t <= Math.PI * 2 + 0.1; t += 0.1) {
            projPts_cyl.push(new THREE_local.Vector3(r * Math.sin(t), 0, r * Math.cos(t)));
        }
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(projPts_cyl), new THREE_local.LineBasicMaterial({ color: 0xF97316, linewidth: 4 })));

    } else if (type === 'curve_intersect') {
        const pMat = new THREE_local.MeshPhongMaterial({ color: 0x2563eb, transparent: true, opacity: 0.25, wireframe: true });
        
        // z = x^2 + y^2 (向上)
        const p1Geom = new ParametricGeometry_local((u, v, target) => {
            const r = u * 3;
            const theta = v * Math.PI * 2;
            target.set(r * Math.sin(theta), r * r / 2, r * Math.cos(theta));
        }, 20, 20);
        currentGroup.add(new THREE_local.Mesh(p1Geom, pMat));
        
        // z = 4.5 - (x^2 + y^2) (向下)
        const p2Geom = new ParametricGeometry_local((u, v, target) => {
            const r = u * 3;
            const theta = v * Math.PI * 2;
            target.set(r * Math.sin(theta), 4.5 - (r * r / 2), r * Math.cos(theta));
        }, 20, 20);
        currentGroup.add(new THREE_local.Mesh(p2Geom, pMat));

        // 交线与投影: z = 2.25, r = sqrt(4.5)
        const r_int = 2.12; 
        const pts = [];
        const projPts = [];
        for (let t = 0; t <= Math.PI * 2 + 0.1; t += 0.1) {
            pts.push(new THREE_local.Vector3(r_int * Math.sin(t), 2.25, r_int * Math.cos(t)));
            projPts.push(new THREE_local.Vector3(r_int * Math.sin(t), 0, r_int * Math.cos(t)));
        }
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(pts), new THREE_local.LineBasicMaterial({ color: 0x2563eb, linewidth: 4 })));
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(projPts), new THREE_local.LineBasicMaterial({ color: 0xF97316, linewidth: 4 })));

    } else if (type === 'curve_parametric') {
        const curvePoints = [];
        const projPoints = [];
        const a = 2, b = 0.5;
        for (let t = 0; t < Math.PI * 4; t += 0.05) {
            const x = a * Math.cos(t);
            const y = a * Math.sin(t);
            const z = b * t;
            curvePoints.push(new THREE_local.Vector3(y, z, x));
            projPoints.push(new THREE_local.Vector3(y, 0, x));
        }

        const curveGeom = new THREE_local.BufferGeometry().setFromPoints(curvePoints);
        const curveMat = new THREE_local.LineBasicMaterial({ color: 0x2563eb, linewidth: 3 });
        currentGroup.add(new THREE_local.Line(curveGeom, curveMat));

        const projGeom = new THREE_local.BufferGeometry().setFromPoints(projPoints);
        const projMat = new THREE_local.LineBasicMaterial({ color: 0xF97316, linewidth: 4 });
        currentGroup.add(new THREE_local.Line(projGeom, projMat));

        for(let i=0; i<curvePoints.length; i+=15) {
            const points = [curvePoints[i], projPoints[i]];
            const l = new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(points), new THREE_local.LineDashedMaterial({ color: 0x94A3B8, dashSize: 0.2, gapSize: 0.1 }));
            l.computeLineDistances();
            currentGroup.add(l);
        }

    // ==================== 空间平面场景 ====================
    } else if (type === 'plane_point_normal') {
        const p = currentParams.value;
        // 平面方程：Ax + By + Cz + D = 0 => z = (-Ax - By - D)/C
        const planeGeom = new ParametricGeometry_local((u, v, target) => {
            const x = (u - 0.5) * 8;
            const y = (v - 0.5) * 8;
            const z = Math.abs(p.C) > 0.01 ? (-p.A * x - p.B * y - p.D) / p.C : 0;
            target.set(y, z, x);
        }, 20, 20);
        const planeMat = new THREE_local.MeshPhongMaterial({
            color: 0x2563eb,
            side: THREE_local.DoubleSide,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        currentGroup.add(new THREE_local.Mesh(planeGeom, planeMat));

        // 计算平面上的一个点（找特殊点）
        let px = 0, py = 0, pz = 0;
        if (Math.abs(p.C) > 0.01) pz = (-p.A * px - p.B * py - p.D) / p.C;
        else if (Math.abs(p.B) > 0.01) py = (-p.A * px - p.C * pz - p.D) / p.B;
        else if (Math.abs(p.A) > 0.01) px = (-p.B * py - p.C * pz - p.D) / p.A;

        const normalOrigin = new THREE_local.Vector3(py, pz, px);
        const normalDir = new THREE_local.Vector3(p.B, p.C, p.A).normalize(); // 映射到Three坐标系
        const normalArrow = new THREE_local.ArrowHelper(
            normalDir, normalOrigin, 3, 0xF97316, 0.3, 0.15
        );
        currentGroup.add(normalArrow);

        // 标记平面上的点
        const pointGeom = new THREE_local.SphereGeometry(0.15, 16, 16);
        const pointMat = new THREE_local.MeshBasicMaterial({ color: 0xF97316 });
        const pointMesh = new THREE_local.Mesh(pointGeom, pointMat);
        pointMesh.position.copy(normalOrigin);
        currentGroup.add(pointMesh);

    } else if (type === 'plane_general') {
        const p = currentParams.value;
        // 平面方程：Ax + By + Cz + D = 0
        const planeGeom = new ParametricGeometry_local((u, v, target) => {
            const x = (u - 0.5) * 8;
            const z = (v - 0.5) * 8;
            const y = Math.abs(p.B) > 0.01 ? (-p.A * x - p.C * z - p.D) / p.B : 0;
            target.set(y, z, x);
        }, 20, 20);
        const planeMat = new THREE_local.MeshPhongMaterial({
            color: 0x2563eb,
            side: THREE_local.DoubleSide,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        currentGroup.add(new THREE_local.Mesh(planeGeom, planeMat));

        // 绘制平面与坐标轴的交点
        const pointMat = new THREE_local.MeshBasicMaterial({ color: 0xF97316 });
        const origin = new THREE_local.Mesh(new THREE_local.SphereGeometry(0.15, 16, 16), pointMat);
        origin.position.set(0, 0, 0); // 原点在平面上
        currentGroup.add(origin);

    } else if (type === 'plane_intercept') {
        const p = currentParams.value;
        // 截距式：x/a + y/b + z/c = 1
        const planeGeom = new ParametricGeometry_local((u, v, target) => {
            const s = u;
            const t = v * (1 - u);
            const x = s * p.a;
            const y = t * p.b;
            const z = p.c * (1 - s - t);
            target.set(y, z, x);
        }, 20, 20);
        const planeMat = new THREE_local.MeshPhongMaterial({
            color: 0x2563eb,
            side: THREE_local.DoubleSide,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        currentGroup.add(new THREE_local.Mesh(planeGeom, planeMat));

        // 标记三个截距点
        const pointMat = new THREE_local.MeshBasicMaterial({ color: 0xF97316 });
        const points = [
            new THREE_local.Vector3(0, 0, p.a),   // x轴截距 (a,0,0)
            new THREE_local.Vector3(p.b, 0, 0),   // y轴截距 (0,b,0)
            new THREE_local.Vector3(0, p.c, 0)    // z轴截距 (0,0,c)
        ];
        points.forEach(pos => {
            const point = new THREE_local.Mesh(new THREE_local.SphereGeometry(0.15, 16, 16), pointMat);
            point.position.copy(pos);
            currentGroup.add(point);
        });

        // 绘制平面与坐标轴的连线
        const lineMat = new THREE_local.LineBasicMaterial({ color: 0xF97316, linewidth: 2 });
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints([points[0], points[1]]), lineMat));
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints([points[1], points[2]]), lineMat));
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints([points[2], points[0]]), lineMat));

    } else if (type === 'plane_angle') {
        const p = currentParams.value;
        const planeMat1 = new THREE_local.MeshPhongMaterial({
            color: 0x2563eb,
            side: THREE_local.DoubleSide,
            transparent: true,
            opacity: 0.4,
            wireframe: true
        });
        const planeMat2 = new THREE_local.MeshPhongMaterial({
            color: 0x10B981,
            side: THREE_local.DoubleSide,
            transparent: true,
            opacity: 0.4,
            wireframe: true
        });

        // 平面1：n1x * x + n1y * y + n1z * z = 0
        const planeGeom1 = new ParametricGeometry_local((u, v, target) => {
            const x = (u - 0.5) * 6;
            const y = (v - 0.5) * 6;
            const z = Math.abs(p.n1z) > 0.01 ? (-p.n1x * x - p.n1y * y) / p.n1z : 0;
            target.set(y, z, x);
        }, 20, 20);
        currentGroup.add(new THREE_local.Mesh(planeGeom1, planeMat1));

        // 平面2：n2x * x + n2y * y + n2z * z = 0
        const planeGeom2 = new ParametricGeometry_local((u, v, target) => {
            const x = (u - 0.5) * 6;
            const y = (v - 0.5) * 6;
            const z = Math.abs(p.n2z) > 0.01 ? (-p.n2x * x - p.n2y * y) / p.n2z : 0;
            target.set(y, z, x);
        }, 20, 20);
        currentGroup.add(new THREE_local.Mesh(planeGeom2, planeMat2));

        // 计算交线方向：两个法向量的叉乘
        const dirX = p.n1y * p.n2z - p.n1z * p.n2y;
        const dirY = p.n1z * p.n2x - p.n1x * p.n2z;
        const dirZ = p.n1x * p.n2y - p.n1y * p.n2x;

        // 绘制交线
        const linePoints = [];
        for (let t = -3; t <= 3; t += 0.1) {
            const x = dirX * t;
            const y = dirY * t;
            const z = dirZ * t;
            linePoints.push(new THREE_local.Vector3(y, z, x));
        }
        const lineMat = new THREE_local.LineBasicMaterial({ color: 0xF97316, linewidth: 4 });
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(linePoints), lineMat));

        // 绘制法向量
        const normal1 = new THREE_local.ArrowHelper(
            new THREE_local.Vector3(p.n1y, p.n1z, p.n1x).normalize(),
            new THREE_local.Vector3(0, 0, 0), 2, 0x2563eb, 0.2, 0.1
        );
        const normal2 = new THREE_local.ArrowHelper(
            new THREE_local.Vector3(p.n2y, p.n2z, p.n2x).normalize(),
            new THREE_local.Vector3(0, 0, 0), 2, 0x10B981, 0.2, 0.1
        );
        currentGroup.add(normal1);
        currentGroup.add(normal2);

    } else if (type === 'plane_distance') {
        const p = currentParams.value;
        // 平面方程：Ax + By + Cz + D = 0
        const planeGeom = new ParametricGeometry_local((u, v, target) => {
            const x = (u - 0.5) * 8;
            const y = (v - 0.5) * 8;
            const z = Math.abs(p.C) > 0.01 ? (-p.A * x - p.B * y - p.D) / p.C : 0;
            target.set(y, z, x);
        }, 20, 20);
        const planeMat = new THREE_local.MeshPhongMaterial({
            color: 0x2563eb,
            side: THREE_local.DoubleSide,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });
        currentGroup.add(new THREE_local.Mesh(planeGeom, planeMat));

        // 标记点 P0
        const p0Pos = new THREE_local.Vector3(p.py, p.pz, p.px); // Math(x,y,z) -> Three(y,z,x)
        const origin = new THREE_local.Mesh(
            new THREE_local.SphereGeometry(0.15, 16, 16),
            new THREE_local.MeshBasicMaterial({ color: 0xF97316 })
        );
        origin.position.copy(p0Pos);
        currentGroup.add(origin);

        // 计算垂足坐标
        const denominator = p.A * p.A + p.B * p.B + p.C * p.C;
        const t = -(p.A * p.px + p.B * p.py + p.C * p.pz + p.D) / denominator;
        const hx = p.px + t * p.A;
        const hy = p.py + t * p.B;
        const hz = p.pz + t * p.C;
        const footPos = new THREE_local.Vector3(hy, hz, hx);

        // 平面内的参考点 M1
        let m1x = 1, m1y = 0, m1z = 0;
        if (Math.abs(p.C) > 0.01) m1z = (-p.A * m1x - p.B * m1y - p.D) / p.C;
        const m1Point = new THREE_local.Vector3(m1y, m1z, m1x);
        const m1Mesh = new THREE_local.Mesh(
            new THREE_local.SphereGeometry(0.12, 16, 16),
            new THREE_local.MeshBasicMaterial({ color: 0x94A3B8 })
        );
        m1Mesh.position.copy(m1Point);
        currentGroup.add(m1Mesh);

        // 绘制向量 M1P0
        const vecLine = new THREE_local.Line(
            new THREE_local.BufferGeometry().setFromPoints([m1Point, p0Pos]),
            new THREE_local.LineBasicMaterial({ color: 0x94A3B8, linewidth: 2 })
        );
        currentGroup.add(vecLine);

        // 绘制垂线段 P0H
        const distanceLine = new THREE_local.Line(
            new THREE_local.BufferGeometry().setFromPoints([p0Pos, footPos]),
            new THREE_local.LineDashedMaterial({ color: 0xF97316, dashSize: 0.1, gapSize: 0.05, linewidth: 3 })
        );
        distanceLine.computeLineDistances();
        currentGroup.add(distanceLine);

        // 绘制法向量示意
        const normalArrow = new THREE_local.ArrowHelper(
            new THREE_local.Vector3(p.B, p.C, p.A).normalize(),
            footPos, 1.5, 0x10B981, 0.2, 0.1
        );
        currentGroup.add(normalArrow);

        // 标记垂足 H
        const footPoint = new THREE_local.Mesh(
            new THREE_local.SphereGeometry(0.15, 16, 16),
            new THREE_local.MeshBasicMaterial({ color: 0x10B981 })
        );
        footPoint.position.copy(footPos);
        currentGroup.add(footPoint);

    // ==================== 空间直线场景 ====================
    } else if (type === 'line_point_direction') {
        const p = currentParams.value;
        // 点向式：(x-x0)/m = (y-y0)/n = (z-z0)/p
        const linePoints = [];
        for (let t = -3; t <= 3; t += 0.1) {
            const x = p.x0 + p.m * t; // Math X
            const y = p.y0 + p.n * t; // Math Y
            const z = p.z0 + p.p * t; // Math Z
            linePoints.push(new THREE_local.Vector3(y, z, x));
        }
        const lineMat = new THREE_local.LineBasicMaterial({ color: 0x2563eb, linewidth: 4 });
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(linePoints), lineMat));

        // 标记直线上的点 M0(x0,y0,z0)
        const pointMat = new THREE_local.MeshBasicMaterial({ color: 0xF97316 });
        const pointPos = new THREE_local.Vector3(p.y0, p.z0, p.x0);
        const point = new THREE_local.Mesh(new THREE_local.SphereGeometry(0.15, 16, 16), pointMat);
        point.position.copy(pointPos);
        currentGroup.add(point);

        // 绘制方向向量
        const dirArrow = new THREE_local.ArrowHelper(
            new THREE_local.Vector3(p.n, p.p, p.m).normalize(), // 方向向量{m,n,p}
            pointPos, 2.5, 0xF97316, 0.3, 0.15
        );
        currentGroup.add(dirArrow);

    } else if (type === 'line_parametric') {
        const p = currentParams.value;
        // 参数方程：x = x0 + vx*t, y = y0 + vy*t, z = z0 + vz*t
        const linePoints = [];
        for (let t = -3; t <= 3; t += 0.1) {
            const x = p.x0 + p.vx * t;
            const y = p.y0 + p.vy * t;
            const z = p.z0 + p.vz * t;
            linePoints.push(new THREE_local.Vector3(y, z, x));
        }
        const lineMat = new THREE_local.LineBasicMaterial({ color: 0x2563eb, linewidth: 4 });
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(linePoints), lineMat));

        // 标记t=0, t=1, t=-1三个点
        const pointMat = new THREE_local.MeshBasicMaterial({ color: 0xF97316 });
        const points = [
            new THREE_local.Vector3(p.y0, p.z0, p.x0),   // t=0
            new THREE_local.Vector3(p.y0 + p.vy, p.z0 + p.vz, p.x0 + p.vx),   // t=1
            new THREE_local.Vector3(p.y0 - p.vy, p.z0 - p.vz, p.x0 - p.vx)    // t=-1
        ];
        points.forEach((pos, i) => {
            const point = new THREE_local.Mesh(new THREE_local.SphereGeometry(0.15, 16, 16), pointMat);
            point.position.copy(pos);
            currentGroup.add(point);
        });

    } else if (type === 'line_general') {
        const p = currentParams.value;
        // 直线作为两平面交线：A1x + B1y + C1z + D1 = 0 和 A2x + B2y + C2z + D2 = 0
        const planeMat1 = new THREE_local.MeshPhongMaterial({
            color: 0x2563eb,
            side: THREE_local.DoubleSide,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const planeMat2 = new THREE_local.MeshPhongMaterial({
            color: 0x10B981,
            side: THREE_local.DoubleSide,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });

        // 平面1
        const planeGeom1 = new ParametricGeometry_local((u, v, target) => {
            const x = (u - 0.5) * 6;
            const y = (v - 0.5) * 6;
            const z = Math.abs(p.C1) > 0.01 ? (-p.A1 * x - p.B1 * y - p.D1) / p.C1 : 0;
            target.set(y, z, x);
        }, 20, 20);
        currentGroup.add(new THREE_local.Mesh(planeGeom1, planeMat1));

        // 平面2
        const planeGeom2 = new ParametricGeometry_local((u, v, target) => {
            const x = (u - 0.5) * 6;
            const y = (v - 0.5) * 6;
            const z = Math.abs(p.C2) > 0.01 ? (-p.A2 * x - p.B2 * y - p.D2) / p.C2 : 0;
            target.set(y, z, x);
        }, 20, 20);
        currentGroup.add(new THREE_local.Mesh(planeGeom2, planeMat2));

        // 计算交线方向：两个法向量的叉乘
        const dirX = p.B1 * p.C2 - p.C1 * p.B2;
        const dirY = p.C1 * p.A2 - p.A1 * p.C2;
        const dirZ = p.A1 * p.B2 - p.B1 * p.A2;

        // 找直线上一点
        let x0 = 0, y0 = 0, z0 = 0;
        // 解联立方程找一个解
        const det = p.A1 * p.B2 - p.A2 * p.B1;
        if (Math.abs(det) > 0.01) {
            // 消去z，解x和y
            y0 = (p.A2 * (-p.D1) - p.A1 * (-p.D2)) / det;
            x0 = (p.B2 * (-p.D1) - p.B1 * (-p.D2)) / -det;
            if (Math.abs(p.C1) > 0.01) {
                z0 = (-p.A1 * x0 - p.B1 * y0 - p.D1) / p.C1;
            }
        }

        // 绘制交线
        const linePoints = [];
        for (let t = -2; t <= 2; t += 0.1) {
            const x = x0 + dirX * t;
            const y = y0 + dirY * t;
            const z = z0 + dirZ * t;
            linePoints.push(new THREE_local.Vector3(y, z, x));
        }
        const lineMat = new THREE_local.LineBasicMaterial({ color: 0xF97316, linewidth: 4 });
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(linePoints), lineMat));

    } else if (type === 'line_angle') {
        const p = currentParams.value;
        const lineMat1 = new THREE_local.LineBasicMaterial({ color: 0x2563eb, linewidth: 3 });
        const lineMat2 = new THREE_local.LineBasicMaterial({ color: 0x10B981, linewidth: 3 });

        // 直线1：过原点，方向{s1x, s1y, s1z}
        const line1Points = [];
        for (let t = -3; t <= 3; t += 0.1) {
            const x = p.s1x * t;
            const y = p.s1y * t;
            const z = p.s1z * t;
            line1Points.push(new THREE_local.Vector3(y, z, x));
        }
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(line1Points), lineMat1));

        // 直线2：过原点，方向{s2x, s2y, s2z}
        const line2Points = [];
        for (let t = -3; t <= 3; t += 0.1) {
            const x = p.s2x * t;
            const y = p.s2y * t;
            const z = p.s2z * t;
            line2Points.push(new THREE_local.Vector3(y, z, x));
        }
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(line2Points), lineMat2));

        // 绘制方向向量
        const dir1 = new THREE_local.ArrowHelper(
            new THREE_local.Vector3(p.s1y, p.s1z, p.s1x).normalize(),
            new THREE_local.Vector3(0, 0, 0), 2, 0x2563eb, 0.2, 0.1
        );
        const dir2 = new THREE_local.ArrowHelper(
            new THREE_local.Vector3(p.s2y, p.s2z, p.s2x).normalize(),
            new THREE_local.Vector3(0, 0, 0), 2, 0x10B981, 0.2, 0.1
        );
        currentGroup.add(dir1);
        currentGroup.add(dir2);

    } else if (type === 'line_plane_angle') {
        const p = currentParams.value;
        // 平面方程：nx*x + ny*y + nz*z = 0
        const planeGeom = new ParametricGeometry_local((u, v, target) => {
            const x = (u - 0.5) * 6;
            const y = (v - 0.5) * 6;
            const z = Math.abs(p.nz) > 0.01 ? (-p.nx * x - p.ny * y) / p.nz : 0;
            target.set(y, z, x);
        }, 20, 20);
        const planeMat = new THREE_local.MeshPhongMaterial({
            color: 0x2563eb,
            side: THREE_local.DoubleSide,
            transparent: true,
            opacity: 0.4,
            wireframe: true
        });
        currentGroup.add(new THREE_local.Mesh(planeGeom, planeMat));

        // 直线：过原点，方向向量{sx, sy, sz}
        const linePoints = [];
        for (let t = -2; t <= 2; t += 0.1) {
            const x = p.sx * t;
            const y = p.sy * t;
            const z = p.sz * t;
            linePoints.push(new THREE_local.Vector3(y, z, x));
        }
        const lineMat = new THREE_local.LineBasicMaterial({ color: 0xF97316, linewidth: 4 });
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(linePoints), lineMat));

        // 交点在原点
        const intersectPoint = new THREE_local.Vector3(0, 0, 0);

        // 标记交点P
        const intersectMesh = new THREE_local.Mesh(
            new THREE_local.SphereGeometry(0.15, 16, 16),
            new THREE_local.MeshBasicMaterial({ color: 0x10B981 })
        );
        intersectMesh.position.copy(intersectPoint);
        currentGroup.add(intersectMesh);

        // 绘制平面法向量
        const normalArrow = new THREE_local.ArrowHelper(
            new THREE_local.Vector3(p.ny, p.nz, p.nx).normalize(),
            intersectPoint, 2, 0x2563eb, 0.2, 0.1
        );
        currentGroup.add(normalArrow);

        // 绘制直线方向向量
        const lineDirArrow = new THREE_local.ArrowHelper(
            new THREE_local.Vector3(p.sy, p.sz, p.sx).normalize(),
            intersectPoint, 2, 0xF97316, 0.2, 0.1
        );
        currentGroup.add(lineDirArrow);

    } else if (type === 'line_distance') {
        const p = currentParams.value;
        // 直线过点(lx0, ly0, lz0)，方向向量{sm, sn, sp}
        const linePoints = [];
        for (let t = -3; t <= 3; t += 0.1) {
            const x = p.lx0 + p.sm * t;
            const y = p.ly0 + p.sn * t;
            const z = p.lz0 + p.sp * t;
            linePoints.push(new THREE_local.Vector3(y, z, x));
        }
        const lineMat = new THREE_local.LineBasicMaterial({ color: 0x2563eb, linewidth: 3 });
        currentGroup.add(new THREE_local.Line(new THREE_local.BufferGeometry().setFromPoints(linePoints), lineMat));

        // 标记外点 P(px, py, pz)
        const p0Pos = new THREE_local.Vector3(p.py, p.pz, p.px);
        const pointP0 = new THREE_local.Mesh(
            new THREE_local.SphereGeometry(0.15, 16, 16),
            new THREE_local.MeshBasicMaterial({ color: 0xF97316 })
        );
        pointP0.position.copy(p0Pos);
        currentGroup.add(pointP0);

        // 计算垂足：t = ((px - lx0)*sm + (py - ly0)*sn + (pz - lz0)*sp) / (sm² + sn² + sp²)
        const dx = p.px - p.lx0;
        const dy = p.py - p.ly0;
        const dz = p.pz - p.lz0;
        const denominator = p.sm * p.sm + p.sn * p.sn + p.sp * p.sp;
        const t = (dx * p.sm + dy * p.sn + dz * p.sp) / denominator;

        // 垂足坐标
        const hx = p.lx0 + p.sm * t;
        const hy = p.ly0 + p.sn * t;
        const hz = p.lz0 + p.sp * t;
        const footPos = new THREE_local.Vector3(hy, hz, hx);

        const footPoint = new THREE_local.Mesh(
            new THREE_local.SphereGeometry(0.15, 16, 16),
            new THREE_local.MeshBasicMaterial({ color: 0x10B981 })
        );
        footPoint.position.copy(footPos);
        currentGroup.add(footPoint);

        // 绘制垂线段
        const distanceLine = new THREE_local.Line(
            new THREE_local.BufferGeometry().setFromPoints([p0Pos, footPos]),
            new THREE_local.LineDashedMaterial({ color: 0xF97316, dashSize: 0.1, gapSize: 0.05, linewidth: 3 })
        );
        distanceLine.computeLineDistances();
        currentGroup.add(distanceLine);
    }
}

function animate() {
    animationId = requestAnimationFrame(animate);
    
    if (currentType.value === 'dimension_concept' && THREE_local) {
        const mesh = currentGroup.getObjectByName('extrusionMesh');
        if (mesh) {
            rotationAngle += 0.008; 
            if (rotationAngle <= 1.0) {
                const t = Math.sin(rotationAngle * Math.PI / 2);
                mesh.scale.y = t * 4 + 0.001; // Math Z (Three Y) 膨胀
                mesh.material.opacity = t * 0.85; 
            } else if (rotationAngle > 1.8) {
                rotationAngle = 0;
            }
        }
    } else if (currentType.value.startsWith('rot_') && THREE_local) {
        const rotGroup = currentGroup.getObjectByName('rotGroup');
        if (rotGroup) {
            const m1 = rotGroup.getObjectByName('lathe1');
            const m2 = rotGroup.getObjectByName('lathe2');
            const l1 = rotGroup.getObjectByName('gen1');
            const l2 = rotGroup.getObjectByName('gen2');
            
            if (rotationAngle < Math.PI * 2) {
                rotationAngle += 0.05;
                m1.geometry.dispose();
                m1.geometry = new THREE_local.LatheGeometry(m1.userData.points, 64, 0, rotationAngle);
                l1.rotation.y = m1.userData.startRot + rotationAngle;
                
                if (m2) {
                    m2.geometry.dispose();
                    m2.geometry = new THREE_local.LatheGeometry(m2.userData.points, 64, 0, rotationAngle);
                    l2.rotation.y = m2.userData.startRot + rotationAngle;
                }
            } else {
                rotationAngle += 0.01;
                if (rotationAngle > Math.PI * 2 + 1.5) {
                    rotationAngle = 0;
                }
            }
        }
    }

    if(controls) controls.update();
    if(renderer && scene && camera) renderer.render(scene, camera);
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@1,6..96,400;1,6..96,600&family=Jost:wght@400;500;600&display=swap');

/* =========== 新增 UI 遮罩与模糊动画 ============ */
.preview-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(240, 245, 252, 0.45);
    backdrop-filter: blur(12px) saturate(120%);
    -webkit-backdrop-filter: blur(12px) saturate(120%);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.4s ease;
}

.overlay-card {
    background: rgba(255, 255, 255, 0.85);
    padding: 32px 40px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255,255,255,0.7) inset;
    border: 1px solid rgba(255, 255, 255, 0.4);
    max-width: 400px;
    transform: translateY(-8px);
    transition: all 0.3s ease;
}

.dark .overlay-card {
    background: rgba(30, 41, 59, 0.85);
    border-color: rgba(255, 255, 255, 0.05);
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.4);
}

.dark .overlay-card h3 { color: #F8FAFC; }
.dark .overlay-card p { color: #94A3B8; }

@keyframes floatUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
}

.icon-box {
    width: 64px;
    height: 64px;
    margin: 0 auto 16px;
    background: #EFF6FF;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.overlay-card h3 {
    margin: 0 0 8px;
    font-size: 1.25rem;
    font-family: 'Bodoni Moda', serif;
    color: #1E293B;
    font-weight: 600;
}

.overlay-card p {
    margin: 0 0 24px;
    font-size: 0.85rem;
    color: #64748B;
    line-height: 1.5;
}

.btn-primary {
    background: #2563EB;
    color: white;
    border: none;
    padding: 12px 28px;
    font-size: 0.95rem;
    font-weight: 500;
    border-radius: 10px;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary:hover {
    background: #1D4ED8;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.35);
}

/* 进出场动画 */
.fade-ui-enter-active, .fade-ui-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-ui-enter-from, .fade-ui-leave-to { opacity: 0; transform: translateY(10px); }

.fade-overlay-enter-active, .fade-overlay-leave-active { transition: opacity 0.4s ease; }
.fade-overlay-enter-from, .fade-overlay-leave-to { opacity: 0; }

/* ======================================= */

.geometry-lab-container {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #F8FAFC;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
    font-family: 'Jost', system-ui, sans-serif;
    color: #1E293B;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid rgba(0,0,0,0.05);
    user-select: none;
}

.dark .geometry-lab-container {
    background: #0B0F1A;
    border-color: rgba(255,255,255,0.05);
    color: #F8FAFC;
}

/* 响应式宽高比：移动端 portrait 更高 */
@media (max-width: 640px) {
    .geometry-lab-container {
        aspect-ratio: 1 / 1.25;
        border-radius: 12px;
    }
}

.geometry-lab-container.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    aspect-ratio: auto;
    z-index: 9999;
    border-radius: 0;
}

/* --- 通用面板样式 (毛玻璃) --- */
.glass-panel {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.4);
    border-radius: 16px;
}

.dark .glass-panel {
    background: rgba(15, 23, 42, 0.75);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

/* --- 信息面板 / 公式 --- */
.right-panels-container {
    position: absolute;
    top: 24px;
    right: 24px;
    max-width: 320px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    z-index: 30;
    transition: all 0.4s ease;
}

.math-panel { padding: 20px; }

.panel-title {
    margin: 0 0 12px;
    font-size: 1.1rem;
    font-family: 'Bodoni Moda', serif;
    font-weight: 600;
    color: #2563EB;
    border-bottom: 1px solid rgba(37, 99, 235, 0.1);
    padding-bottom: 8px;
}

.equation { margin: 4px 0; text-align: center; color: #1E293B; transition: color 0.3s; }
.dark .equation { color: #E2E8F0; }
.equation :deep(.katex-display) { margin: 0.2em 0; }
.equation :deep(.katex) { font-size: 1.05em; }
.desc { font-size: 0.85rem; color: #475569; line-height: 1.5; transition: color 0.3s; }
.dark .desc { color: #94A3B8; }

/* --- 顶部页签 --- */
.tabs {
    position: absolute;
    top: 24px;
    left: 24px;
    display: flex;
    padding: 4px;
    z-index: 40;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.tab-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    color: #64748B;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s ease;
}
.tab-btn:hover { color: #2563EB; }
.tab-btn.active { background: #fff; color: #2563EB; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }

/* --- 底部场景切换 (桌面端) --- */
.controls {
    position: absolute;
    bottom: 24px;
    left: 24px;
    padding: 10px 16px 14px 16px;
    z-index: 40;
    transition: all 0.4s ease;
    max-width: calc(100% - 240px);
}

.controls-layout { display: flex; flex-wrap: wrap; gap: 0; row-gap: 12px; }

.control-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 16px;
    border-right: 1px solid rgba(30, 41, 59, 0.1);
}
.control-section:first-child { padding-left: 0; }
.control-section:last-child { border-right: none; }

.sub-category-title {
    font-size: 0.75rem;
    color: #475569;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding-left: 2px;
}

.btn-group { display: flex; gap: 8px; flex-wrap: wrap; }

.scene-btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: rgba(255,255,255,0.5);
    color: #475569;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    white-space: nowrap;
}
.scene-btn:hover { background: rgba(255,255,255,0.9); border-color: #93C5FD; }
.scene-btn.active { background: #2563EB; color: white; border-color: #2563EB; box-shadow: 0 4px 12px rgba(37,99,235,0.2); }

/* --- 视角工具栏 (桌面端) --- */
.bottom-right-controls {
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;
    gap: 4px;
    padding: 6px;
    z-index: 50;
    transition: all 0.4s ease;
}

.btn-tool {
    border: none;
    background: transparent;
    color: #475569;
    cursor: pointer;
    font-family: inherit;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;
    padding: 8px 12px;
    border-radius: 8px;
    -webkit-tap-highlight-color: transparent;
}
.btn-tool:hover { background: #fff; color: #2563EB; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }

/* --- 响应式适配 --- */

@media (max-width: 1024px) {
    .right-panels-container { top: 20px; right: 20px; max-width: 280px; }
    .controls { bottom: 20px; left: 20px; }
}

@media (max-width: 768px) {
    .geometry-lab-container { aspect-ratio: 1 / 1.25; border-radius: 12px; }

    /* 顶部导航层级 */
    .tabs { top: 16px; left: 50%; transform: translateX(-50%); width: max-content; }
    .bottom-right-controls {
        top: 16px; right: 12px; bottom: auto;
        flex-direction: row; gap: 8px; padding: 4px;
        background: rgba(255, 255, 255, 0.85); border-radius: 12px;
    }
    .btn-tool { flex-direction: column; padding: 6px 8px !important; gap: 2px !important; }
    .btn-tool .label { font-size: 10px; opacity: 0.8; }

    /* 中间信息提示层级 */
    .right-panels-container { top: 80px; right: 12px; max-width: 220px; }
    .panel-title { font-size: 0.95rem !important; }
    .desc { font-size: 0.75rem !important; }

    /* 底部场景切换匣 (Pro Max UX) */
    .controls {
        bottom: 0 !important; left: 0 !important; right: 0 !important;
        max-width: none !important; border-radius: 24px 24px 0 0 !important;
        padding: 10px 0 32px 0 !important; background: rgba(255, 255, 255, 0.82) !important;
        box-shadow: 0 -12px 40px rgba(0,0,0,0.06) !important;
        overflow-x: auto;
    }
    .controls-layout { display: flex !important; flex-wrap: nowrap !important; padding: 0 20px; gap: 24px !important; }
    .controls-layout::-webkit-scrollbar { display: none; }
    .control-section { border-right: none !important; padding: 0 !important; min-width: max-content; }
    .sub-category-title { font-size: 0.7rem !important; text-transform: uppercase; margin-bottom: 8px; display: block; color: #94A3B8; }
    .btn-group { gap: 10px !important; }
    .scene-btn { padding: 8px 18px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.4); background: rgba(255,255,255,0.4); }
    
    .drawer-handle {
        width: 32px; height: 4px; background: rgba(0, 0, 0, 0.1);
        border-radius: 2px; margin: 0 auto 16px auto; display: block;
    }
    
    .info-toggle-btn { top: 80px; right: 12px; }
    .param-toggle-btn { top: 140px; right: 12px; width: 38px; height: 38px; }
    .param-panel { margin-top: 12px; }
    .param-control { margin-bottom: 12px; }
    .param-label { font-size: 0.75rem; }
}

@media (max-width: 480px) {
    .bottom-right-controls { top: 12px; right: 8px; }
    .btn-tool .label { display: none; }
    .btn-tool { padding: 8px !important; }
    
    .right-panels-container { top: 72px; right: 8px; max-width: 160px; }
    .math-panel { padding: 12px !important; }
    .info-toggle-btn { top: 72px; right: 8px; width: 38px; height: 38px; font-size: 1.1rem; }
    .param-toggle-btn { top: 120px; right: 8px; width: 34px; height: 34px; font-size: 1rem; }
    .param-panel { padding: 12px !important; }
    .param-control { margin-bottom: 8px; }
    .reset-param-btn { padding: 6px 10px; font-size: 0.75rem; }

    .controls { padding: 8px 0 24px 0 !important; }
    .scene-btn { padding: 6px 14px !important; font-size: 0.8rem !important; }
    .tab-btn { padding: 6px 12px !important; font-size: 0.8rem !important; }
}

/* --- 面板控制组件 --- */
.panel-header { display: flex; justify-content: space-between; align-items: flex-start; }
.close-btn {
    border: none; background: rgba(0,0,0,0.05); width: 24px; height: 24px;
    border-radius: 60px; display: flex; align-items: center; justify-content: center;
    font-size: 10px; cursor: pointer; color: #64748B; transition: all 0.2s;
}
.close-btn:hover { background: rgba(0,0,0,0.1); color: #ef4444; }

.info-toggle-btn {
    position: absolute; display: flex; align-items: center; justify-content: center;
    width: 44px; height: 44px; font-size: 1.25rem; cursor: pointer; border-radius: 50%;
    z-index: 45; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(37, 99, 235, 0.2);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.param-toggle-btn {
    position: absolute; display: flex; align-items: center; justify-content: center;
    width: 44px; height: 44px; font-size: 1.25rem; cursor: pointer; border-radius: 50%;
    z-index: 45; background: rgba(255, 255, 255, 0.9); border: 1px solid rgba(37, 99, 235, 0.2);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    top: 24px;
    right: 24px;
}

.param-panel {
    margin-top: 16px;
    padding: 16px;
}

.param-control {
    margin-bottom: 16px;
}

.param-label {
    display: block;
    font-size: 0.8rem;
    font-weight: 500;
    color: #475569;
    margin-bottom: 4px;
}

.dark .param-label {
    color: #94A3B8;
}

.param-slider {
    width: 100%;
    height: 6px;
    border-radius: 3px;
    background: #E2E8F0;
    outline: none;
    -webkit-appearance: none;
}

.dark .param-slider {
    background: #334155;
}

.param-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2563EB;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.param-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #2563EB;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.reset-param-btn {
    width: 100%;
    padding: 8px 12px;
    background: #EFF6FF;
    border: 1px solid #BFDBFE;
    border-radius: 8px;
    color: #2563EB;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
}

.reset-param-btn:hover {
    background: #DBEAFE;
}

.dark .reset-param-btn {
    background: rgba(37, 99, 235, 0.1);
    border-color: rgba(37, 99, 235, 0.3);
    color: #93C5FD;
}

.dark .reset-param-btn:hover {
    background: rgba(37, 99, 235, 0.2);
}

.panels-stack { pointer-events: auto; }
</style>
