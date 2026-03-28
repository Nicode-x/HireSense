import React, { useEffect, useRef, useCallback } from "react";

// Resume-themed shapes: paper, lines, skill dots, CV icons
const SHAPES = [
  "paper", "paper", "paper", "paper",
  "lines", "lines", "lines",
  "dot", "dot", "dot", "dot", "dot",
  "briefcase",
  "chart",
  "star",
];

const PALETTE = ["#ccd5ae", "#e9edc9", "#faedcd", "#d4a373", "#c4b49a"];

function createParticle(W, H) {
  const type = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  return {
    type,
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    size: type === "paper"
      ? 28 + Math.random() * 32
      : type === "lines"
      ? 20 + Math.random() * 18
      : type === "dot"
      ? 4 + Math.random() * 6
      : 18 + Math.random() * 16,
    angle: Math.random() * Math.PI * 2,
    angVel: (Math.random() - 0.5) * 0.008,
    alpha: 0.12 + Math.random() * 0.18,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    phase: Math.random() * Math.PI * 2,
    speed: 0.3 + Math.random() * 0.4,
    // cursor repulsion
    cx: 0,
    cy: 0,
  };
}

function drawPaper(ctx, p) {
  const s = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.globalAlpha = p.alpha;

  // Paper body
  ctx.shadowColor = "rgba(61,53,34,0.08)";
  ctx.shadowBlur = 8;
  ctx.fillStyle = "#fefae0";
  ctx.strokeStyle = p.color;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.roundRect(-s * 0.4, -s * 0.55, s * 0.8, s * 1.1, 3);
  ctx.fill();
  ctx.stroke();

  // Lines on paper
  ctx.shadowBlur = 0;
  ctx.strokeStyle = p.color;
  ctx.lineWidth = 1;
  ctx.globalAlpha = p.alpha * 0.7;
  const lines = [0.3, 0.5, 0.65, 0.8, 0.35];
  lines.forEach((f, i) => {
    ctx.beginPath();
    ctx.moveTo(-s * 0.28, -s * 0.35 + i * s * 0.18);
    ctx.lineTo(-s * 0.28 + s * 0.56 * f, -s * 0.35 + i * s * 0.18);
    ctx.stroke();
  });

  ctx.restore();
}

function drawLines(ctx, p) {
  const s = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.globalAlpha = p.alpha;
  ctx.strokeStyle = p.color;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";

  for (let i = 0; i < 4; i++) {
    const len = s * (0.5 + Math.random() * 0.5);
    ctx.globalAlpha = p.alpha * (0.5 + i * 0.1);
    ctx.beginPath();
    ctx.moveTo(-s * 0.5, (i - 1.5) * s * 0.28);
    ctx.lineTo(-s * 0.5 + len, (i - 1.5) * s * 0.28);
    ctx.stroke();
  }
  ctx.restore();
}

function drawDot(ctx, p) {
  ctx.save();
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBriefcase(ctx, p) {
  const s = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.globalAlpha = p.alpha;
  ctx.strokeStyle = p.color;
  ctx.lineWidth = 1.5;
  ctx.fillStyle = "rgba(212,163,115,0.1)";

  // Case body
  ctx.beginPath();
  ctx.roundRect(-s * 0.5, -s * 0.28, s, s * 0.7, 4);
  ctx.fill();
  ctx.stroke();

  // Handle
  ctx.beginPath();
  ctx.moveTo(-s * 0.2, -s * 0.28);
  ctx.quadraticCurveTo(-s * 0.2, -s * 0.55, 0, -s * 0.55);
  ctx.quadraticCurveTo(s * 0.2, -s * 0.55, s * 0.2, -s * 0.28);
  ctx.stroke();

  // Middle line
  ctx.beginPath();
  ctx.moveTo(-s * 0.5, s * 0.06);
  ctx.lineTo(s * 0.5, s * 0.06);
  ctx.stroke();

  ctx.restore();
}

function drawChart(ctx, p) {
  const s = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.globalAlpha = p.alpha;
  ctx.strokeStyle = p.color;
  ctx.lineWidth = 1.5;

  // Axes
  ctx.beginPath();
  ctx.moveTo(-s * 0.5, s * 0.4);
  ctx.lineTo(-s * 0.5, -s * 0.4);
  ctx.moveTo(-s * 0.5, s * 0.4);
  ctx.lineTo(s * 0.5, s * 0.4);
  ctx.stroke();

  // Bars
  const heights = [0.5, 0.8, 0.35, 0.9, 0.6];
  ctx.fillStyle = p.color;
  ctx.globalAlpha = p.alpha * 0.5;
  heights.forEach((h, i) => {
    const bw = s * 0.12;
    const bh = s * 0.8 * h;
    ctx.fillRect(
      -s * 0.4 + i * s * 0.22,
      s * 0.4 - bh,
      bw, bh
    );
  });
  ctx.restore();
}

function drawStar(ctx, p) {
  const s = p.size;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);
  ctx.globalAlpha = p.alpha;
  ctx.strokeStyle = p.color;
  ctx.fillStyle = "rgba(212,163,115,0.08)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    const b = a + Math.PI / 5;
    i === 0 ? ctx.moveTo(Math.cos(a) * s, Math.sin(a) * s) : ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s);
    ctx.lineTo(Math.cos(b) * s * 0.4, Math.sin(b) * s * 0.4);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

const ResumeBackground = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(null);

  const COUNT = 38;

  const draw = useCallback((ctx, W, H, t) => {
    ctx.clearRect(0, 0, W, H);

    particlesRef.current.forEach((p) => {
      // Float wave
      const wave = Math.sin(t * p.speed + p.phase) * 6;

      // Cursor repulsion
      const dx = p.x - mouseRef.current.x;
      const dy = p.y - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const repulsionRadius = 120;
      if (dist < repulsionRadius && dist > 0) {
        const force = (repulsionRadius - dist) / repulsionRadius;
        p.x += (dx / dist) * force * 2.5;
        p.y += (dy / dist) * force * 2.5;
      }

      // Move
      p.x += p.vx;
      p.y += p.vy + Math.sin(t * 0.3 + p.phase) * 0.08;
      p.angle += p.angVel;

      // Wrap around
      if (p.x < -80) p.x = W + 60;
      if (p.x > W + 80) p.x = -60;
      if (p.y < -80) p.y = H + 60;
      if (p.y > H + 80) p.y = -60;

      // Render
      switch (p.type) {
        case "paper":     drawPaper(ctx, { ...p, y: p.y + wave }); break;
        case "lines":     drawLines(ctx, { ...p, y: p.y + wave }); break;
        case "dot":       drawDot(ctx, { ...p, y: p.y + wave * 0.5 }); break;
        case "briefcase": drawBriefcase(ctx, { ...p, y: p.y + wave }); break;
        case "chart":     drawChart(ctx, { ...p, y: p.y + wave }); break;
        case "star":      drawStar(ctx, { ...p, y: p.y + wave }); break;
        default: break;
      }
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-init particles on resize
      particlesRef.current = Array.from({ length: COUNT }, () =>
        createParticle(canvas.width, canvas.height)
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let startTime = performance.now();
    const loop = (now) => {
      const t = (now - startTime) / 1000;
      draw(ctx, canvas.width, canvas.height, t);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.65,
      }}
    />
  );
};

export default ResumeBackground;
