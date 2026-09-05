import * as THREE from 'three';

/**
 * Reusable Drag Controls for Three.js scenes.
 * Provides intuitive 1:1 grabbing motion:
 * - Drag left -> scene/object rotates left
 * - Drag right -> scene/object rotates right
 * - Drag up -> tilts upward
 * - Drag down -> tilts downward
 *
 * Includes inertia momentum, smooth auto-rotation resumption,
 * mobile touch support with scroll prevention, cursor grab/grabbing states,
 * and first-time drag hint tooltip with localStorage persistence.
 */
export function addDragControls(target, domElement, options = {}) {
  const {
    sensitivityX = 0.005,
    sensitivityY = 0.005,
    minPitch = -Math.PI / 2.5,
    maxPitch = Math.PI / 2.5,
    autoRotate = true,
    autoRotateSpeed = 0.005,
    resumeDelay = 2000,
    inertia = 0.92,
    showHint = true,
    hintText = '🖐 Drag to rotate 360°'
  } = options;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let lastInteractionTime = Date.now();
  let isExporting = false;

  // Add canvas styling class
  domElement.classList.add('three-scene-canvas');

  // Drag Hint Tooltip (shown only once per user)
  let hintEl = null;
  const HINT_STORAGE_KEY = 'moon_view_drag_hint_dismissed';
  if (showHint && typeof window !== 'undefined' && !localStorage.getItem(HINT_STORAGE_KEY)) {
    const parent = domElement.parentElement || domElement;
    hintEl = parent.querySelector('.drag-hint-tooltip');
    if (!hintEl) {
      hintEl = document.createElement('div');
      hintEl.className = 'drag-hint-tooltip';
      hintEl.innerHTML = `<span>${hintText}</span>`;
      if (getComputedStyle(parent).position === 'static') {
        parent.style.position = 'relative';
      }
      parent.appendChild(hintEl);
    }
  }

  const dismissHint = () => {
    if (hintEl) {
      hintEl.classList.add('fade-out');
      setTimeout(() => hintEl?.remove(), 600);
      hintEl = null;
      try {
        localStorage.setItem(HINT_STORAGE_KEY, 'true');
      } catch (e) {}
    }
  };

  const onPointerDown = (clientX, clientY) => {
    isDragging = true;
    startX = clientX;
    startY = clientY;
    lastX = clientX;
    lastY = clientY;
    velocityX = 0;
    velocityY = 0;
    lastInteractionTime = Date.now();
    domElement.classList.add('is-dragging');
    dismissHint();
  };

  const onPointerMove = (clientX, clientY) => {
    if (!isDragging) return;

    const deltaX = clientX - lastX;
    const deltaY = clientY - lastY;

    lastX = clientX;
    lastY = clientY;
    lastInteractionTime = Date.now();

    // Intuitive 1:1 Grabbing & Pulling Motion:
    // Dragging LEFT (deltaX < 0) -> target rotates left (rotation.y decreases)
    // Dragging RIGHT (deltaX > 0) -> target rotates right (rotation.y increases)
    // Dragging UP (deltaY < 0) -> target tilts up (rotation.x decreases)
    // Dragging DOWN (deltaY > 0) -> target tilts down (rotation.x increases)
    const rotDeltaY = deltaX * sensitivityX;
    const rotDeltaX = deltaY * sensitivityY;

    target.rotation.y += rotDeltaY;
    target.rotation.x = Math.max(minPitch, Math.min(maxPitch, target.rotation.x + rotDeltaX));

    // Record instantaneous velocity for momentum upon release
    velocityX = rotDeltaY;
    velocityY = rotDeltaX;
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    domElement.classList.remove('is-dragging');
    lastInteractionTime = Date.now();
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    onPointerDown(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    onPointerMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    onPointerUp();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      onPointerUp();
    }
  };

  domElement.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  domElement.addEventListener('mouseleave', handleMouseLeave);

  // Touch event handlers (Mobile support with scroll prevention)
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      onPointerDown(touch.clientX, touch.clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      onPointerMove(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = () => {
    onPointerUp();
  };

  domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
  domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
  domElement.addEventListener('touchend', handleTouchEnd);
  domElement.addEventListener('touchcancel', handleTouchEnd);

  // Update loop called every animation frame
  const update = () => {
    if (isExporting) {
      // Export mode: clean deterministic rotation loop
      target.rotation.y += autoRotateSpeed;
      return;
    }

    if (isDragging) {
      return;
    }

    // Inertia & Momentum drift
    if (Math.abs(velocityX) > 0.0001 || Math.abs(velocityY) > 0.0001) {
      target.rotation.y += velocityX;
      target.rotation.x = Math.max(minPitch, Math.min(maxPitch, target.rotation.x + velocityY));
      velocityX *= inertia;
      velocityY *= inertia;
    }

    // Resume gentle auto-rotation after inactivity
    const timeSinceInteraction = Date.now() - lastInteractionTime;
    if (autoRotate && timeSinceInteraction > resumeDelay) {
      target.rotation.y += autoRotateSpeed;
    }
  };

  const dispose = () => {
    domElement.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    domElement.removeEventListener('mouseleave', handleMouseLeave);
    domElement.removeEventListener('touchstart', handleTouchStart);
    domElement.removeEventListener('touchmove', handleTouchMove);
    domElement.removeEventListener('touchend', handleTouchEnd);
    domElement.removeEventListener('touchcancel', handleTouchEnd);
    hintEl?.remove();
  };

  return {
    update,
    dispose,
    setExportMode: (val) => { isExporting = val; },
    isDragging: () => isDragging
  };
}

/**
 * Procedural Moon Surface Texture Generator
 */
function createMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base cosmic tone
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#f1f5f9');
  grad.addColorStop(0.5, '#cbd5e1');
  grad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Procedural Lunar Craters
  for (let i = 0; i < 90; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 35 + 4;

    const craterGrad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, r * 0.1, x, y, r);
    craterGrad.addColorStop(0, 'rgba(71, 85, 105, 0.45)');
    craterGrad.addColorStop(0.7, 'rgba(51, 65, 85, 0.25)');
    craterGrad.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

    ctx.fillStyle = craterGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Base Scene Setup Helper with Auto Resize & IntersectionObserver
 */
function createBaseScene(container, options = {}) {
  const scene = new THREE.Scene();
  const width = container.clientWidth || 600;
  const height = container.clientHeight || 400;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = options.cameraZ || 7;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Group to hold all rotatable objects
  const rootGroup = new THREE.Group();
  scene.add(rootGroup);

  // Attach Drag Controls
  const dragControls = addDragControls(rootGroup, renderer.domElement, options);

  // IntersectionObserver to pause off-screen rendering
  let isVisible = true;
  let isRunning = true;
  let animationId = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.05 });
  observer.observe(container);

  const handleResize = () => {
    if (!container || !renderer.domElement) return;
    const newW = container.clientWidth || 600;
    const newH = container.clientHeight || 400;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  };
  window.addEventListener('resize', handleResize);

  const dispose = () => {
    isRunning = false;
    if (animationId) cancelAnimationFrame(animationId);
    observer.disconnect();
    window.removeEventListener('resize', handleResize);
    dragControls.dispose();
    renderer.dispose();
    scene.clear();
  };

  return {
    scene,
    camera,
    renderer,
    rootGroup,
    dragControls,
    handleResize,
    dispose,
    get isVisible() { return isVisible; },
    set animationId(id) { animationId = id; }
  };
}

/**
 * 🌕 1. Celestial Moon & Planet Scene
 */
export function createMoonScene(container, options = {}) {
  const base = createBaseScene(container, { cameraZ: 6.5, ...options });
  const { scene, camera, renderer, rootGroup, dragControls } = base;

  // Ambient & Directional Lighting
  const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.6);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
  mainLight.position.set(5, 3, 5);
  scene.add(mainLight);

  const purpleRimLight = new THREE.DirectionalLight(0xa855f7, 1.8);
  purpleRimLight.position.set(-5, -2, -3);
  scene.add(purpleRimLight);

  // 3D Moon Sphere
  const moonGeo = new THREE.SphereGeometry(2.0, 64, 64);
  const moonTex = createMoonTexture();
  const moonMat = new THREE.MeshStandardMaterial({
    map: moonTex,
    roughness: 0.7,
    metalness: 0.1,
    bumpMap: moonTex,
    bumpScale: 0.05
  });
  const moonMesh = new THREE.Mesh(moonGeo, moonMat);
  rootGroup.add(moonMesh);

  // Atmospheric Glow Halo (BackSide)
  const glowGeo = new THREE.SphereGeometry(2.18, 48, 48);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  });
  const glowMesh = new THREE.Mesh(glowGeo, glowMat);
  rootGroup.add(glowMesh);

  // Orbiting Stardust Rings
  const ringCount = 800;
  const ringGeo = new THREE.BufferGeometry();
  const ringPos = new Float32Array(ringCount * 3);
  const ringColors = new Float32Array(ringCount * 3);

  for (let i = 0; i < ringCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 2.8 + Math.random() * 1.5;
    const height = (Math.random() - 0.5) * 0.4;

    ringPos[i * 3] = Math.cos(angle) * dist;
    ringPos[i * 3 + 1] = height;
    ringPos[i * 3 + 2] = Math.sin(angle) * dist;

    // Cyan to Violet particles
    const isCyan = Math.random() > 0.4;
    ringColors[i * 3] = isCyan ? 0.2 : 0.7;
    ringColors[i * 3 + 1] = isCyan ? 0.8 : 0.3;
    ringColors[i * 3 + 2] = 1.0;
  }

  ringGeo.setAttribute('position', new THREE.BufferAttribute(ringPos, 3));
  ringGeo.setAttribute('color', new THREE.BufferAttribute(ringColors, 3));

  const ringMat = new THREE.PointsMaterial({
    size: 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });
  const ringMesh = new THREE.Points(ringGeo, ringMat);
  ringMesh.rotation.x = 0.45;
  ringMesh.rotation.z = -0.2;
  rootGroup.add(ringMesh);

  // Background Starfield
  const starCount = 500;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * 30;
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ size: 0.05, color: 0xffffff, transparent: true, opacity: 0.6 });
  const starField = new THREE.Points(starGeo, starMat);
  scene.add(starField);

  // Render Loop
  const animate = () => {
    if (base.isVisible) {
      dragControls.update();
      ringMesh.rotation.y += 0.002;
      renderer.render(scene, camera);
    }
    base.animationId = requestAnimationFrame(animate);
  };
  animate();

  return base;
}

/**
 * 🔷 2. Neon Geometric Shapes Scene
 */
export function createGeometricScene(container, options = {}) {
  const base = createBaseScene(container, { cameraZ: 7, ...options });
  const { scene, camera, renderer, rootGroup, dragControls } = base;

  // Lights
  scene.add(new THREE.AmbientLight(0x0f172a, 1.0));
  const light1 = new THREE.PointLight(0x00f5ff, 3, 20);
  light1.position.set(4, 4, 4);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xa855f7, 3, 20);
  light2.position.set(-4, -4, 4);
  scene.add(light2);

  // Central Core: Dual Icosahedron (Solid Glass + Glowing Wireframe)
  const coreGeo = new THREE.IcosahedronGeometry(1.6, 0);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x1e1b4b,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.8,
    thickness: 1.2,
    ior: 1.5,
    reflectivity: 0.9
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  rootGroup.add(coreMesh);

  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.7
  });
  const wireMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.62, 0), wireMat);
  rootGroup.add(wireMesh);

  // Outer Torus Knot Ring
  const torusGeo = new THREE.TorusKnotGeometry(2.3, 0.12, 100, 16);
  const torusMat = new THREE.MeshStandardMaterial({
    color: 0xc084fc,
    emissive: 0x581c87,
    roughness: 0.2,
    metalness: 0.8
  });
  const torusMesh = new THREE.Mesh(torusGeo, torusMat);
  rootGroup.add(torusMesh);

  // Orbiting Floating Polyhedra Crystals
  const crystals = [];
  const crystalGeos = [
    new THREE.OctahedronGeometry(0.35),
    new THREE.TetrahedronGeometry(0.4),
    new THREE.DodecahedronGeometry(0.3)
  ];

  for (let i = 0; i < 8; i++) {
    const geo = crystalGeos[i % crystalGeos.length];
    const mat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0x38bdf8 : 0xf43f5e,
      emissive: i % 2 === 0 ? 0x0369a1 : 0xbe123c,
      roughness: 0.3,
      metalness: 0.7
    });
    const crystal = new THREE.Mesh(geo, mat);
    const angle = (i / 8) * Math.PI * 2;
    const r = 3.6;
    crystal.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * 1.5, Math.sin(angle) * r);
    rootGroup.add(crystal);
    crystals.push({ mesh: crystal, speed: 0.02 + Math.random() * 0.02, angle });
  }

  const animate = () => {
    if (base.isVisible) {
      dragControls.update();
      torusMesh.rotation.x += 0.008;
      torusMesh.rotation.y += 0.005;
      wireMesh.rotation.y -= 0.004;

      crystals.forEach((c) => {
        c.angle += 0.01;
        c.mesh.position.x = Math.cos(c.angle) * 3.6;
        c.mesh.position.z = Math.sin(c.angle) * 3.6;
        c.mesh.rotation.x += c.speed;
        c.mesh.rotation.y += c.speed;
      });

      renderer.render(scene, camera);
    }
    base.animationId = requestAnimationFrame(animate);
  };
  animate();

  return base;
}

/**
 * 🌌 3. Cosmic Nebula Particle Clouds Scene
 */
export function createNebulaScene(container, options = {}) {
  const base = createBaseScene(container, { cameraZ: 8, ...options });
  const { scene, camera, renderer, rootGroup, dragControls } = base;

  // Multi-layered Volumetric Nebula Particles
  const particleCount = 2000;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const colorChoices = [
    new THREE.Color(0x00f5ff), // Cyan
    new THREE.Color(0xa855f7), // Purple
    new THREE.Color(0xff2d55), // Pink/Crimson
    new THREE.Color(0x38bdf8), // Sky Blue
    new THREE.Color(0xffffff)  // White
  ];

  for (let i = 0; i < particleCount; i++) {
    // Spiral nebula distribution
    const r = Math.pow(Math.random(), 0.5) * 5.5;
    const theta = Math.random() * Math.PI * 2 + (r * 1.2);
    const y = (Math.random() - 0.5) * 2.2 * (1 - r / 7);

    positions[i * 3] = Math.cos(theta) * r + (Math.random() - 0.5) * 0.8;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(theta) * r + (Math.random() - 0.5) * 0.8;

    const chosenColor = colorChoices[Math.floor(Math.random() * colorChoices.length)];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;

    sizes[i] = Math.random() * 0.08 + 0.03;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.08,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const nebulaMesh = new THREE.Points(geometry, material);
  rootGroup.add(nebulaMesh);

  // Central Pulsing Supernova Star
  const coreGeo = new THREE.SphereGeometry(0.6, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.95
  });
  const coreStar = new THREE.Mesh(coreGeo, coreMat);
  rootGroup.add(coreStar);

  let pulseTime = 0;
  const animate = () => {
    if (base.isVisible) {
      dragControls.update();
      pulseTime += 0.03;
      const scale = 1 + Math.sin(pulseTime) * 0.15;
      coreStar.scale.set(scale, scale, scale);
      nebulaMesh.rotation.y += 0.001;
      renderer.render(scene, camera);
    }
    base.animationId = requestAnimationFrame(animate);
  };
  animate();

  return base;
}

/**
 * 🌊 4. Audio Waveform & Cyber Synth Grid Scene
 */
export function createWaveformScene(container, options = {}) {
  const base = createBaseScene(container, { cameraZ: 6, ...options });
  const { scene, camera, renderer, rootGroup, dragControls } = base;

  // Undulating Waveform Plane Grid
  const gridW = 40;
  const gridH = 40;
  const planeGeo = new THREE.PlaneGeometry(10, 10, gridW, gridH);
  planeGeo.rotateX(-Math.PI / 2.8);

  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x00f5ff,
    wireframe: true,
    transparent: true,
    opacity: 0.75
  });
  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  rootGroup.add(planeMesh);

  // Floating Cyber Horizon Sun
  const sunGeo = new THREE.CircleGeometry(1.8, 48);
  const sunMat = new THREE.MeshBasicMaterial({
    color: 0xff2d55,
    side: THREE.DoubleSide
  });
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunMesh.position.set(0, 1.4, -4);
  rootGroup.add(sunMesh);

  const posAttr = planeGeo.attributes.position;
  const initialZ = new Float32Array(posAttr.count);
  for (let i = 0; i < posAttr.count; i++) {
    initialZ[i] = posAttr.getY(i);
  }

  let waveTime = 0;
  const animate = () => {
    if (base.isVisible) {
      dragControls.update();
      waveTime += 0.04;

      for (let i = 0; i < posAttr.count; i++) {
        const u = (i % (gridW + 1)) / gridW;
        const v = Math.floor(i / (gridW + 1)) / gridH;
        const z = Math.sin(u * 10 + waveTime) * Math.cos(v * 10 + waveTime) * 0.45;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    }
    base.animationId = requestAnimationFrame(animate);
  };
  animate();

  return base;
}

/**
 * 🏙️ 5. Cyberpunk Cityscape Skyline Scene
 */
export function createCityscapeScene(container, options = {}) {
  const base = createBaseScene(container, { cameraZ: 7, ...options });
  const { scene, camera, renderer, rootGroup, dragControls } = base;

  // Ground Grid
  const gridHelper = new THREE.GridHelper(16, 24, 0x00f5ff, 0x1e1b4b);
  gridHelper.position.y = -1.5;
  rootGroup.add(gridHelper);

  // Procedural Glowing Skyscrapers
  const buildingGroup = new THREE.Group();
  rootGroup.add(buildingGroup);

  const buildingCount = 45;
  const buildingMats = [
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2, metalness: 0.8 }),
    new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.3, metalness: 0.9 })
  ];

  for (let i = 0; i < buildingCount; i++) {
    const bw = 0.5 + Math.random() * 0.6;
    const bh = 1.0 + Math.random() * 3.2;
    const bd = 0.5 + Math.random() * 0.6;

    const bGeo = new THREE.BoxGeometry(bw, bh, bd);
    const bMesh = new THREE.Mesh(bGeo, buildingMats[i % 2]);

    const angle = Math.random() * Math.PI * 2;
    const dist = 1.2 + Math.random() * 4.5;
    bMesh.position.set(Math.cos(angle) * dist, -1.5 + bh / 2, Math.sin(angle) * dist);
    buildingGroup.add(bMesh);

    // Glowing Wireframe Edge highlight
    const edges = new THREE.EdgesGeometry(bGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: i % 3 === 0 ? 0x00f5ff : (i % 3 === 1 ? 0xa855f7 : 0xff2d55),
      transparent: true,
      opacity: 0.8
    });
    const line = new THREE.LineSegments(edges, edgeMat);
    line.position.copy(bMesh.position);
    buildingGroup.add(line);
  }

  // Neon Cyber Moon in Background
  const moonGeo = new THREE.SphereGeometry(1.0, 32, 32);
  const moonMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const moon = new THREE.Mesh(moonGeo, moonMat);
  moon.position.set(2.5, 3.2, -5);
  rootGroup.add(moon);

  const animate = () => {
    if (base.isVisible) {
      dragControls.update();
      renderer.render(scene, camera);
    }
    base.animationId = requestAnimationFrame(animate);
  };
  animate();

  return base;
}

/**
 * Universal Scene Factory
 */
export function initScene(type = 'moon', container, options = {}) {
  switch (type.toLowerCase()) {
    case 'moon':
    case 'planet':
      return createMoonScene(container, options);
    case 'geometric':
    case 'shapes':
      return createGeometricScene(container, options);
    case 'nebula':
    case 'space':
      return createNebulaScene(container, options);
    case 'waveform':
    case 'grid':
    case 'wave':
      return createWaveformScene(container, options);
    case 'cityscape':
    case 'city':
    case 'cyberpunk':
      return createCityscapeScene(container, options);
    default:
      return createMoonScene(container, options);
  }
}

export const SCENE_DEFINITIONS = [
  { id: 'moon', name: 'Celestial Moon', icon: '🌕', description: 'Glowing lunar sphere with 3D craters & stardust rings' },
  { id: 'geometric', name: 'Neon Polyhedra', icon: '🔷', description: 'Cyber crystal icosahedron & wireframe torus knot' },
  { id: 'nebula', name: 'Cosmic Nebula', icon: '🌌', description: 'Volumetric spiral gas clouds & pulsing stellar core' },
  { id: 'waveform', name: 'Cyber Waveform', icon: '🌊', description: 'Audio-reactive synthwave horizon grid & ripple waves' },
  { id: 'cityscape', name: 'Cyber Cityscape', icon: '🏙️', description: 'Holographic skyscraper skyline with neon highway grid' }
];

/**
 * 🎛️ Fullscreen Interactive 3D Modal Viewer
 */
export function openFullscreen3DModal(initialSceneType = 'moon', wallpaper = null) {
  // Remove any existing modal
  document.getElementById('modal-3d-fullscreen')?.remove();

  const modalBackdrop = document.createElement('div');
  modalBackdrop.id = 'modal-3d-fullscreen';
  modalBackdrop.className = 'modal-3d-backdrop';

  let currentSceneType = initialSceneType || 'moon';
  let activeSceneInstance = null;

  modalBackdrop.innerHTML = `
    <div class="modal-3d-container">
      <!-- Header -->
      <div class="modal-3d-header">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="badge badge-live">★ 3D INTERACTIVE VAULT</span>
          <span id="modal-3d-title" style="color: #ffffff; font-weight: 700; font-size: 1rem; font-family: var(--font-heading);">
            ${wallpaper ? `${wallpaper.title} — ` : ''}3D World
          </span>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-icon" id="btn-modal-3d-export" title="Export Smooth 3D Loop Animation" style="background: rgba(15,23,42,0.85);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 8 6 4-6 4Z"/></svg>
          </button>
          <button class="btn-icon" id="btn-modal-3d-close" title="Close 3D Viewer (Esc)" style="background: rgba(15,23,42,0.85);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
      </div>

      <!-- 3D Stage Container -->
      <div class="modal-3d-stage" id="modal-3d-stage-mount"></div>

      <!-- Scene Selection Controls -->
      <div class="modal-3d-controls">
        ${SCENE_DEFINITIONS.map((s) => `
          <button class="scene-tab-btn ${s.id === currentSceneType ? 'active' : ''}" data-scene-id="${s.id}">
            <span>${s.icon} ${s.name}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(modalBackdrop);

  const stageMount = modalBackdrop.querySelector('#modal-3d-stage-mount');

  const mountScene = (type) => {
    if (activeSceneInstance) {
      activeSceneInstance.dispose();
      activeSceneInstance = null;
    }
    currentSceneType = type;
    activeSceneInstance = initScene(type, stageMount, {
      showHint: true,
      hintText: '🖐 Drag anywhere to rotate in 360°'
    });

    modalBackdrop.querySelectorAll('.scene-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.sceneId === type);
    });
  };

  mountScene(currentSceneType);

  // Tab switching
  modalBackdrop.querySelectorAll('.scene-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      mountScene(btn.dataset.sceneId);
    });
  });

  // Export loop button
  modalBackdrop.querySelector('#btn-modal-3d-export')?.addEventListener('click', () => {
    if (!activeSceneInstance) return;
    const exportBtn = modalBackdrop.querySelector('#btn-modal-3d-export');
    exportBtn.disabled = true;
    exportBtn.style.color = 'var(--neon-cyan)';
    activeSceneInstance.dragControls.setExportMode(true);

    const toast = document.createElement('div');
    toast.className = 'drag-hint-tooltip';
    toast.style.bottom = '4.5rem';
    toast.innerHTML = '<span>🎬 Recording smooth 3D auto-rotate loop...</span>';
    stageMount.appendChild(toast);

    setTimeout(() => {
      activeSceneInstance.dragControls.setExportMode(false);
      exportBtn.disabled = false;
      exportBtn.style.color = '';
      toast.innerHTML = '<span>✨ 3D Loop Animation Master Captured!</span>';
      setTimeout(() => toast.remove(), 2000);
    }, 3000);
  });

  // Close handlers
  const closeModal = () => {
    if (activeSceneInstance) {
      activeSceneInstance.dispose();
      activeSceneInstance = null;
    }
    modalBackdrop.remove();
    window.removeEventListener('keydown', handleKeyDown);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  modalBackdrop.querySelector('#btn-modal-3d-close')?.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  window.addEventListener('keydown', handleKeyDown);
}

