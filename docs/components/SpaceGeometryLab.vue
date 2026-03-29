<template>
  <ClientOnly>
    <div 
      class="geometry-lab-container" 
      ref="containerRef"
      :class="{ 'fullscreen': isFullscreen }"
    >
      <Transition name="fade-ui">
        <div v-show="isFullscreen" class="right-panels-container">
          <div class="glass-panel math-panel" v-if="currentData">
            <h3 class="panel-title">{{ currentData.title }}</h3>
            <div class="equation" v-html="renderedEquation"></div>
            <div class="desc" v-html="renderedDesc"></div>
          </div>
        </div>
      </Transition>

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
        </div>
      </Transition>

      <Transition name="fade-ui">
        <div v-show="isFullscreen" class="glass-panel controls">
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
        <div v-show="isFullscreen" class="glass-panel bottom-right-controls">
          <button class="btn-tool" @click="resetCamera" title="恢复高数黑板标准视角">
            🔄 视角复位
          </button>
          <button class="btn-tool" @click="toggleCamera" :title="isOrthographic ? '当前：无畸变正交投影' : '当前：接近人眼真实的透视投影'">
            {{ isOrthographic ? '👁️ 切换近大远小(透视)' : '📐 切换绝对平面(正交)' }}
          </button>
          <button class="btn-tool" @click="toggleFullscreen">
            ⛶ 退出投屏
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const containerRef = ref(null);
const currentTopic = ref('surfaces');
const currentType = ref('rotation');
const isFullscreen = ref(false);
const isOrthographic = ref(false);

const resetCamera = () => {
    if (!camera || !controls) return;
    // 重内置视角: Math Y (向右) = 14, Math Z (向上) = 8, Math X (向外迎向面门) = 16
    camera.position.set(14, 8, 16); 
    controls.target.set(0, 0, 0);
    controls.update();
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
    window.addEventListener('resize', onResize);
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
    scene.background = new THREE.Color('#F8FAFC');

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
}

function setScene(type) {
    if (!THREE_local || !ParametricGeometry_local) return;
    
    currentType.value = type;
    rotationAngle = 0;
    currentData.value = sceneData[type];

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
    animation: floatUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

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
.fade-ui-enter-active,
.fade-ui-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-ui-enter-from,
.fade-ui-leave-to {
    opacity: 0;
    transform: scale(0.96);
}

.fade-overlay-enter-active,
.fade-overlay-leave-active {
    transition: opacity 0.4s ease;
}
.fade-overlay-enter-from,
.fade-overlay-leave-to {
    opacity: 0;
}

/* ======================================= */

.geometry-lab-container {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #F8FAFC;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
    font-family: 'Jost', system-ui, sans-serif;
    color: #1E293B;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid rgba(255,255,255,0.8);
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

.glass-panel {
    background: rgba(255, 255, 255, 0.75);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
    border-radius: 12px;
}

.right-panels-container {
    position: absolute;
    top: 24px;
    right: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    z-index: 20;
    max-width: 340px;
}

@media (max-width: 768px) {
    .right-panels-container {
        max-width: 260px;
    }
}

.math-panel {
    padding: 20px;
}

.panel-title {
    margin: 0 0 12px;
    font-size: 1.1rem;
    font-family: 'Bodoni Moda', serif;
    font-weight: 600;
    color: #2563EB;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    padding-bottom: 8px;
}

.equation {
    margin: 4px 0;
    text-align: center;
    color: #1E293B;
}

.equation :deep(.katex-display) {
    margin: 0.2em 0;
}

.equation :deep(.katex) {
    font-size: 1.05em;
}

.desc {
    font-size: 0.85rem;
    color: #475569;
    line-height: 1.5;
}

.legend-panel {
    padding: 12px 16px;
    font-size: 0.8rem;
}

.legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
}
.legend-item:last-child { margin-bottom: 0; }

.color-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 8px;
}
.bg-entity { background: #2563EB; }
.bg-projection { background: rgba(37,99,235,0.4); }
.bg-generatrix { background: #F97316; }

.tabs {
    position: absolute;
    top: 24px;
    left: 24px;
    display: flex;
    padding: 4px;
    z-index: 10;
}

.tab-btn {
    padding: 8px 16px;
    border: none;
    background: transparent;
    color: #64748B;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.tab-btn:hover { color: #2563EB; }
.tab-btn.active {
    background: #fff;
    color: #2563EB;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.controls {
    position: absolute;
    bottom: 24px;
    left: 24px;
    padding: 10px 16px 14px 16px;
    z-index: 10;
}

.controls-layout {
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    row-gap: 12px;
}

.control-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 16px;
    border-right: 1px solid rgba(30, 41, 59, 0.1);
}

.control-section:first-child {
    padding-left: 0;
}

.control-section:last-child {
    padding-right: 0;
    border-right: none;
}

.sub-category-title {
    font-size: 0.75rem;
    color: #475569;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding-left: 2px;
}

.btn-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.scene-btn {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid transparent;
    background: rgba(255,255,255,0.5);
    color: #475569;
    cursor: pointer;
    font-size: 0.9rem;
    font-family: inherit;
    transition: all 0.3s ease;
}

.scene-btn:hover {
    background: rgba(255,255,255,0.9);
    border-color: #93C5FD;
}

.scene-btn.active {
    background: #2563EB;
    color: white;
    border-color: #2563EB;
    box-shadow: 0 4px 12px rgba(37,99,235,0.2);
}

.bottom-right-controls {
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;
    gap: 4px;
    padding: 6px;
    z-index: 20;
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
}
.btn-tool:hover {
    background: #fff;
    color: #2563EB;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
</style>
