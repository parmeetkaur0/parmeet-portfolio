import { useEffect, useRef, useState, forwardRef, useCallback } from 'react';
import useReveal from '../hooks/useReveal';
import { Lightbulb, PenTool, Code2, Sliders, Rocket } from 'lucide-react';

const STEPS = [
  {
    title: 'Think',
    text: 'I start by understanding the goal, the audience, and the experience I want to create.',
    icon: Lightbulb,
  },
  {
    title: 'Design',
    text: 'I shape the structure, visuals, and interaction flow so the product feels clear and intentional.',
    icon: PenTool,
  },
  {
    title: 'Build',
    text: 'I turn the idea into a polished interface with modern tools, reusable components, and clean code.',
    icon: Code2,
  },
  {
    title: 'Refine',
    text: 'I test the details, improve performance, and make sure the experience feels smooth and responsive.',
    icon: Sliders,
  },
  {
    title: 'Launch',
    text: 'I deliver the final product with attention to quality, usability, and long-term maintainability.',
    icon: Rocket,
  },
];

const NODE_INDENT = 46;

export default function Process() {
  const headRef = useReveal();
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const pathRef = useRef(null);
  const [pathD, setPathD] = useState('');
  const [svgHeight, setSvgHeight] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  const recalcPath = useCallback(() => {
    const container = containerRef.current;
    const nodes = nodeRefs.current.filter(Boolean);
    if (!container || nodes.length < 2 || !isDesktop) {
      setPathD('');
      return;
    }
    const containerRect = container.getBoundingClientRect();
    const points = nodes.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - containerRect.left,
        y: r.top + r.height / 2 - containerRect.top,
      };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const midY = (p0.y + p1.y) / 2;
      d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }
    setPathD(d);
    setSvgHeight(container.scrollHeight);
  }, [isDesktop]);

  useEffect(() => {
    recalcPath();
    const ro = new ResizeObserver(() => recalcPath());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', recalcPath);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recalcPath);
    };
  }, [recalcPath]);

  useEffect(() => {
    const path = pathRef.current;
    const section = sectionRef.current;
    if (!path || !section || !pathD) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;

    let raf;
    const tick = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const progress = Math.max(0, Math.min(1, passed / total));
      path.style.strokeDashoffset = `${length * (1 - progress)}`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pathD]);

  return (
    <section ref={sectionRef} className="section py-12 sm:py-16 md:py-24 lg:py-28 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-8 left-4 md:left-12 w-16 h-16 md:w-24 md:h-24 rounded-3xl border-2 border-[#7C83FF]/20 rotate-12 pointer-events-none" />
      <div className="absolute bottom-8 right-4 md:right-12 w-12 h-12 md:w-20 md:h-20 rounded-full border-2 border-[#7C83FF]/15 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#7C83FF]/5 blur-3xl pointer-events-none" />

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .process-orb { animation: orbFloat 3.5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .process-orb { animation: none; }
        }
      `}</style>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 lg:px-16 relative z-10">
        {/* Header - Centered */}
        <div ref={headRef} className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24">
          <span className="inline-block text-[#7C83FF] font-mono text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] uppercase bg-[#7C83FF]/10 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#7C83FF]/20 mb-3 sm:mb-4">
            My Process
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] font-bold leading-tight text-gray-900">
            How I Bring Ideas <span className="text-[#7C83FF]">to Life</span>
          </h2>
          <p className="text-gray-500 text-[0.85rem] sm:text-[0.95rem] md:text-[1.02rem] max-w-2xl mx-auto mt-2 sm:mt-3">
            A hands-on approach rooted in clarity, design thinking, and thoughtful development.
          </p>
        </div>

        {/* Steps - Centered with max-width */}
        <div ref={containerRef} className="relative max-w-3xl mx-auto">
          {isDesktop && pathD && (
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              width="100%"
              height={svgHeight}
              style={{ overflow: 'visible' }}
            >
              <path d={pathD} fill="none" stroke="#E3E1FF" strokeWidth="3" strokeLinecap="round" />
              <path ref={pathRef} d={pathD} fill="none" stroke="#7C83FF" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}

          <div className="relative space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-14">
            {STEPS.map((step, index) => (
              <Step
                key={step.title}
                ref={(el) => (nodeRefs.current[index] = el)}
                step={step}
                index={index}
                indent={isDesktop ? index * NODE_INDENT : 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const Step = forwardRef(function Step({ step, index, indent }, nodeRef) {
  const stepRef = useReveal();
  const Icon = step.icon;
  const number = String(index + 1).padStart(2, '0');

  // Responsive indent - smaller on mobile
  const getIndent = () => {
    if (indent === 0) return '0px';
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      return `${Math.min(indent, 20)}px`;
    }
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return `${Math.min(indent, 30)}px`;
    }
    return `${indent}px`;
  };

  return (
    <div 
      ref={stepRef} 
      className="reveal flex items-start sm:items-center gap-3 sm:gap-4 md:gap-6" 
      style={{ marginLeft: getIndent() }}
    >
      {/* Numbered node */}
      <span
        ref={nodeRef}
        className="shrink-0 flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-[#7C83FF] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#7C83FF]/40 z-10 transition-all duration-300 hover:scale-110 hover:shadow-lg"
      >
        {number}
      </span>

      {/* Card */}
      <div className="relative flex-1 min-w-0 max-w-[560px]  border border-gray-400 rounded-2xl p-4 sm:p-5 md:p-6 lg:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#7C83FF]/15 hover:border-[#7C83FF]/40">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#7C83FF]/10 text-[#7C83FF] transition-all duration-300 group-hover:bg-[#7C83FF]/20">
            <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display text-base sm:text-lg md:text-xl text-gray-900 mb-0.5 sm:mb-1">
              {step.title}
            </h3>
            <p className="text-gray-500 text-[0.8rem] sm:text-[0.85rem] md:text-[0.92rem] leading-relaxed">
              {step.text}
            </p>
          </div>
        </div>

        {/* Floating accent orb */}
        <span className="process-orb hidden sm:flex absolute -top-2 md:-top-3 right-4 md:right-6 w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-[#7C83FF]/60 items-center justify-center">
          <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#7C83FF]" />
        </span>
      </div>
    </div>
  );
});