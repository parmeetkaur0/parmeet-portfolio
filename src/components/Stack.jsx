import useReveal from '../hooks/useReveal';
import { useEffect, useRef, useState, forwardRef } from 'react';
import gsap from 'gsap';
import { Code2, Server, Database, Smartphone, ArrowUpRight } from 'lucide-react';

const SKILLS = [
  {
    icon: Code2,
    label: '01',
    title: 'Frontend Engineering',
    summary: 'Interfaces built with React and Next.js — fast, accessible, and styled with intent.',
    items: ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Tailwind CSS'],
  },
  {
    icon: Server,
    label: '02',
    title: 'Backend & APIs',
    summary: 'Node and Express services that connect the interface to real business logic.',
    items: ['Node.js', 'Express.js', 'REST APIs'],
  },
  {
    icon: Database,
    label: '03',
    title: 'Database Architecture',
    summary: 'Schema design and queries across document and relational stores alike.',
    items: ['MongoDB', 'Mongoose', 'PostgreSQL', 'SQL'],
  },
  {
    icon: Smartphone,
    label: '04',
    title: 'Mobile Development',
    summary: 'Native-feeling apps sharing logic and conventions with the web layer.',
    items: ['React Native', 'Expo', 'Mobile-first design', 'Cross-platform'],
  },
];

export default function Skills() {
  const headRef = useReveal();
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const cards = cardsRef.current;
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="section py-10  relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
        <div ref={headRef} className="reveal">
          <span className="eyebrow">Skills &amp; Services</span>
        
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
          {SKILLS.map((skill, i) => (
            <SkillCard
              key={skill.title}
              ref={(el) => (cardsRef.current[i] = el)}
              skill={skill}
              isActive={activeIndex === i}
              onEnter={() => setActiveIndex(i)}
              onLeave={() => setActiveIndex((prev) => (prev === i ? null : prev))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const SkillCard = forwardRef(function SkillCard({ skill, isActive, onEnter, onLeave }, ref) {
  const { icon: Icon, label, title, summary, items } = skill;
  const tagsRef = useRef(null);

  useEffect(() => {
    if (!tagsRef.current) return;
    gsap.to(tagsRef.current, {
      opacity: isActive ? 1 : 0,
      y: isActive ? 0 : 8,
      duration: 0.25,
      ease: 'power2.out',
    });
  }, [isActive]);

  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
      className={`group relative flex flex-col justify-between bg-[#f7f6f2] shadow-md shadow-[#7C83FF]/10 gap-6 p-6 sm:p-7 md:p-8 rounded-2xl border transition-all duration-300 cursor-default ${
        isActive
          ? 'border-[#7C83FF]/50 shadow-xl shadow-[#7C83FF]/20 -translate-y-1'
          : 'border-border hover:border-[#7C83FF]/30'
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-300 ${
            isActive ? 'border-[#7C83FF]/50 bg-[#7C83FF]/10 text-[#7C83FF]' : 'border-border text-muted'
          }`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[0.7rem] tracking-[0.15em] text-muted">{label}</span>
      </div>

      <div>
        <h3 className="font-display text-xl md:text-2xl mb-2">{title}</h3>
        <p className="text-sm text-muted leading-relaxed max-w-[38ch]">{summary}</p>
      </div>

      <div ref={tagsRef} className="flex flex-wrap gap-1.5 opacity-0 -translate-y-2">
        {items.map((item) => (
          <span
            key={item}
            className="text-[0.7rem] sm:text-[0.75rem] text-[#7C83FF] px-2.5 py-1 rounded-full border border-[#7C83FF]/30 bg-[#7C83FF]/5"
          >
            {item}
          </span>
        ))}
      </div>

      <ArrowUpRight
        className={`absolute top-6 right-6 sm:top-7 sm:right-7 w-4 h-4 text-[#7C83FF] transition-all duration-300 ${
          isActive ? 'opacity-100 translate-x-0 translate-y-0' : 'opacity-0 -translate-x-1 translate-y-1'
        }`}
      />
    </div>
  );
});