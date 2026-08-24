import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import useReveal from '../hooks/useReveal';

export default function BuildLog() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const headRef = useReveal();

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;
    gsap.set(line, { transformOrigin: 'top' });

    let raf;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const p = Math.max(0, Math.min(1, passed / total));
      line.style.transform = `scaleY(${p})`;
    };
    const tick = () => { onScroll(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const nodeRefs = [useReveal(), useReveal(), useReveal(), useReveal()];
  const revealDelays = ['0ms', '120ms', '240ms', '360ms'];

  return (
    <section 
      id="experience" 
      ref={sectionRef} 
      className="section py-10 sm:py-14 md:py-20"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16">
        <div ref={headRef} className="reveal text-center mb-12 sm:mb-16 md:mb-20">
          <span className="eyebrow inline-block text-[#7C83FF] font-mono text-[0.6rem] sm:text-sm tracking-widest uppercase bg-[#7C83FF]/10 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#7C83FF]/20">
            Build Log
          </span>
          <h2 className="font-display text-[clamp(1.8rem,5vw,3.4rem)] mt-3 sm:mt-4 leading-tight text-gray-900">
            System history.
          </h2>
        </div>

        {/* Centered Timeline */}
        <div className="relative">
          {/* Center vertical line - hidden on mobile */}
          <div className="absolute left-[16px] sm:left-1/2 transform sm:-translate-x-1/2 top-0 bottom-0 w-px bg-gray-200" />
          <div
            ref={lineRef}
            className="absolute left-[16px] sm:left-1/2 transform sm:-translate-x-1/2 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(180deg, #7C83FF, #B8A7FF)' }}
          />

          {/* Timeline nodes */}
          <div className="space-y-12 sm:space-y-16">
            {/* Node 1 - Education - Left */}
            <div ref={nodeRefs[0]} className="reveal relative will-change-transform" style={{ transitionDelay: revealDelays[0] }}>
              <div className="absolute left-[16px] sm:left-1/2 transform sm:-translate-x-1/2 -mt-2">
                <span className="block w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#7C83FF] border-2 border-white shadow-lg shadow-[#7C83FF]/30" />
              </div>
              <div className="flex justify-start">
                <div className="w-full sm:w-[calc(50%-40px)] ml-8 sm:ml-0 sm:mr-auto">
                  <span className="block text-[0.6rem] sm:text-[0.72rem] tracking-[0.14em] uppercase text-gray-500 mb-1.5 sm:mb-2.5 font-mono text-left">
                    EDUCATION
                  </span>
                  <div className="border border-gray-200 sm:border-gray-500 shadow-md rounded-2xl p-4 sm:p-6 hover:border-[#7C83FF]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#7C83FF]/10">
                    <h3 className="font-display text-[clamp(1rem,1.8vw,1.6rem)] text-gray-900 mb-1 sm:mb-1.5 text-left">
                      B.Tech in Computer Science Engineering
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base mb-1 text-left">Baba Farid College of Engineering and Technology</p>
                    <p className="text-gray-500 text-[0.75rem] sm:text-[0.88rem] text-left">2022 - 2026 · Bathinda</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 justify-start">
                      <span className="text-[8px] sm:text-[10px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#7C83FF]/10 border border-[#7C83FF]/20 text-[#7C83FF]">
                        CSE
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#7C83FF]/10 border border-[#7C83FF]/20 text-[#7C83FF]">
                        B.Tech
                      </span>
                      <span className="text-[8px] sm:text-[10px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#7C83FF]/10 border border-[#7C83FF]/20 text-[#7C83FF]">
                        2022-2026
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Node 2 - AppTechies - Right */}
            <div ref={nodeRefs[1]} className="reveal relative will-change-transform" style={{ transitionDelay: revealDelays[1] }}>
              <div className="absolute left-[16px] sm:left-1/2 transform sm:-translate-x-1/2 -mt-2">
                <span className="block w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#7C83FF] border-2 border-white shadow-lg shadow-[#7C83FF]/30" />
              </div>
              <div className="flex justify-start sm:justify-end">
                <div className="w-full sm:w-[calc(50%-40px)] ml-8 sm:ml-0 sm:mr-0">
                  <span className="block text-[0.6rem] sm:text-[0.72rem] tracking-[0.14em] uppercase text-gray-500 mb-1.5 sm:mb-2.5 font-mono text-left">
                    01 · FULL-STACK DEVELOPMENT
                  </span>
                  <div className="border border-gray-200 sm:border-gray-500 rounded-2xl p-4 sm:p-6 hover:border-[#7C83FF]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#7C83FF]/10">
                    <h3 className="font-display text-[clamp(1.2rem,2.2vw,2rem)] text-gray-900 mb-1 sm:mb-1.5 text-left">
                      AppTechies
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base mb-1 text-left">Full-Stack Developer Intern</p>
                    <p className="text-gray-500 text-[0.75rem] sm:text-[0.88rem] mb-3 sm:mb-4 text-left">3 months · Mohali</p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                      <pre className="font-mono text-[0.7rem] sm:text-[0.82rem] text-[#7C83FF] leading-relaxed overflow-x-auto text-left whitespace-pre-wrap">
{`status: "intern"
stack: ["React", "Node.js", "MongoDB"]
focus: "full-stack development"`}
                      </pre>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 justify-start">
                      {['React', 'Node.js', 'MongoDB', 'Express'].map((tech) => (
                        <span key={tech} className="text-[8px] sm:text-[10px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#7C83FF]/10 border border-[#7C83FF]/20 text-[#7C83FF]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Node 3 - ClickOrMedia - Left */}
            <div ref={nodeRefs[2]} className="reveal relative will-change-transform" style={{ transitionDelay: revealDelays[2] }}>
              <div className="absolute left-[16px] sm:left-1/2 transform sm:-translate-x-1/2 -mt-2">
                <span className="block w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#7C83FF] border-2 border-white shadow-lg shadow-[#7C83FF]/30" />
              </div>
              <div className="flex justify-start">
                <div className="w-full sm:w-[calc(50%-40px)] ml-8 sm:ml-0 sm:mr-auto">
                  <span className="block text-[0.6rem] sm:text-[0.72rem] tracking-[0.14em] uppercase text-gray-500 mb-1.5 sm:mb-2.5 font-mono text-left">
                    02 · WEB & MOBILE DEVELOPMENT
                  </span>
                  <div className="border border-gray-200 sm:border-gray-500 rounded-2xl p-4 sm:p-6 hover:border-[#7C83FF]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#7C83FF]/10">
                    <h3 className="font-display text-[clamp(1.2rem,2.2vw,2rem)] text-gray-900 mb-1 sm:mb-1.5 text-left">
                      ClickOrMedia
                    </h3>
                    <p className="text-gray-700 text-sm sm:text-base mb-1 text-left">Web Developer</p>
                    <p className="text-gray-500 text-[0.75rem] sm:text-[0.88rem] mb-3 sm:mb-4 text-left">1 month · Digital Marketing Company</p>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3">
                      <pre className="font-mono text-[0.7rem] sm:text-[0.82rem] text-[#7C83FF] leading-relaxed overflow-x-auto text-left whitespace-pre-wrap">
{`status: "web developer"
stack: ["React", "Next.js", "React Native"]
focus: "web & mobile development"`}
                      </pre>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3 justify-start">
                      {['React', 'Next.js', 'React Native', 'HTML/CSS', 'JavaScript'].map((tech) => (
                        <span key={tech} className="text-[8px] sm:text-[10px] font-mono px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#7C83FF]/10 border border-[#7C83FF]/20 text-[#7C83FF]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Node 4 - Current State - Center */}
            <div ref={nodeRefs[3]} className="reveal relative flex justify-center will-change-transform" style={{ transitionDelay: revealDelays[3] }}>
              <div className="absolute left-[16px] sm:left-1/2 transform sm:-translate-x-1/2 -mt-2">
                <span className="block w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#7C83FF] border-2 border-white shadow-lg shadow-[#7C83FF]/30 animate-pulse" />
              </div>
              <div className="text-center pt-4 sm:pt-6 w-full ml-8 sm:ml-0">
                <span className="block text-[0.6rem] sm:text-[0.72rem] tracking-[0.14em] uppercase text-gray-500 mb-1.5 sm:mb-2.5 font-mono text-left sm:text-center">
                  CURRENT STATE
                </span>
                <div className="inline-block w-full sm:w-auto bg-gradient-to-r from-[#7C83FF]/10 to-[#B8A7FF]/10 border border-[#7C83FF]/30 rounded-2xl px-4 sm:px-8 py-3 sm:py-4">
                  <span className="font-display text-base sm:text-xl text-gray-900 flex items-center gap-2 sm:gap-3 justify-center">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
                    Open to opportunities
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}