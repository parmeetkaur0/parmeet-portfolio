import { useEffect, useRef } from 'react';

const COLORS = ['#4F46E5', '#7C6FF0', '#B4811F', '#8B8FA3'];

export default function ParticlesBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width, height, dpr;
    let particles = [];
    let raf;

    const density = window.innerWidth < 768 ? 0.00016 : 0.00022;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      const count = Math.round(width * height * density);
      particles = Array.from({ length: count }, () => makeParticle());
    }

    function makeParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * (canvas.height / dpr),
        r: Math.random() * 1.4 + 0.4,
        speed: Math.random() * 0.15 + 0.03,
        drift: (Math.random() - 0.5) * 0.08,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.18 + 0.05,
        twinkle: Math.random() * Math.PI * 2,
      };
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, canvas.height / dpr);
      const h = canvas.height / dpr;
      particles.forEach((p) => {
        p.y -= p.speed;
        p.x += p.drift;
        p.twinkle += 0.01;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * width; }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        const flicker = (Math.sin(p.twinkle) + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (0.6 + flicker * 0.4);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }

    resize();
    if (!reduced) {
      loop();
    } else {
      draw();
    }

    const onResize = debounce(resize, 200);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 w-full h-full -z-10 opacity-80"
    />
  );
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
