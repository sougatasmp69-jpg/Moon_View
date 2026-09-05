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

  domElement.classList.add('three-scene-canvas');

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

    // 1:1 intuitive motion
    const rotDeltaY = deltaX * sensitivityX;
    const rotDeltaX = deltaY * sensitivityY;

    target.rotation.y += rotDeltaY;
    target.rotation.x = Math.max(minPitch, Math.min(maxPitch, target.rotation.x + rotDeltaX));

    velocityX = rotDeltaY;
    velocityY = rotDeltaX;
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    domElement.classList.remove('is-dragging');
    lastInteractionTime = Date.now();
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    onPointerDown(e.clientX, e.clientY);
  };
  const handleMouseMove = (e) => onPointerMove(e.clientX, e.clientY);
  const handleMouseUp = () => onPointerUp();
  const handleMouseLeave = () => { if (isDragging) onPointerUp(); };

  domElement.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  domElement.addEventListener('mouseleave', handleMouseLeave);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      if (e.cancelable) e.preventDefault();
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleTouchEnd = () => onPointerUp();

  domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
  domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
  domElement.addEventListener('touchend', handleTouchEnd);
  domElement.addEventListener('touchcancel', handleTouchEnd);

  const update = () => {
    if (isExporting) {
      target.rotation.y += autoRotateSpeed;
      return;
    }
    if (isDragging) return;

    if (Math.abs(velocityX) > 0.0001 || Math.abs(velocityY) > 0.0001) {
      target.rotation.y += velocityX;
      target.rotation.x = Math.max(minPitch, Math.min(maxPitch, target.rotation.x + velocityY));
      velocityX *= inertia;
      velocityY *= inertia;
    }

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

export default {
  addDragControls
};
