/**
 * 3D Interactive Card Parallax & Drag-Rotation Engine
 * Supports hover tilt, 1:1 intuitive mouse & touch drag rotation with momentum,
 * grab/grabbing cursor states, and smooth recovery to rest.
 */
export function initCardTilt(container = document) {
  const cards = container.querySelectorAll('.wallpaper-card, [data-tilt]');

  cards.forEach((card) => {
    if (card._tiltInitialized) return;
    card._tiltInitialized = true;

    card.classList.add('three-scene-canvas');

    let glare = card.querySelector('.card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-glare';
      card.appendChild(glare);
    }

    const maxTilt = 16;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let rotX = 0;
    let rotY = 0;
    let velX = 0;
    let velY = 0;
    let animFrame = null;
    let hasDragged = false;

    const updateTransform = (xRot, yRot, scale = 1.03) => {
      card.style.transform = `perspective(1000px) rotateX(${xRot.toFixed(2)}deg) rotateY(${yRot.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
    };

    const updateGlare = (clientX, clientY) => {
      const rect = card.getBoundingClientRect();
      const gx = ((clientX - rect.left) / rect.width) * 100;
      const gy = ((clientY - rect.top) / rect.height) * 100;
      glare.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255, 255, 255, 0.4) 0%, transparent 65%)`;
    };

    // Idle momentum decay loop
    const momentumLoop = () => {
      if (isDragging) return;
      if (Math.abs(velX) > 0.05 || Math.abs(velY) > 0.05) {
        rotX += velX;
        rotY += velY;
        velX *= 0.88;
        velY *= 0.88;
        updateTransform(rotX, rotY, 1.02);
        animFrame = requestAnimationFrame(momentumLoop);
      } else {
        // Smoothly lerp back to 0
        rotX += (0 - rotX) * 0.1;
        rotY += (0 - rotY) * 0.1;
        if (Math.abs(rotX) > 0.1 || Math.abs(rotY) > 0.1) {
          updateTransform(rotX, rotY, 1.0);
          animFrame = requestAnimationFrame(momentumLoop);
        } else {
          updateTransform(0, 0, 1.0);
        }
      }
    };

    // Mouse handlers
    const handleMouseMove = (e) => {
      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;

        // 1:1 intuitive motion:
        // Drag left (dx < 0) -> rotates left (negative rotY)
        // Drag right (dx > 0) -> rotates right (positive rotY)
        // Drag up (dy < 0) -> tilts up (negative rotX)
        // Drag down (dy > 0) -> tilts down (positive rotX)
        const dRotY = dx * 0.25;
        const dRotX = dy * 0.25;

        rotY = Math.max(-28, Math.min(28, rotY + dRotY));
        rotX = Math.max(-24, Math.min(24, rotX + dRotX));

        velY = dRotY;
        velX = dRotX;

        updateTransform(rotX, rotY, 1.05);
        updateGlare(e.clientX, e.clientY);
        return;
      }

      // Normal hover tilt
      const rect = card.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const tiltX = ((y - cy) / cy) * -maxTilt;
      const tiltY = ((x - cx) / cx) * maxTilt;

      updateTransform(tiltX, tiltY, 1.03);
      updateGlare(e.clientX, e.clientY);
    };

    const handleMouseDown = (e) => {
      if (e.button !== 0) return;
      if (e.target.closest('button') || e.target.closest('a')) return;
      isDragging = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      card.classList.add('is-dragging');
      if (animFrame) cancelAnimationFrame(animFrame);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove('is-dragging');
      animFrame = requestAnimationFrame(momentumLoop);
    };

    const handleMouseLeave = () => {
      if (isDragging) {
        isDragging = false;
        card.classList.remove('is-dragging');
      }
      animFrame = requestAnimationFrame(momentumLoop);
    };

    card.addEventListener('mousedown', handleMouseDown);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseup', handleMouseUp);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Prevent accidental navigation when dragging
    card.addEventListener('click', (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
        hasDragged = false;
      }
    }, true);

    // Touch handlers (Mobile)
    const handleTouchStart = (e) => {
      if (e.touches.length === 1) {
        if (e.target.closest('button') || e.target.closest('a')) return;
        const touch = e.touches[0];
        isDragging = true;
        hasDragged = false;
        startX = touch.clientX;
        startY = touch.clientY;
        lastX = touch.clientX;
        lastY = touch.clientY;
        card.classList.add('is-dragging');
        if (animFrame) cancelAnimationFrame(animFrame);
      }
    };

    const handleTouchMove = (e) => {
      if (isDragging && e.touches.length === 1) {
        const touch = e.touches[0];
        const dx = touch.clientX - lastX;
        const dy = touch.clientY - lastY;
        lastX = touch.clientX;
        lastY = touch.clientY;

        if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
          hasDragged = true;
          if (e.cancelable) e.preventDefault();
        }

        const dRotY = dx * 0.25;
        const dRotX = dy * 0.25;

        rotY = Math.max(-28, Math.min(28, rotY + dRotY));
        rotX = Math.max(-24, Math.min(24, rotX + dRotX));

        velY = dRotY;
        velX = dRotX;

        updateTransform(rotX, rotY, 1.05);
        updateGlare(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      card.classList.remove('is-dragging');
      animFrame = requestAnimationFrame(momentumLoop);
    };

    card.addEventListener('touchstart', handleTouchStart, { passive: true });
    card.addEventListener('touchmove', handleTouchMove, { passive: false });
    card.addEventListener('touchend', handleTouchEnd);
  });
}
