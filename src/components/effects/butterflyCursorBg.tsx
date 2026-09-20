import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  rotation: number;
  flapPhase: number;
  flapSpeed: number;
  life: number;
  maxLife: number;
  isTrail: boolean;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobbleOffset: number;
}

export const ButterflyCursorBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: Particle[] = [];
    const MAX_AMBIENT = 35;
    let lastMousePos = { x: -1000, y: -1000 };

    const createButterfly = (
      x: number,
      y: number,
      isTrail: boolean = false,
      angleOverride?: number
    ): Particle => {
      const size = isTrail
        ? Math.random() * 12 + 10 // 10px - 22px for cursor trail
        : Math.random() * 16 + 14; // 14px - 30px for ambient

      const angle =
        angleOverride !== undefined
          ? angleOverride
          : (Math.random() - 0.5) * Math.PI * 0.8 - Math.PI / 2; // general upward direction

      const speed = isTrail ? Math.random() * 1.5 + 0.8 : Math.random() * 0.8 + 0.4;

      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (isTrail ? 0.6 : 0.3),
        size,
        alpha: 0,
        maxAlpha: isTrail ? Math.random() * 0.35 + 0.65 : Math.random() * 0.4 + 0.5,
        rotation: (Math.random() - 0.5) * 0.4,
        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: Math.random() * 0.18 + 0.12,
        life: 0,
        maxLife: isTrail ? Math.floor(Math.random() * 70 + 80) : Math.floor(Math.random() * 200 + 300),
        isTrail,
        wobbleSpeed: Math.random() * 0.05 + 0.02,
        wobbleAmp: Math.random() * 1.5 + 0.5,
        wobbleOffset: Math.random() * Math.PI * 2,
      };
    };

    // Initialize ambient butterflies spread across the screen
    for (let i = 0; i < MAX_AMBIENT; i++) {
      const p = createButterfly(
        Math.random() * width,
        Math.random() * height,
        false
      );
      p.life = Math.floor(Math.random() * p.maxLife * 0.7); // stagger existing life
      p.alpha = p.maxAlpha;
      particles.push(p);
    }

    // Mouse move listener
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      const dist = Math.hypot(x - lastMousePos.x, y - lastMousePos.y);

      if (dist > 10) {
        // Spawn 1-2 butterflies along the trail
        const spawnCount = Math.min(Math.floor(dist / 12), 3);
        for (let i = 0; i < spawnCount; i++) {
          const offsetX = (Math.random() - 0.5) * 16;
          const offsetY = (Math.random() - 0.5) * 16;
          particles.push(createButterfly(x + offsetX, y + offsetY, true));
        }
        lastMousePos = { x, y };
      }
    };

    // Touch move listener
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const x = touch.clientX;
        const y = touch.clientY;
        const dist = Math.hypot(x - lastMousePos.x, y - lastMousePos.y);
        if (dist > 10) {
          particles.push(createButterfly(x, y, true));
          lastMousePos = { x, y };
        }
      }
    };

    // Click burst listener
    const handleClick = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      const burstCount = 14;
      for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        particles.push(createButterfly(x, y, true, angle));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('click', handleClick);

    // Draw single butterfly vector
    const drawButterfly = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

      // Flap contraction along X axis
      const flapScaleX = Math.abs(Math.cos(p.flapPhase));
      const wingScale = Math.max(0.18, flapScaleX);

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.85)';
      ctx.shadowBlur = 10;

      const size = p.size;
      const wingWidth = size * 0.95 * wingScale;
      const topWingHeight = size * 0.75;
      const bottomWingHeight = size * 0.55;

      // Top Right Wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        wingWidth * 0.6,
        -topWingHeight * 0.95,
        wingWidth * 1.25,
        -topWingHeight * 0.45,
        wingWidth,
        0
      );
      ctx.bezierCurveTo(
        wingWidth * 0.85,
        topWingHeight * 0.35,
        wingWidth * 0.3,
        topWingHeight * 0.2,
        0,
        0
      );
      ctx.fill();

      // Bottom Right Wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        wingWidth * 0.95,
        bottomWingHeight * 0.35,
        wingWidth * 0.75,
        bottomWingHeight * 1.15,
        wingWidth * 0.35,
        bottomWingHeight
      );
      ctx.bezierCurveTo(
        wingWidth * 0.1,
        bottomWingHeight * 0.75,
        0,
        bottomWingHeight * 0.35,
        0,
        0
      );
      ctx.fill();

      // Top Left Wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -wingWidth * 0.6,
        -topWingHeight * 0.95,
        -wingWidth * 1.25,
        -topWingHeight * 0.45,
        -wingWidth,
        0
      );
      ctx.bezierCurveTo(
        -wingWidth * 0.85,
        topWingHeight * 0.35,
        -wingWidth * 0.3,
        topWingHeight * 0.2,
        0,
        0
      );
      ctx.fill();

      // Bottom Left Wing
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(
        -wingWidth * 0.95,
        bottomWingHeight * 0.35,
        -wingWidth * 0.75,
        bottomWingHeight * 1.15,
        -wingWidth * 0.35,
        bottomWingHeight
      );
      ctx.bezierCurveTo(
        -wingWidth * 0.1,
        bottomWingHeight * 0.75,
        0,
        bottomWingHeight * 0.35,
        0,
        0
      );
      ctx.fill();

      // Body / Abdomen
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.08, size * 0.38, 0, 0, Math.PI * 2);
      ctx.fill();

      // Antennae
      ctx.lineWidth = Math.max(1, size * 0.05);
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.3);
      ctx.quadraticCurveTo(-size * 0.2, -size * 0.6, -size * 0.28, -size * 0.75);
      ctx.moveTo(0, -size * 0.3);
      ctx.quadraticCurveTo(size * 0.2, -size * 0.6, size * 0.28, -size * 0.75);
      ctx.stroke();

      ctx.restore();
    };

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let ambientCount = 0;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.life++;
        p.flapPhase += p.flapSpeed;

        // Apply wobble motion
        const wobble = Math.sin(p.life * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmp;
        p.x += p.vx + wobble;
        p.y += p.vy;

        // Slight rotation adjustment according to horizontal movement
        p.rotation = Math.sin(p.life * 0.04 + p.wobbleOffset) * 0.25;

        // Fade in and out
        const fadeInFrames = 15;
        const fadeOutStart = p.maxLife - 30;

        if (p.life < fadeInFrames) {
          p.alpha = (p.life / fadeInFrames) * p.maxAlpha;
        } else if (p.life > fadeOutStart) {
          p.alpha = Math.max(
            0,
            ((p.maxLife - p.life) / 30) * p.maxAlpha
          );
        } else {
          p.alpha = p.maxAlpha;
        }

        // Render butterfly
        drawButterfly(p);

        if (!p.isTrail) {
          ambientCount++;
        }

        // Remove dead particles
        if (
          p.life >= p.maxLife ||
          p.y < -50 ||
          p.x < -50 ||
          p.x > width + 50 ||
          p.y > height + 50
        ) {
          particles.splice(i, 1);
        }
      }

      // Replenish ambient butterflies to maintain density
      while (ambientCount < MAX_AMBIENT) {
        const spawnX = Math.random() * width;
        const spawnY = height + Math.random() * 40;
        const newAmbient = createButterfly(spawnX, spawnY, false);
        particles.push(newAmbient);
        ambientCount++;
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};

export default ButterflyCursorBackground;
