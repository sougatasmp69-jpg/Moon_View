export class CosmicBackground {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.stars = [];
    this.shootingStars = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.moonAngle = 0;
    this.animationId = null;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX / this.width - 0.5) * 40;
      this.targetMouseY = (e.clientY / this.height - 0.5) * 40;
    });

    this.createStars(400);
    this.animate();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  createStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 3 + 0.5, // depth
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.7 ? 190 : (Math.random() > 0.5 ? 270 : 0) // cyan, purple, or white
      });
    }
  }

  createShootingStar() {
    if (Math.random() < 0.015 && this.shootingStars.length < 3) {
      this.shootingStars.push({
        x: Math.random() * this.width * 0.8 + this.width * 0.2,
        y: Math.random() * this.height * 0.4,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 12 + 8,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        life: 1,
        decay: Math.random() * 0.03 + 0.015
      });
    }
  }

  drawMoon(moonX, moonY, radius) {
    const ctx = this.ctx;
    ctx.save();

    // Atmospheric Outerglow
    const outerGlow = ctx.createRadialGradient(moonX, moonY, radius * 0.8, moonX, moonY, radius * 2.2);
    outerGlow.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
    outerGlow.addColorStop(0.5, 'rgba(6, 182, 212, 0.12)');
    outerGlow.addColorStop(1, 'rgba(5, 6, 15, 0)');
    ctx.fillStyle = outerGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, radius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Orbital Ring
    ctx.save();
    ctx.translate(moonX, moonY);
    ctx.rotate(this.moonAngle * 0.2 - 0.3);
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.6, radius * 0.45, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 6]);
    ctx.stroke();
    ctx.restore();

    // Moon Disc Base Gradient
    const moonGrad = ctx.createRadialGradient(moonX - radius * 0.35, moonY - radius * 0.35, radius * 0.1, moonX, moonY, radius);
    moonGrad.addColorStop(0, '#ffffff');
    moonGrad.addColorStop(0.4, '#e0e7ff');
    moonGrad.addColorStop(0.8, '#a5b4fc');
    moonGrad.addColorStop(1, '#4338ca');

    ctx.beginPath();
    ctx.arc(moonX, moonY, radius, 0, Math.PI * 2);
    ctx.fillStyle = moonGrad;
    ctx.shadowColor = 'rgba(168, 85, 247, 0.6)';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Procedural Lunar Craters (Rotated)
    ctx.save();
    ctx.beginPath();
    ctx.arc(moonX, moonY, radius, 0, Math.PI * 2);
    ctx.clip();

    ctx.translate(moonX, moonY);
    ctx.rotate(this.moonAngle);

    const craters = [
      { x: -radius * 0.3, y: -radius * 0.2, r: radius * 0.2, op: 0.18 },
      { x: radius * 0.25, y: radius * 0.3, r: radius * 0.25, op: 0.14 },
      { x: radius * 0.4, y: -radius * 0.35, r: radius * 0.15, op: 0.2 },
      { x: -radius * 0.15, y: radius * 0.4, r: radius * 0.18, op: 0.16 },
      { x: 0, y: -radius * 0.5, r: radius * 0.12, op: 0.15 }
    ];

    craters.forEach((c) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(30, 27, 75, ${c.op})`;
      ctx.fill();
    });

    ctx.restore();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth lerp mouse parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Subtle moon rotation
    this.moonAngle += 0.001;

    // Render 3D Moon Position (Top Right corner parallax)
    const moonBaseX = this.width > 900 ? this.width * 0.82 : this.width * 0.5;
    const moonBaseY = this.height * 0.28;
    const moonRadius = this.width > 900 ? 90 : 60;
    this.drawMoon(moonBaseX + this.mouseX * 0.3, moonBaseY + this.mouseY * 0.3, moonRadius);

    // Render Twinkling Stars with 3D depth parallax
    const time = Date.now() * 0.001;
    this.stars.forEach((star) => {
      const offsetX = this.mouseX * star.z * 0.4;
      const offsetY = this.mouseY * star.z * 0.4;
      const currentAlpha = star.alpha + Math.sin(time * 2 + star.twinkleOffset) * 0.2;

      this.ctx.beginPath();
      this.ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2);

      if (star.hue === 190) {
        this.ctx.fillStyle = `rgba(56, 189, 248, ${Math.max(0.1, currentAlpha)})`;
      } else if (star.hue === 270) {
        this.ctx.fillStyle = `rgba(192, 132, 252, ${Math.max(0.1, currentAlpha)})`;
      } else {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentAlpha)})`;
      }
      this.ctx.fill();
    });

    // Shooting Stars
    this.createShootingStar();
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.life -= s.decay;

      if (s.life <= 0 || s.x > this.width || s.y > this.height) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const grad = this.ctx.createLinearGradient(
        s.x, s.y,
        s.x - Math.cos(s.angle) * s.length,
        s.y - Math.sin(s.angle) * s.length
      );
      grad.addColorStop(0, `rgba(255, 255, 255, ${s.life})`);
      grad.addColorStop(0.4, `rgba(6, 182, 212, ${s.life * 0.8})`);
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

      this.ctx.beginPath();
      this.ctx.moveTo(s.x, s.y);
      this.ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
