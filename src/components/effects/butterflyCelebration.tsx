import React, { useEffect, useRef } from "react";
import prioriGridLogo from "../../assets/prioriGridLogo.png";

interface ButterflyCelebrationProps {
  message: string;
  onClose: () => void;
}

interface CelebrationParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  maxAlpha: number;
  rotation: number;
  flapPhase: number;
  flapSpeed: number;
  life: number;
  maxLife: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobbleOffset: number;
}

const GRADIENT_COLORS = [
  "#ff7e5f", // Warm Coral Orange
  "#feb47b", // Golden Orange
  "#ff5252", // Fiery Red
  "#e91e63", // Electric Pink
  "#880e4f", // Deep Plum
  "#ff6b35", // Sunset Orange
  "#e61c5d", // Rose Pink
  "#ff3860", // Bright Pink
];

export const ButterflyCelebration: React.FC<ButterflyCelebrationProps> = ({
  message,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const particles: CelebrationParticle[] = [];
    const TOTAL_BUTTERFLIES = 75;

    for (let i = 0; i < TOTAL_BUTTERFLIES; i++) {
      const fromCenter = Math.random() < 0.6;
      const x = fromCenter
        ? width / 2 + (Math.random() - 0.5) * 140
        : Math.random() * width;
      const y = fromCenter
        ? height / 2 + (Math.random() - 0.5) * 140
        : height + Math.random() * 100;

      const angle = fromCenter
        ? Math.random() * Math.PI * 2
        : (Math.random() - 0.5) * Math.PI * 0.8 - Math.PI / 2;

      const speed = Math.random() * 3.5 + 1.2;
      const color =
        GRADIENT_COLORS[Math.floor(Math.random() * GRADIENT_COLORS.length)];

      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (fromCenter ? 0.5 : 1.5),
        size: Math.random() * 18 + 14,
        color,
        alpha: 0,
        maxAlpha: Math.random() * 0.35 + 0.65,
        rotation: (Math.random() - 0.5) * 0.6,
        flapPhase: Math.random() * Math.PI * 2,
        flapSpeed: Math.random() * 0.22 + 0.15,
        life: Math.floor(Math.random() * 20),
        maxLife: Math.floor(Math.random() * 140 + 160),
        wobbleSpeed: Math.random() * 0.06 + 0.03,
        wobbleAmp: Math.random() * 2.2 + 0.8,
        wobbleOffset: Math.random() * Math.PI * 2,
      });
    }

    const drawColorfulButterfly = (p: CelebrationParticle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));

      const flapScaleX = Math.abs(Math.cos(p.flapPhase));
      const wingScale = Math.max(0.18, flapScaleX);

      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;

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
      ctx.fillStyle = "#ffffff";
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

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        p.life++;
        p.flapPhase += p.flapSpeed;

        const wobble = Math.sin(p.life * p.wobbleSpeed + p.wobbleOffset) * p.wobbleAmp;
        p.x += p.vx + wobble;
        p.y += p.vy;

        p.rotation = Math.sin(p.life * 0.04 + p.wobbleOffset) * 0.3;

        const fadeInFrames = 20;
        const fadeOutStart = p.maxLife - 40;

        if (p.life < fadeInFrames) {
          p.alpha = (p.life / fadeInFrames) * p.maxAlpha;
        } else if (p.life > fadeOutStart) {
          p.alpha = Math.max(0, ((p.maxLife - p.life) / 40) * p.maxAlpha);
        } else {
          p.alpha = p.maxAlpha;
        }

        drawColorfulButterfly(p);

        if (
          p.life >= p.maxLife ||
          p.y < -60 ||
          p.x < -60 ||
          p.x > width + 60 ||
          p.y > height + 60
        ) {
          particles.splice(i, 1);
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Full-screen Canvas for Colorful Celebration Butterflies */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40 w-full h-full"
      />

      {/* Centered Congratulations Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
        <div
          className="relative w-full max-w-md p-8 sm:p-10 flex flex-col items-center text-center gap-5 rounded-3xl shadow-2xl border border-white/40 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #ff7e5f 0%, #feb47b 20%, #ff5252 45%, #e91e63 75%, #880e4f 100%)",
            boxShadow: "0 25px 60px rgba(0, 0, 0, 0.4)",
          }}
        >
          {/* Close button top right */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close celebration modal"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/20 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Icon Badge */}
          <div className="w-20 h-20 rounded-2xl bg-white/25 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-xl p-2 transform hover:scale-105 transition-transform duration-300">
            <img
              src={prioriGridLogo}
              alt="PrioriGrid Butterfly Logo"
              className="w-full h-full object-contain rounded-xl drop-shadow-md"
            />
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1 items-center">
            <div className="inline-flex items-center justify-center gap-3 text-white drop-shadow">
 
              <h3
                className="text-4xl sm:text-5xl text-white tracking-wide drop-shadow-md py-1"
                style={{
                  fontFamily:
                    "'Great Vibes', 'Dancing Script', 'Brush Script MT', cursive",
                }}
              >
                Congratulations!
              </h3>
 
            </div>
            <p className="text-base text-white/95 font-semibold leading-relaxed mt-1 drop-shadow-sm">
              {message}
            </p>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full py-3.5 px-8 bg-white hover:bg-slate-50 text-rose-600 font-extrabold text-base rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Awesome!
          </button>
        </div>
      </div>
    </>
  );
};

export default ButterflyCelebration;
