<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, shallowRef, computed } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

interface TopologyItem {
  id: string;
  code: string;
  name: string;
  subtitle: string;
}

const ITEMS: TopologyItem[] = [
  { id: 'mobius', code: '01', name: 'MÖBIUS STRIP', subtitle: 'Non-orientable 2-Manifold' },
  { id: 'klein', code: '02', name: 'KLEIN BOTTLE', subtitle: 'Figure-8 Immersion in R³' },
  { id: 'enneper', code: '03', name: 'ENNEPER SURFACE', subtitle: 'Minimal Surface (H ≡ 0)' },
  { id: 'dini', code: '04', name: "DINI'S SURFACE", subtitle: 'Constant Negative Curvature' },
  { id: 'clifford', code: '05', name: 'CLIFFORD TORUS', subtitle: 'S³ Stereographic Projection' },
  { id: 'lorenz', code: '06', name: 'LORENZ ATTRACTOR', subtitle: 'Deterministic Chaos' }
];

type MaterialMode = 'crystal' | 'titanium' | 'spectral';

const containerRef = ref<HTMLDivElement | null>(null);
const currentId = ref<string>('mobius');
const currentMat = ref<MaterialMode>('crystal');
const showWireframe = ref<boolean>(true);
const isFullscreen = ref<boolean>(false);
const toastText = ref<string>('');

const activeItem = computed(() => {
  return ITEMS.find(item => item.id === currentId.value) || ITEMS[0];
});

// Three.js refs
const sceneRef = shallowRef<THREE.Scene | null>(null);
const cameraRef = shallowRef<THREE.PerspectiveCamera | null>(null);
const rendererRef = shallowRef<THREE.WebGLRenderer | null>(null);
const controlsRef = shallowRef<OrbitControls | null>(null);
const composerRef = shallowRef<EffectComposer | null>(null);
const pmremRef = shallowRef<THREE.PMREMGenerator | null>(null);

let animId = 0;
let mainGroup: THREE.Group | null = null;
let surfaceMesh: THREE.Mesh | null = null;
let wireframeMesh: THREE.LineSegments | null = null;
let lorenzLine: THREE.Line | null = null;
let lorenzGlow: THREE.PointLight | null = null;
let starPoints: THREE.Points | null = null;
let bloomPass: UnrealBloomPass | null = null;
let clock = new THREE.Clock();

// Animation state for smooth transitions
let targetScale = 1.0;
let currentScale = 1.0;
let baseRotationY = 0;

const showToast = (msg: string) => {
  toastText.value = msg;
  setTimeout(() => {
    if (toastText.value === msg) toastText.value = '';
  }, 1800);
};

const toggleFullscreen = async () => {
  if (!containerRef.value) return;
  try {
    if (!document.fullscreenElement) {
      await containerRef.value.requestFullscreen();
      isFullscreen.value = true;
    } else {
      await document.exitFullscreen();
      isFullscreen.value = false;
    }
  } catch (err) {
    console.error(err);
  }
};

const exportScreenshot = () => {
  if (!rendererRef.value || !sceneRef.value || !cameraRef.value || !composerRef.value) return;
  composerRef.value.render(); // Ensure latest frame is rendered
  const data = rendererRef.value.domElement.toDataURL('image/png');
  const a = document.createElement('a');
  a.download = `MATNOBLE-${activeItem.value.id}-${Date.now()}.png`;
  a.href = data;
  a.click();
  showToast('SAVED');
};

const updateBloom = () => {
  if (!bloomPass) return;
  if (currentId.value === 'lorenz') {
    bloomPass.strength = 0.8; // Reduced to preserve line detail
    bloomPass.threshold = 0.2;
  } else if (currentMat.value === 'spectral') {
    bloomPass.strength = 0.0;  // Completely disabled! Zero bloom for pure colors.
    bloomPass.threshold = 1.0; 
  } else if (currentMat.value === 'crystal') {
    bloomPass.strength = 0.12; // Extremely subtle
    bloomPass.threshold = 0.9; // Only the brightest star reflections
  } else {
    bloomPass.strength = 0.0;
    bloomPass.threshold = 1.0;
  }
};

const cycleMaterial = () => {
  if (currentMat.value === 'crystal') currentMat.value = 'titanium';
  else if (currentMat.value === 'titanium') currentMat.value = 'spectral';
  else currentMat.value = 'crystal';
  updateGeometry(0);
  updateBloom();
  showToast(currentMat.value.toUpperCase());
};

const toggleWire = () => {
  showWireframe.value = !showWireframe.value;
  updateGeometry(0);
};

// Pure Procedural Math Manifolds
function buildMobius(uRes = 100, vRes = 60, phase = 0): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  const R = 8.8;
  const w = 3.4;

  for (let i = 0; i <= uRes; i++) {
    const u = (i / uRes) * Math.PI * 2;
    for (let j = 0; j <= vRes; j++) {
      const v = -1 + (j / vRes) * 2;
      const angle = u / 2 + phase;
      const x = (R + v * w * Math.cos(angle)) * Math.cos(u);
      const y = (R + v * w * Math.cos(angle)) * Math.sin(u);
      const z = v * w * Math.sin(angle);
      pos.push(x, y, z);
      uvs.push(i / uRes, j / vRes);
    }
  }

  const stride = vRes + 1;
  for (let i = 0; i < uRes; i++) {
    for (let j = 0; j < vRes; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      idx.push(a, b, d, b, c, d);
    }
  }

  geom.setIndex(idx);
  geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

function buildKlein(uRes = 100, vRes = 60, phase = 0): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  const scale = 5.4;

  for (let i = 0; i <= uRes; i++) {
    const u = (i / uRes) * Math.PI * 2;
    for (let j = 0; j <= vRes; j++) {
      const v = (j / vRes) * Math.PI * 2;
      const r = scale * (1 - Math.cos(u + phase * 0.35) / 2);
      const x = r * (Math.cos(u) * Math.cos(v) - Math.sin(u) * Math.sin(2 * v));
      const y = r * (Math.sin(u) * Math.cos(v) + Math.cos(u) * Math.sin(2 * v));
      const z = scale * 1.35 * Math.sin(u) * Math.sin(v);
      pos.push(x, y, z);
      uvs.push(i / uRes, j / vRes);
    }
  }

  const stride = vRes + 1;
  for (let i = 0; i < uRes; i++) {
    for (let j = 0; j < vRes; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      idx.push(a, b, d, b, c, d);
    }
  }

  geom.setIndex(idx);
  geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

function buildEnneper(uRes = 100, vRes = 60, phase = 0): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  const uMax = 1.65;
  const scale = 3.6;

  for (let i = 0; i <= uRes; i++) {
    const u = -uMax + (i / uRes) * (2 * uMax);
    for (let j = 0; j <= vRes; j++) {
      const v = -uMax + (j / vRes) * (2 * uMax);
      const morph = Math.sin(phase) * 0.12;
      const uMod = u + morph * v;
      const vMod = v - morph * u;

      const x = scale * (uMod - (uMod * uMod * uMod) / 3 + uMod * vMod * vMod);
      const y = scale * (-vMod + (vMod * vMod * vMod) / 3 - vMod * uMod * uMod);
      const z = scale * (uMod * uMod - vMod * vMod);
      pos.push(x, y, z);
      uvs.push(i / uRes, j / vRes);
    }
  }

  const stride = vRes + 1;
  for (let i = 0; i < uRes; i++) {
    for (let j = 0; j < vRes; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      idx.push(a, b, d, b, c, d);
    }
  }

  geom.setIndex(idx);
  geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

function buildDini(uRes = 100, vRes = 60, phase = 0): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  const a = 4.2;
  const b = 0.82;

  for (let i = 0; i <= uRes; i++) {
    const u = (i / uRes) * (4 * Math.PI) + phase * 0.2;
    for (let j = 0; j <= vRes; j++) {
      const v = 0.08 + (j / vRes) * 1.92;
      const x = a * Math.cos(u) * Math.sin(v);
      const y = a * Math.sin(u) * Math.sin(v);
      const z = a * (Math.cos(v) + Math.log(Math.tan(v / 2))) + b * u - 7.5;
      pos.push(x, y, z);
      uvs.push(i / uRes, j / vRes);
    }
  }

  const stride = vRes + 1;
  for (let i = 0; i < uRes; i++) {
    for (let j = 0; j < vRes; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      idx.push(a, b, d, b, c, d);
    }
  }

  geom.setIndex(idx);
  geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

function buildClifford(uRes = 100, vRes = 60, phase = 0): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];
  const scale = 5.8;

  for (let i = 0; i <= uRes; i++) {
    const u = (i / uRes) * Math.PI * 2;
    for (let j = 0; j <= vRes; j++) {
      const v = (j / vRes) * Math.PI * 2;
      const denom = 2 - Math.SQRT2 * Math.sin(v + phase * 0.3);
      const c = (Math.SQRT2 / denom) * scale;
      const x = c * Math.cos(u);
      const y = c * Math.sin(u);
      const z = c * Math.cos(v);
      pos.push(x, y, z);
      uvs.push(i / uRes, j / vRes);
    }
  }

  const stride = vRes + 1;
  for (let i = 0; i < uRes; i++) {
    for (let j = 0; j < vRes; j++) {
      const a = i * stride + j;
      const b = (i + 1) * stride + j;
      const c = (i + 1) * stride + (j + 1);
      const d = i * stride + (j + 1);
      idx.push(a, b, d, b, c, d);
    }
  }

  geom.setIndex(idx);
  geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geom.computeVertexNormals();
  return geom;
}

function buildLorenz() {
  const points: THREE.Vector3[] = [];
  const colors: number[] = [];
  let x = 0.1, y = 0.0, z = 0.0;
  const sigma = 10.0, rho = 28.0, beta = 8.0 / 3.0;
  const dt = 0.007;
  const steps = 15000;

  const c1 = new THREE.Color('#38bdf8');
  const c2 = new THREE.Color('#818cf8');
  const c3 = new THREE.Color('#f43f5e');
  const temp = new THREE.Color();

  for (let i = 0; i < steps; i++) {
    const dx1 = sigma * (y - x), dy1 = x * (rho - z) - y, dz1 = x * y - beta * z;
    const x2 = x + dx1 * dt * 0.5, y2 = y + dy1 * dt * 0.5, z2 = z + dz1 * dt * 0.5;
    const dx2 = sigma * (y2 - x2), dy2 = x2 * (rho - z2) - y2, dz2 = x2 * y2 - beta * z2;
    const x3 = x + dx2 * dt * 0.5, y3 = y + dy2 * dt * 0.5, z3 = z + dz2 * dt * 0.5;
    const dx3 = sigma * (y3 - x3), dy3 = x3 * (rho - z3) - y3, dz3 = x3 * y3 - beta * z3;
    const x4 = x + dx3 * dt, y4 = y + dy3 * dt, z4 = z + dz3 * dt;
    const dx4 = sigma * (y4 - x4), dy4 = x4 * (rho - z4) - y4, dz4 = x4 * y4 - beta * z4;

    x += (dt / 6.0) * (dx1 + 2 * dx2 + 2 * dx3 + dx4);
    y += (dt / 6.0) * (dy1 + 2 * dy2 + 2 * dy3 + dy4);
    z += (dt / 6.0) * (dz1 + 2 * dz2 + 2 * dz3 + dz4);

    const s = 0.48;
    points.push(new THREE.Vector3(x * s, y * s - 2, (z - 25) * s));

    const t = i / steps;
    if (t < 0.5) temp.lerpColors(c1, c2, t * 2);
    else temp.lerpColors(c2, c3, (t - 0.5) * 2);
    colors.push(temp.r, temp.g, temp.b);
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.92,
    blending: THREE.AdditiveBlending
  });

  const line = new THREE.Line(geometry, material);
  const head = new THREE.PointLight('#f43f5e', 3.2, 22);
  head.position.copy(points[0]);

  return { line, head };
}

function createMaterial(mode: MaterialMode): THREE.Material {
  switch (mode) {
    case 'crystal':
      return new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#eaf2f8'), // Deep ice/water tint
        roughness: 0.02,
        metalness: 0.05,
        transmission: 0.98,
        ior: 1.52,
        thickness: 2.0,
        specularIntensity: 2.0,
        specularColor: new THREE.Color('#ffffff'),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0
      });
    case 'titanium':
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color('#10151c'),
        roughness: 0.25,
        metalness: 0.9,
        side: THREE.DoubleSide
      });
    case 'spectral':
      return new THREE.MeshNormalMaterial({
        side: THREE.DoubleSide
      });
  }
}

function createDust(): THREE.Points {
  const count = 350;
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 35 + Math.random() * 55;
    const theta = Math.random() * Math.PI * 2;
    const phi = (Math.random() - 0.5) * Math.PI;
    pos[i * 3] = r * Math.cos(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi);
    pos[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);
  }
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.08, // Reduced from 0.75 so they are tiny dust specs instead of huge squares
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.35,
    blending: THREE.AdditiveBlending
  });
  return new THREE.Points(geom, mat);
}

let lastId = '';
let lastMat = '';
let lastWireframe = true;

const updateGeometry = (phase = 0) => {
  if (!mainGroup) return;

  const needsFullRebuild = (lastId !== currentId.value) || (lastMat !== currentMat.value) || (lastWireframe !== showWireframe.value);

  if (needsFullRebuild) {
    // Cleanup old geometry and materials
    [surfaceMesh, wireframeMesh, lorenzLine].forEach(mesh => {
      if (mesh) {
        mainGroup!.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });

    if (lorenzGlow) {
      mainGroup!.remove(lorenzGlow);
      if (lorenzGlow.dispose) lorenzGlow.dispose();
      lorenzGlow = null;
    }
    
    surfaceMesh = null;
    wireframeMesh = null;
    lorenzLine = null;

    // Start small for entrance animation ONLY on shape change
    if (lastId !== currentId.value) {
      currentScale = 0.001;
    }
    baseRotationY = mainGroup.rotation.y; 
    
    lastId = currentId.value;
    lastMat = currentMat.value;
    lastWireframe = showWireframe.value;
  } else {
    // We are just updating the geometry for continuous morphing
    if (surfaceMesh) surfaceMesh.geometry.dispose();
    if (wireframeMesh) wireframeMesh.geometry.dispose();
  }

  if (currentId.value === 'lorenz') {
    if (needsFullRebuild) {
      const lz = buildLorenz();
      lorenzLine = lz.line;
      lorenzGlow = lz.head;
      lorenzLine.scale.setScalar(currentScale);
      mainGroup.add(lorenzLine);
      mainGroup.add(lorenzGlow);
    }
    return;
  }

  let geom: THREE.BufferGeometry;
  switch (currentId.value) {
    case 'mobius': geom = buildMobius(100, 60, phase); break;
    case 'klein': geom = buildKlein(100, 60, phase); break;
    case 'enneper': geom = buildEnneper(100, 60, phase); break;
    case 'dini': geom = buildDini(100, 60, phase); break;
    case 'clifford': geom = buildClifford(100, 60, phase); break;
    default: geom = buildMobius(100, 60, phase);
  }

  if (needsFullRebuild) {
    const mat = createMaterial(currentMat.value);
    surfaceMesh = new THREE.Mesh(geom, mat);
    surfaceMesh.scale.setScalar(currentScale);
    mainGroup.add(surfaceMesh);

    if (showWireframe.value) {
      const wireGeom = new THREE.WireframeGeometry(geom);
      const wireMat = new THREE.LineBasicMaterial({
        color: currentMat.value === 'titanium' ? 0x38bdf8 : 0xffffff,
        transparent: true,
        opacity: currentMat.value === 'crystal' ? 0.15 : 0.08,
        blending: THREE.AdditiveBlending,
        depthTest: false
      });
      wireframeMesh = new THREE.LineSegments(wireGeom, wireMat);
      wireframeMesh.scale.setScalar(currentScale);
      mainGroup.add(wireframeMesh);
    }
  } else {
    // Continuous Morph Update
    if (surfaceMesh) surfaceMesh.geometry = geom;
    if (wireframeMesh) wireframeMesh.geometry = new THREE.WireframeGeometry(geom);
  }
};

const selectItem = (id: string) => {
  currentId.value = id;
  updateGeometry(0);
  updateBloom();
};

onMounted(() => {
  if (typeof window === 'undefined' || !containerRef.value) return;

  const w = window.innerWidth;
  const h = window.innerHeight;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#030407');
  scene.fog = new THREE.FogExp2(0x030407, 0.015);
  sceneRef.value = scene;

  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
  camera.position.set(0, 4, 42); // Pulled back from 28 to give the gallery more breathing room
  cameraRef.value = camera;

  const renderer = new THREE.WebGLRenderer({
    antialias: false, // disable native antialias for post-processing
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true
  });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9; // Lowered from 1.1 to prevent global blowout

  containerRef.value.appendChild(renderer.domElement);
  rendererRef.value = renderer;

  // Disabling RoomEnvironment to avoid the "fake studio box" reflection look.
  // We want the deep space, stark lighting aesthetic.
  
  // Post-Processing (Bloom for cinematic feel)
  const renderScene = new RenderPass(scene, camera);
  bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 0.15, 0.6, 0.85);
  const outputPass = new OutputPass();

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);
  composerRef.value = composer;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.6;
  controls.maxDistance = 85; // Increased from 55 to allow further zooming out
  controls.minDistance = 12;
  controlsRef.value = controls;

  // Lighting - Deep Space Stark Aesthetic
  const ambient = new THREE.AmbientLight(0x060b14, 0.4); 
  scene.add(ambient);

  // Distant Star - Sharp, powerful, cold-warm light
  const starLight = new THREE.DirectionalLight(0xfff8ee, 6.0);
  starLight.position.set(60, 40, -35); // Far away
  scene.add(starLight);

  // Deep space subtle scatter / nebula fill
  const nebulaFill = new THREE.DirectionalLight(0x1a2e4c, 1.5);
  nebulaFill.position.set(-40, -20, 25);
  scene.add(nebulaFill);

  starPoints = createDust();
  scene.add(starPoints);

  mainGroup = new THREE.Group();
  scene.add(mainGroup);
  
  updateGeometry(0);
  updateBloom();

  const onResize = () => {
    if (!renderer || !camera || !composer) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
  };
  window.addEventListener('resize', onResize);

  let accumulated = 0;
  const loop = () => {
    animId = requestAnimationFrame(loop);
    const dt = clock.getDelta();
    accumulated += dt;

    if (controlsRef.value) controlsRef.value.update();

    if (starPoints) {
      starPoints.rotation.y += dt * 0.08;
    }

    // Scale Entrance Animation (Ease out)
    if (currentScale < targetScale) {
      currentScale += (targetScale - currentScale) * 0.1;
      if (Math.abs(targetScale - currentScale) < 0.001) currentScale = targetScale;
      
      const s = currentScale;
      if (surfaceMesh) surfaceMesh.scale.setScalar(s);
      if (wireframeMesh) wireframeMesh.scale.setScalar(s);
      if (lorenzLine) lorenzLine.scale.setScalar(s);
    }

    // Continuous Math Morphing
    if (currentId.value !== 'lorenz') {
      updateGeometry(accumulated * 0.65);
    }

    if (currentId.value === 'lorenz' && lorenzGlow && lorenzLine) {
      const geom = lorenzLine.geometry;
      const count = geom.attributes.position.count;
      const idx = Math.floor((accumulated * 900) % count);
      lorenzGlow.position.set(
        geom.attributes.position.getX(idx),
        geom.attributes.position.getY(idx),
        geom.attributes.position.getZ(idx)
      );
    }

    composer.render();
  };

  loop();

  onBeforeUnmount(() => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', onResize);

    if (controlsRef.value) controlsRef.value.dispose();
    if (composerRef.value) composerRef.value.dispose();
    if (pmremRef.value) pmremRef.value.dispose();
    if (sceneRef.value) {
      sceneRef.value.environment?.dispose();
      sceneRef.value.traverse((child) => {
        if ((child as THREE.Mesh).isMesh || (child as THREE.Line).isLine || (child as THREE.Points).isPoints) {
          const c = child as THREE.Mesh;
          if (c.geometry) c.geometry.dispose();
          if (c.material) {
             if (Array.isArray(c.material)) c.material.forEach(m => m.dispose());
             else c.material.dispose();
          }
        }
      });
    }

    if (rendererRef.value) {
      rendererRef.value.dispose();
      rendererRef.value.forceContextLoss();
      if (rendererRef.value.domElement.parentElement) {
        rendererRef.value.domElement.parentElement.removeChild(rendererRef.value.domElement);
      }
    }
  });
});
</script>

<template>
  <div ref="containerRef" class="topos-pure">
    <!-- Top Left: Minimal Identity -->
    <header class="topos-header">
      <a href="/" class="brand-pill">
        <span class="symbol">∇</span>
        <span class="title">MATNOBLE</span>
      </a>
      <span class="sep">/</span>
      <span class="subtitle">MANIFOLD</span>
    </header>

    <!-- Top Right: Refined Ghost Icons -->
    <div class="topos-tools">
      <button class="tool-btn" @click="cycleMaterial" title="Change Material (Crystal / Titanium / Spectral)">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1.5" fill="none">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9V3z"></path>
        </svg>
      </button>

      <button class="tool-btn" :class="{ active: showWireframe }" @click="toggleWire" title="Toggle Wireframe">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1.5" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
      </button>

      <button class="tool-btn" @click="exportScreenshot" title="Capture Wallpaper">
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1.5" fill="none">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
          <circle cx="12" cy="13" r="4"></circle>
        </svg>
      </button>

      <button class="tool-btn" @click="toggleFullscreen" :title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'">
        <svg v-if="!isFullscreen" viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1.5" fill="none">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
        </svg>
        <svg v-else viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="1.5" fill="none">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path>
        </svg>
      </button>
    </div>

    <!-- Center Active Meta (High-end Typography) -->
    <div class="active-manifold-label">
      <span class="label-idx">MODEL {{ activeItem.code }}</span>
      <h1 class="label-title">{{ activeItem.name }}</h1>
      <span class="label-sub">{{ activeItem.subtitle }}</span>
    </div>

    <!-- Bottom Center: Pure Minimalist Navigation Pills -->
    <nav class="bottom-dock">
      <button
        v-for="item in ITEMS"
        :key="item.id"
        class="dock-pill"
        :class="{ active: currentId === item.id }"
        @click="selectItem(item.id)"
      >
        <span class="idx">{{ item.code }}</span>
        <span class="txt">{{ item.name }}</span>
      </button>
    </nav>

    <!-- Ephemeral Toast -->
    <transition name="fade">
      <div v-if="toastText" class="toast-capsule">
        {{ toastText }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.topos-pure {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #030407;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif;
  user-select: none;
}

/* Header */
.topos-header {
  position: absolute;
  top: 36px;
  left: 40px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
  pointer-events: auto;
}

.brand-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #f8fafc;
  text-decoration: none;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2em;
  transition: opacity 0.3s;
}

.brand-pill:hover {
  opacity: 0.6;
}

.brand-pill .symbol {
  color: #38bdf8;
  font-size: 14px;
}

.topos-header .sep {
  color: rgba(255, 255, 255, 0.15);
  font-size: 11px;
}

.topos-header .subtitle {
  color: #64748b;
  font-size: 10px;
  letter-spacing: 0.25em;
  font-weight: 400;
}

/* Tools */
.topos-tools {
  position: absolute;
  top: 36px;
  right: 40px;
  display: flex;
  gap: 10px;
  z-index: 10;
  pointer-events: auto;
}

.tool-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: rgba(14, 18, 27, 0.3);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tool-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  transform: scale(1.05);
}

.tool-btn.active {
  color: #f8fafc;
  background: rgba(56, 189, 248, 0.1);
  border-color: rgba(56, 189, 248, 0.3);
}

/* Active Label (High-End Gallery Typography) */
.active-manifold-label {
  position: absolute;
  top: 10vh;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.label-idx {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 9px;
  color: #38bdf8;
  letter-spacing: 0.3em;
  opacity: 0.8;
}

.label-title {
  margin: 0;
  font-family: "Optima", "Didot", "SF Pro Display", serif;
  font-size: 26px;
  font-weight: 300;
  letter-spacing: 0.35em;
  color: #ffffff;
  text-transform: uppercase;
  text-shadow: 0 4px 32px rgba(0, 0, 0, 0.9);
}

.label-sub {
  font-size: 10px;
  color: #94a3b8;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 400;
}

/* Bottom Navigation */
.bottom-dock {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
  background: rgba(10, 12, 16, 0.45);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 100px;
  padding: 6px 10px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  max-width: 90vw;
  overflow-x: auto;
  scrollbar-width: none;
}

.bottom-dock::-webkit-scrollbar {
  display: none;
}

.dock-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 100px;
  color: #64748b;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.1em;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.dock-pill .idx {
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 9px;
  opacity: 0.5;
}

.dock-pill:hover {
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.04);
}

.dock-pill.active {
  color: #030407;
  background: #f8fafc;
  font-weight: 500;
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
}

.dock-pill.active .idx {
  color: #030407;
  opacity: 0.6;
}

/* Toast */
.toast-capsule {
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(14, 18, 27, 0.75);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 100px;
  padding: 8px 24px;
  color: #38bdf8;
  font-size: 10px;
  letter-spacing: 0.2em;
  font-weight: 500;
  z-index: 100;
  pointer-events: none;
  text-transform: uppercase;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .topos-header {
    top: 24px;
    left: 20px;
  }
  .topos-tools {
    top: 24px;
    right: 20px;
  }
  .active-manifold-label {
    top: 12vh;
  }
  .label-title {
    font-size: 20px;
  }
  .bottom-dock {
    bottom: 24px;
  }
}
</style>
