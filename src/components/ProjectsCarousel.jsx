import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import projects from '../data/projects';
import useReveal from '../hooks/useReveal';

const N = projects.length;
const HEADER_PEEK = 72;
const STICKY_BASE = 96;
// Extra scroll runway after the stack so the LAST card actually has room to
// release from its sticky position instead of staying pinned/covered by
// whatever follows. Without this, the final card never fully "settles".
const TRAILING_SPACE = STICKY_BASE + N * HEADER_PEEK + 160;

export default function ProjectsCarousel() {
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(null);
  const headRef = useReveal();
  const cardRefs = useRef([]);

  // Global smooth scrolling for this section's sticky-stack effect.
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  // Intersection Observer for delayed card appearance.
  // IMPORTANT: this observes the INNER card box, not the sticky wrapper —
  // see StackCard below for why.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index, 10);
            gsap.fromTo(
              entry.target,
              { opacity: 0, y: 70, scale: 0.94 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.9,
                delay: 0.15 + index * 0.1,
                ease: 'power2.out',
                clearProps: 'transform', // strip the inline transform once done
              }
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  // Close modal on Escape
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected]);

  return (
    <section id="work" className="section py-[clamp(48px,8vw,100px)]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-16">
        <div ref={headRef} className="reveal relative">
          <span className="eyebrow">Enter the Build</span>
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] mb-4 leading-tight max-w-[780px]">
            Real projects, not screenshots.
          </h2>
          <p className="text-muted max-w-[520px] mb-2">
            {N} shipped builds — full-stack apps and brand landing pages.
            Scroll through the stack.
          </p>
          <OrbitCube />
        </div>
      </div>

      {/* STACKED CARD LIST - bounded for wide screens */}
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 md:mt-12">
        {projects.map((p, i) => (
          <StackCard
            key={p.id}
            project={p}
            index={i}
            isLast={i === N - 1}
            onSelect={() => setSelected(p)}
            registerRef={(el) => (cardRefs.current[i] = el)}
          />
        ))}

        {/* Trailing spacer: gives the final sticky card enough scroll
            distance to release cleanly instead of getting stuck/covered. */}
        <div aria-hidden="true" style={{ height: TRAILING_SPACE }} />
      </div>

      {showAll && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-16 mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="text-left bg-surface border border-border rounded-xl p-5 hover:border-accent2 transition-colors duration-300"
            >
              <span className="text-[0.68rem] tracking-widest uppercase text-warm">{p.category}</span>
              <h4 className="font-display text-lg mt-2 mb-1">{p.title}</h4>
              <p className="text-muted text-[0.85rem]">{p.subtitle}</p>
            </button>
          ))}
        </div>
      )}

      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function StackCard({ project, index, isLast, onSelect, registerRef }) {
  const number = String(index + 1).padStart(2, '0');

  return (
    // This element carries the sticky positioning and must NEVER receive a
    // transform (directly or via an animated ancestor) — a transform turns
    // it into a new containing block and traps the sticky offset inside
    // this box instead of the viewport, killing the stacking effect.
    <div
      className={`sticky ${isLast ? '' : 'mb-8 md:mb-10'}`}
      style={{ top: `${STICKY_BASE + index * HEADER_PEEK}px`, zIndex: 10 + index }}
    >
      {/* Entrance animation (opacity/y/scale) runs on THIS inner box instead —
          it's a descendant of the sticky element, so its transform has no
          effect on the sticky element's containing block. */}
      <div
        ref={registerRef}
        data-index={index}
        className="group relative opacity-0 rounded-2xl border border-border bg-bg-secondary overflow-hidden bg-[#F7F6F2] transition-shadow duration-500 ease-out"
        style={{
          boxShadow: '0 24px 60px rgba(20,21,28,0.22)',
          transformOrigin: 'top center',
          contain: 'layout paint',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          style={{
            boxShadow: '0 32px 80px rgba(20,21,28,0.32)',
            willChange: 'opacity',
          }}
        />

        {/* header row */}
        <div className="relative flex items-center justify-between gap-4 px-5 md:px-7 py-4 border-b border-border">
          <div className="flex items-center gap-4 min-w-0">
            <span className="font-display text-2xl md:text-3xl text-warm shrink-0">{number}</span>
            <div className="min-w-0">
              <span className="block text-[0.62rem] tracking-[0.16em] uppercase text-muted font-mono">
                {project.category}
              </span>
              <h3 className="font-display text-base md:text-lg leading-tight truncate">{project.title}</h3>
            </div>
          </div>

          <button
            onClick={() => onSelect()}
            className="shrink-0 text-[0.62rem] md:text-[0.66rem] tracking-[0.1em] uppercase border border-border rounded-full px-3 md:px-4 py-2 text-muted hover:text-ink hover:border-accent2 transition-colors duration-500 ease-out"
          >
            View More <span aria-hidden="true">→</span>
          </button>
        </div>

        {/* project preview */}
        <button
          onClick={onSelect}
          aria-label={`View ${project.title} details`}
          className="group/preview relative block w-full p-3 md:p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent2"
        >
          <div className="relative mx-auto w-[92%] h-[320px] md:h-[440px] rounded-xl overflow-hidden bg-paper">
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-[900ms] ease-cinematic group-hover/preview:scale-105"
            />
          </div>

          <div className="absolute inset-3 md:inset-5 mx-auto w-[92%] rounded-xl bg-gradient-to-t from-bg-secondary/85 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-500 ease-out pointer-events-none flex items-end p-4">
            <span className="text-[0.7rem] tracking-[0.1em] uppercase text-warm flex items-center gap-2">
              View Case Study <span aria-hidden="true">→</span>
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (overlayRef.current && panelRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 28, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' }
      );
    }
  }, []);

  const handleClose = () => {
    if (overlayRef.current && panelRef.current) {
      gsap.to(panelRef.current, { opacity: 0, y: 16, scale: 0.98, duration: 0.25, ease: 'power2.in' });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      });
    } else {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
    >
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#F7F6F2] overflow-y-auto rounded-2xl border border-border bg-bg-secondary shadow-2xl"
      >
        <button
          onClick={handleClose}
          aria-label="Close details"
          className="absolute top-4 right-4 w-9 h-9 rounded-full border border-border text-muted hover:text-ink hover:border-accent2 transition-colors duration-500 ease-out flex items-center justify-center z-10 bg-bg-secondary"
        >
          ✕
        </button>

        <div className="rounded-t-2xl overflow-hidden border-b border-border bg-[#F7F6F2]">
          <img
            src={project.image}
            alt={`${project.title} preview`}
            loading="lazy"
            decoding="async"
            className="w-full h-[280px] object-cover"
          />
        </div>

        <div className="p-6 md:p-8">
          <span className="text-[0.68rem] tracking-[0.14em] uppercase text-warm">{project.category}</span>
          <h3 className="font-display text-2xl md:text-3xl mt-2">{project.title}</h3>
          <p className="text-muted text-sm mt-1 mb-4">{project.subtitle}</p>

          <p className="text-ink/80 leading-relaxed mb-5">{project.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((t) => (
              <span key={t} className="text-[0.68rem] px-2.5 py-1 rounded-full border border-border text-muted">
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between flex-wrap">
            {project.liveUrl && project.liveUrl !== '#' ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-line inline-flex items-center gap-2"
              >
                View Live Site
                <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="text-muted text-sm italic">Live link not available</span>
            )}
            <button onClick={handleClose} className="text-muted text-sm hover:text-ink transition-colors duration-500 ease-out">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrbitCube() {
  return (
    <div className="hidden md:block absolute -top-6 right-0 w-40 h-40 opacity-90" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="w-full h-full orbit-spin">
        <ellipse cx="100" cy="100" rx="90" ry="30" fill="none" stroke="rgba(230,201,138,0.4)" strokeWidth="1" />
        <circle r="3" fill="#E6C98A">
          <animateMotion dur="6s" repeatCount="indefinite" path="M10 100 A90 30 0 1 1 190 100 A90 30 0 1 1 10 100" />
        </circle>
      </svg>
      <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 cube-float">
        <g stroke="rgba(184,167,255,0.55)" strokeWidth="1" fill="rgba(124,131,255,0.06)">
          <polygon points="100,55 140,75 140,120 100,140 60,120 60,75" />
          <line x1="100" y1="55" x2="100" y2="95" />
          <line x1="60" y1="75" x2="100" y2="95" />
          <line x1="140" y1="75" x2="100" y2="95" />
          <line x1="100" y1="95" x2="100" y2="140" />
        </g>
        <circle cx="100" cy="97" r="10" fill="rgba(230,201,138,0.5)" />
      </svg>
    </div>
  );
}