import useReveal from '../hooks/useReveal';
import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';

export default function CodeExperience() {
  const editorRef = useReveal();
  const arrowRef = useReveal();
  const resultRef = useReveal();
  const captionRef = useReveal();

  const runBtnRef = useRef(null);
  const resetBtnRef = useRef(null);
  const tlRef = useRef(null);
  const isRunningRef = useRef(false);

  // Every animatable piece of the mock site lives in this bag, keyed by name.
  // Using one ref object instead of a dozen useRefs keeps the JSX readable.
  const el = useRef({ subLines: [], navLinks: [], features: [], confetti: [] });
  const bind = (key) => (node) => {
    el.current[key] = node;
  };
  const bindList = (key, i) => (node) => {
    el.current[key][i] = node;
  };

  // Draw a shape (rect/circle/polygon/line) by animating stroke-dashoffset,
  // then fade its fill in. Returns nothing; caller positions it on the timeline.
  const draw = (tl, node, { at, duration = 0.45, fill = true } = {}) => {
    if (!node) return;
    const len = node.getTotalLength ? node.getTotalLength() : 0;
    gsap.set(node, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
    tl.to(node, { strokeDashoffset: 0, duration, ease: 'power2.out' }, at);
    if (fill) {
      tl.to(node, { fillOpacity: 1, duration: duration * 0.7, ease: 'power1.out' }, `>-${duration * 0.25}`);
    }
  };

  const materialize = (tl, node, { at, duration = 0.4, y = 8 } = {}) => {
    if (!node) return;
    gsap.set(node, { opacity: 0, y });
    tl.to(node, { opacity: 1, y: 0, duration, ease: 'power2.out' }, at);
  };

  const resetVisual = () => {
    const e = el.current;
    const allShapes = [e.navLogo, e.navBar, e.headlineBox, e.imagePanel, e.sun, e.mtn1, e.mtn2, e.ctaShape];
    allShapes.forEach((n) => {
      if (!n) return;
      // strokeDashoffset only hides the line if strokeDasharray is also set —
      // without it, the offset has nothing to act on and the stroke renders
      // solid regardless of the value here.
      const len = n.getTotalLength ? n.getTotalLength() : 0;
      gsap.set(n, { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
    });
    const allFades = [e.headline1, e.headline2, e.subtitle, e.ctaLabel, e.ctaArrow, e.urlBar, e.liveDot, ...e.navLinks, ...e.features];
    allFades.forEach((n) => n && gsap.set(n, { opacity: 0, y: 8 }));
    if (e.cursor) gsap.set(e.cursor, { opacity: 0, x: -40, y: -20 });
    if (e.ripple) gsap.set(e.ripple, { opacity: 0, scale: 0 });
    if (e.badge) gsap.set(e.badge, { opacity: 0, scale: 0.7, y: -6 });
    e.confetti.forEach((n) => n && gsap.set(n, { opacity: 0, x: 0, y: 0, scale: 0 }));
  };

  const runCode = () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;
    if (tlRef.current) tlRef.current.kill();
    resetVisual();

    const e = el.current;
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        isRunningRef.current = false;
      },
    });
    tlRef.current = tl;

    // 0 — placeholder prompt steps out of the way first
    if (e.placeholder) {
      tl.to(e.placeholder, { opacity: 0, duration: 0.25, ease: 'power1.out' }, 0);
    }

    // 1 — chrome / nav assembles
    draw(tl, e.navLogo, { at: 0, duration: 0.3 });
    draw(tl, e.navBar, { at: 0.1, duration: 0.5, fill: false });
    e.navLinks.forEach((n, i) => materialize(tl, n, { at: 0.35 + i * 0.08, duration: 0.3 }));

    // 2 — hero copy
    draw(tl, e.headlineBox, { at: 0.5, duration: 0.001, fill: false }); // no-op placeholder kept for symmetry
    materialize(tl, e.headline1, { at: 0.55, duration: 0.45, y: 14 });
    materialize(tl, e.headline2, { at: 0.68, duration: 0.45, y: 14 });
    materialize(tl, e.subtitle, { at: 0.9, duration: 0.4, y: 10 });

    // 3 — hero image panel, drawn in parallel with the copy
    draw(tl, e.imagePanel, { at: 0.55, duration: 0.6 });
    draw(tl, e.sun, { at: 1.05, duration: 0.3 });
    draw(tl, e.mtn1, { at: 1.15, duration: 0.35 });
    draw(tl, e.mtn2, { at: 1.25, duration: 0.35 });

    // 4 — CTA button
    draw(tl, e.ctaShape, { at: 1.15, duration: 0.4 });
    materialize(tl, e.ctaLabel, { at: 1.5, duration: 0.3, y: 4 });
    materialize(tl, e.ctaArrow, { at: 1.55, duration: 0.3, y: 4 });

    // 5 — supporting feature row
    e.features.forEach((n, i) => materialize(tl, n, { at: 1.7 + i * 0.12, duration: 0.4, y: 16 }));

    // 6 — cursor flies in and clicks the CTA
    tl.set(e.cursor, { opacity: 1, x: -40, y: -20 }, 2.1);
    tl.to(e.cursor, { x: 0, y: 0, duration: 0.55, ease: 'power3.inOut' }, 2.15);
    tl.to(e.cursor, { scale: 0.8, duration: 0.09, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 2.7);

    // 7 — click feedback: ripple + confetti + button glow
    tl.fromTo(
      e.ripple,
      { opacity: 0.55, scale: 0 },
      { opacity: 0, scale: 1, duration: 0.55, ease: 'power2.out' },
      2.72
    );
    tl.to(e.ctaShape, { filter: 'drop-shadow(0 0 10px rgba(124,131,255,0.65))', duration: 0.15, yoyo: true, repeat: 1 }, 2.72);
    e.confetti.forEach((n, i) => {
      if (!n) return;
      const angle = (i / e.confetti.length) * Math.PI * 2;
      tl.fromTo(
        n,
        { opacity: 1, scale: 1, x: 0, y: 0 },
        {
          opacity: 0,
          x: Math.cos(angle) * (18 + (i % 3) * 6),
          y: Math.sin(angle) * (18 + (i % 3) * 6) - 6,
          scale: 0.3,
          duration: 0.6,
          ease: 'power2.out',
        },
        2.72
      );
    });

    // 8 — the site "goes live": URL bar + badge
    materialize(tl, e.urlBar, { at: 2.95, duration: 0.35, y: 0 });
    tl.to(e.liveDot, { opacity: 1, duration: 0.01 }, 3.1);
    tl.to(
      e.liveDot,
      { scale: 1.4, opacity: 0.4, duration: 0.6, repeat: -1, yoyo: true, ease: 'sine.inOut' },
      3.1
    );
    tl.to(e.badge, { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }, 3.05);
  };

  const resetCode = () => {
    if (tlRef.current) tlRef.current.kill();
    isRunningRef.current = false;
    resetVisual();
    if (el.current.placeholder) {
      gsap.to(el.current.placeholder, { opacity: 1, duration: 0.3, ease: 'power1.out' });
    }
  };

  // Hide the mockup before first paint so the right panel starts blank
  // instead of flashing the raw, fully-drawn SVG on load.
  useLayoutEffect(() => {
    resetVisual();
  }, []);

  return (
    <section id="code-experience" className="section py-10 sm:py-14 md:py-20">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16 grid md:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center">

        {/* Left - Code Editor */}
        <div ref={editorRef} className="reveal bg-paper2 border border-border rounded-xl overflow-hidden">
          <Chrome />
          <pre className="m-0 px-4 sm:px-5 pb-4 sm:pb-6 pt-1 font-mono text-[0.7rem] sm:text-[0.85rem] leading-relaxed overflow-x-auto">
            <code>
              <span className="text-accent2">const</span> <span className="text-ink">experience</span> = {'{'}
              {'\n  '}<span className="text-warm">interface</span>: <span className="text-[#9FE3B0]">"React"</span>,
              {'\n  '}<span className="text-warm">server</span>: <span className="text-[#9FE3B0]">"Node.js"</span>,
              {'\n  '}<span className="text-warm">database</span>: <span className="text-[#9FE3B0]">"MongoDB"</span>,
              {'\n  '}<span className="text-warm">mobile</span>: <span className="text-[#9FE3B0]">"React Native"</span>,
              {'\n  '}<span className="text-warm">tools</span>: <span className="text-[#9FE3B0]">["GSAP", "Three.js", "TypeScript"]</span>,
              {'\n  '}<span className="text-warm">result</span>: <span className="text-[#9FE3B0]">"Digital Product"</span>,
              {'\n  '}<span className="text-warm">status</span>: <span className="text-[#9FE3B0]">"Built & Deployed"</span>
              {'\n'}{'}'};
            </code>
          </pre>

          <div className="flex gap-2 px-4 sm:px-5 pb-4">
            <button
              ref={runBtnRef}
              onClick={runCode}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-[#7C83FF] text-white hover:bg-[#6B73E6] hover:scale-[1.02] hover:shadow-lg"
            >
              <span>▶</span>
              Run Code
            </button>
            <button
              ref={resetBtnRef}
              onClick={resetCode}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-muted hover:text-ink hover:border-[#7C83FF]/40 transition-all duration-300"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Arrow */}
        <div ref={arrowRef} className="reveal flex md:flex-col gap-1.5 items-center justify-center" aria-hidden="true">
          <span className="w-5 h-px md:w-px md:h-5 bg-accent2 opacity-50" />
          <span className="w-5 h-px md:w-px md:h-5 bg-accent2 opacity-80" />
          <span className="w-5 h-px md:w-px md:h-5 bg-accent2" />
        </div>

        {/* Right - the site building itself */}
        <div ref={resultRef} className="reveal relative bg-paper2 border border-border rounded-xl overflow-hidden min-h-[300px] sm:min-h-[350px]">
          <Chrome>
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span ref={bind('urlBar')} className="flex items-center gap-1.5 text-[0.62rem] sm:text-[0.68rem] font-mono text-muted bg-bg/40 border border-border rounded-full px-2.5 py-1 truncate">
                <span ref={bind('liveDot')} className="w-1.5 h-1.5 rounded-full bg-[#9FE3B0] shrink-0" style={{ opacity: 0 }} />
                yourbrand.com
              </span>
            </div>
          </Chrome>

          {/* "Shipped" badge */}
          <div
            ref={bind('badge')}
            className="absolute top-3 right-3 z-10 flex items-center gap-1.5 text-[0.62rem] sm:text-[0.68rem] font-medium px-2.5 py-1.5 rounded-full bg-[#9FE3B0] text-[#153320] shadow-lg"
            style={{ opacity: 0 }}
          >
            ✓ Shipped
          </div>

          {/* placeholder prompt shown before the first run */}
          <div
            ref={bind('placeholder')}
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-3 px-6 text-center pointer-events-none"
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="opacity-70">
              <rect x="3" y="7" width="34" height="26" rx="4" stroke="#7C83FF" strokeWidth="1.6" />
              <line x1="3" y1="14" x2="37" y2="14" stroke="#7C83FF" strokeWidth="1.6" />
              <circle cx="8" cy="10.5" r="1.1" fill="#7C83FF" />
              <circle cx="12" cy="10.5" r="1.1" fill="#7C83FF" />
              <path d="M16 22 L22 26 L16 30" stroke="#E6C98A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            <p className="text-muted text-[0.78rem] sm:text-[0.85rem] max-w-[220px] leading-snug">
              Run the code to watch it become a real experience.
            </p>
          </div>

          <svg viewBox="0 0 480 300" className="w-full h-[260px] sm:h-[300px]" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7C83FF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#E6C98A" stopOpacity="0.35" />
              </linearGradient>
            </defs>

            {/* nav */}
            <circle ref={bind('navLogo')} cx="30" cy="28" r="9" fill="#7C83FF" fillOpacity="0" stroke="#7C83FF" strokeWidth="2" />
            <line ref={bind('navBar')} x1="14" y1="50" x2="466" y2="50" stroke="var(--color-border, #3a3a44)" strokeWidth="1.5" />
            {['Work', 'About', 'Contact'].map((label, i) => (
              <text
                key={label}
                ref={bindList('navLinks', i)}
                x={310 + i * 55}
                y={32}
                className="font-mono fill-current text-muted"
                fontSize="11"
              >
                {label}
              </text>
            ))}

            {/* invisible anchor kept for timeline symmetry */}
            <rect ref={bind('headlineBox')} x="14" y="70" width="1" height="1" fillOpacity="0" stroke="none" />

            {/* headline + subtitle */}
            <text ref={bind('headline1')} x="14" y="105" className="font-display fill-current text-ink" fontSize="26" fontWeight="600">
              Your Vision,
            </text>
            <text ref={bind('headline2')} x="14" y="136" className="font-display fill-current text-warm" fontSize="26" fontWeight="600">
              Built &amp; Shipped.
            </text>
            <text ref={bind('subtitle')} x="14" y="164" className="fill-current text-muted" fontSize="12">
              Full-stack builds that ship fast and scale further.
            </text>

            {/* CTA button */}
            <rect
              ref={bind('ctaShape')}
              x="14" y="186" width="128" height="34" rx="17"
              fill="#7C83FF" fillOpacity="0" stroke="#7C83FF" strokeWidth="2"
            />
            <text ref={bind('ctaLabel')} x="34" y="207" fontSize="12" fontWeight="600" fill="#fff">
              Get Started
            </text>
            <text ref={bind('ctaArrow')} x="118" y="207" fontSize="13" fill="#fff">→</text>

            {/* hero image panel */}
            <rect
              ref={bind('imagePanel')}
              x="262" y="66" width="204" height="140" rx="12"
              fill="url(#heroGrad)" fillOpacity="0" stroke="#7C83FF" strokeWidth="1.5"
            />
            <circle ref={bind('sun')} cx="410" cy="104" r="16" fill="#E6C98A" fillOpacity="0" stroke="#E6C98A" strokeWidth="1.5" />
            <polygon ref={bind('mtn1')} points="280,190 320,140 356,190" fill="#7C83FF" fillOpacity="0" stroke="#7C83FF" strokeWidth="1.5" />
            <polygon ref={bind('mtn2')} points="330,190 375,124 452,190" fill="#B8A7FF" fillOpacity="0" stroke="#B8A7FF" strokeWidth="1.5" />

            {/* feature row */}
            {['Fast', 'Scalable', 'Secure'].map((label, i) => (
              <g key={label} ref={bindList('features', i)}>
                <rect x={14 + i * 152} y="238" width="140" height="44" rx="10" fill="none" stroke="var(--color-border, #3a3a44)" strokeWidth="1.2" />
                <circle cx={32 + i * 152} cy="260" r="6" fill="#7C83FF" fillOpacity="0.35" />
                <text x={48 + i * 152} y="264" fontSize="11" className="fill-current text-ink" fontWeight="500">
                  {label}
                </text>
              </g>
            ))}

            {/* confetti burst around CTA */}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={i}
                ref={bindList('confetti', i)}
                cx="60"
                cy="203"
                r="2.5"
                fill={i % 2 === 0 ? '#7C83FF' : '#E6C98A'}
              />
            ))}

            {/* click ripple, centered on the CTA button */}
            <circle ref={bind('ripple')} cx="60" cy="203" r="20" fill="none" stroke="#7C83FF" strokeWidth="2" />

            {/* cursor */}
            <g ref={bind('cursor')} transform="translate(60,203)">
              <path
                d="M0,0 L0,15 L4,11.5 L6.5,17 L9,15.8 L6.5,10.5 L11,10.2 Z"
                fill="#fff"
                stroke="#14151C"
                strokeWidth="0.8"
              />
            </g>
          </svg>
        </div>
      </div>

      <p ref={captionRef} className="reveal text-center mt-8 sm:mt-11 text-muted text-[0.75rem] sm:text-[0.85rem] tracking-[0.08em] uppercase">
        From Code to Experience
      </p>
    </section>
  );
}

function Chrome({ children }) {
  return (
    <div className="flex items-center gap-1.5 px-3.5 py-2.5" aria-hidden={!children}>
      <span className="w-2 h-2 rounded-full bg-border shrink-0" />
      <span className="w-2 h-2 rounded-full bg-border shrink-0" />
      <span className="w-2 h-2 rounded-full bg-border shrink-0" />
      {children}
    </div>
  );
}