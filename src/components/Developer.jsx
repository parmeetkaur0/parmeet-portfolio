import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useReveal from '../hooks/useReveal';

export default function Developer() {
  const textRef = useReveal();
  const svgWrapRef = useReveal();
  const svgRef = useRef(null);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    gsap.set(el, { rotateY: -8, rotateX: 4, transformPerspective: 1200 });
    const onMove = () => {
      gsap.to(el, { rotateY: 2, rotateX: -1, duration: 1.4, ease: 'power3.out' });
    };
    const onLeave = () => {
      gsap.to(el, { rotateY: -8, rotateX: 4, duration: 1.4, ease: 'power3.out' });
    };
    const stage = el.closest('.browser-stage');
    stage?.addEventListener('mouseenter', onMove);
    stage?.addEventListener('mouseleave', onLeave);
    return () => {
      stage?.removeEventListener('mouseenter', onMove);
      stage?.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <section id="developer" className="section py-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-16 grid md:grid-cols-2 gap-14 items-center">
        <div ref={textRef} className="reveal">
          <span className="eyebrow">The Developer</span>
          <h2 className="font-display text-[clamp(1.8rem,3.6vw,2.8rem)] mb-7 leading-tight">
            I build from<br />interface to infrastructure.
          </h2>
          <p className="text-[1.02rem] leading-relaxed text-ink mb-4 max-w-[480px]">
            I'm Parmeet Kaur, a 2026 B.Tech CSE graduate and Full-Stack Developer
            focused on building modern, responsive and scalable web applications.
          </p>
          <p className="text-[1.02rem] leading-relaxed text-muted max-w-[480px]">
            Grounded in the MERN stack — MongoDB, Express, React and Node — and
            comfortable working across Next.js, SQL and React Native, with a clear
            picture of how frontend, API and data layers fit together.
          </p>
        </div>

        <div ref={svgWrapRef} className="reveal browser-stage flex items-center justify-center" style={{ perspective: '1200px' }}>
          <svg
            ref={svgRef}
            viewBox="0 0 520 380"
            className="w-full max-w-[480px]"
            style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.45))' }}
            role="img"
            aria-label="Abstract diagram of a browser window connected to an API, server and database"
          >
            <defs>
              <linearGradient id="panelGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#151b2c" />
                <stop offset="100%" stopColor="#0d1120" />
              </linearGradient>
            </defs>
            <g>
              <rect x="40" y="30" width="300" height="200" rx="10" fill="url(#panelGrad)" stroke="rgba(255,255,255,0.12)" />
              <rect x="40" y="30" width="300" height="26" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
              <circle cx="56" cy="43" r="3.4" fill="#7C83FF" />
              <circle cx="68" cy="43" r="3.4" fill="#B8A7FF" />
              <circle cx="80" cy="43" r="3.4" fill="#E6C98A" />
              <rect x="60" y="75" width="220" height="10" rx="3" fill="rgba(245,247,255,0.35)" />
              <rect x="60" y="95" width="160" height="8" rx="3" fill="rgba(245,247,255,0.16)" />
              <rect x="60" y="115" width="180" height="8" rx="3" fill="rgba(245,247,255,0.16)" />
              <rect x="60" y="145" width="80" height="26" rx="6" fill="rgba(124,131,255,0.18)" stroke="#7C83FF" />
              <text x="72" y="162" fontSize="10" fill="#B8A7FF" fontFamily="Inter, sans-serif">UI</text>
            </g>
            <g stroke="rgba(124,131,255,0.55)" strokeWidth="1.3" fill="none" strokeDasharray="3 4">
              <path d="M340 90 C 400 90, 400 90, 440 90" />
              <path d="M340 140 C 410 150, 410 190, 440 200" />
              <path d="M340 190 C 400 230, 400 260, 440 280" />
            </g>
            <g fontFamily="Inter, sans-serif" fontSize="11" fill="#A8B0C2">
              <rect x="440" y="70" width="60" height="34" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
              <text x="452" y="91">API</text>
              <rect x="440" y="182" width="60" height="34" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
              <text x="446" y="203">SERVER</text>
              <rect x="440" y="262" width="60" height="34" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" />
              <text x="436" y="283">DATABASE</text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
