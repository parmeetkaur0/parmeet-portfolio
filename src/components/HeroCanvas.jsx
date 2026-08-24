import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroCanvas() {
  const sectionRef = useRef(null);
  const visualRef = useRef(null);
  const copyRef = useRef(null);
  const orbRef = useRef(null);
  const ringsRef = useRef(null);
  const portraitUrl = '/images/portrait.jpg';

  useEffect(() => {
    const section = sectionRef.current;
    const visual = visualRef.current;
    const copy = copyRef.current;
    const orb = orbRef.current;
    const rings = ringsRef.current;

    if (!section || !visual || !copy) return;

    // -----------------------------
    // INITIAL STATES
    // -----------------------------

    gsap.set(copy.children, {
      opacity: 0,
      y: 35,
    });

    gsap.set(visual, {
      opacity: 0,
      scale: 0.82,
      x: 50,
    });

    // -----------------------------
    // HERO ENTRANCE
    // -----------------------------

    const intro = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
    });

    intro
      .to(visual, {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 1.4,
        delay: 0.15,
      })
      .to(
        copy.children,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
        },
        "-=0.9"
      );

    // -----------------------------
    // CONTINUOUS 3D MOTION
    // -----------------------------

    const cubes = visual.querySelectorAll(".hero-cube");

    cubes.forEach((cube, index) => {
      gsap.to(cube, {
        y: index % 2 === 0 ? -14 : 14,
        rotationX: index % 2 === 0 ? 8 : -8,
        rotationY: index % 2 === 0 ? 12 : -12,
        duration: 2.8 + index * 0.18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.12,
      });
    });

    // Main glass orb
    gsap.to(orb, {
      y: -18,
      x: 8,
      duration: 3.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Slow orbit rotation
    gsap.to(rings, {
      rotation: 360,
      duration: 28,
      repeat: -1,
      ease: "none",
    });

    // Small particles
    const particles = visual.querySelectorAll(".hero-particle");

    particles.forEach((particle, index) => {
      gsap.to(particle, {
        y: index % 2 === 0 ? -20 : 20,
        x: index % 3 === 0 ? 12 : -12,
        opacity: 0.45,
        duration: 2.5 + index * 0.25,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.15,
      });
    });

    // -----------------------------
    // MOUSE PARALLAX (disabled on mobile)
    // -----------------------------

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const progress = Math.max(
        0,
        Math.min(1, -rect.top / window.innerHeight)
      );

      gsap.to(copy, {
        y: -progress * 100,
        opacity: 1 - progress * 1.3,
        duration: 0.25,
        overwrite: true,
      });

      gsap.to(visual, {
        y: -progress * 80,
        scale: 1 - progress * 0.12,
        opacity: 1 - progress * 0.7,
        duration: 0.25,
        overwrite: true,
      });
    };

    let handleMouseMove;

    if (!isTouchDevice) {
      handleMouseMove = (event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        gsap.to(visual, {
          rotationY: x * 8,
          rotationX: -y * 6,
          duration: 1,
          ease: "power3.out",
        });

        gsap.to(rings, {
          x: x * 18,
          y: y * 12,
          duration: 1.2,
          ease: "power3.out",
        });

        gsap.to(orb, {
          x: x * 25,
          y: y * 20,
          duration: 1.2,
          ease: "power3.out",
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
    }

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      if (!isTouchDevice && handleMouseMove) {
        window.removeEventListener("mousemove", handleMouseMove);
      }

      window.removeEventListener("scroll", handleScroll);
      intro.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-auto overflow-hidden"
    >
      {/* =========================
          BACKGROUND
      ========================== */}

      <div className="absolute inset-0 pointer-events-none">
        <div className="hero-grid absolute inset-0" />

        <div className="absolute left-[8%] top-[18%] h-1 w-1 rounded-full bg-[#9188FF]/40 hidden sm:block" />
        <div className="absolute left-[15%] top-[65%] h-1.5 w-1.5 rounded-full bg-[#9188FF]/30 hidden md:block" />
        <div className="absolute right-[14%] top-[24%] h-1 w-1 rounded-full bg-[#9188FF]/40 hidden sm:block" />
        <div className="absolute right-[8%] bottom-[22%] h-1.5 w-1.5 rounded-full bg-[#9188FF]/30 hidden md:block" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px] items-center px-4 sm:px-6 md:px-12 lg:px-16 py-2 sm:py-4 md:py-6">
        <div className="grid w-full items-center gap-6 sm:gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
          
          {/* =====================
              RIGHT VISUAL
          ====================== */}

          <div className="relative flex min-h-[280px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[680px] items-center justify-center order-first lg:order-last">
            <div
              ref={visualRef}
              className="hero-visual relative h-[280px] w-[280px] xs:h-[300px] xs:w-[300px] sm:h-[340px] sm:w-[340px] md:h-[400px] md:w-[400px] lg:h-[560px] lg:w-[560px] xl:h-[600px] xl:w-[600px] 2xl:h-[680px] 2xl:w-[680px] max-w-full transform-gpu"
            >
              {/* Soft glow */}
              <div className="absolute left-1/2 top-1/2 h-[160px] w-[160px] xs:h-[180px] xs:w-[180px] sm:h-[200px] sm:w-[200px] md:h-[240px] md:w-[240px] lg:h-[280px] lg:w-[280px] xl:h-[320px] xl:w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#A69EFF]/70 blur-[40px] sm:blur-[60px] md:blur-[80px] lg:blur-[100px]" />

              {/* Orbit system 1 - Outer orbit */}
              <div
                ref={ringsRef}
                className="absolute inset-[7%] rounded-full border border-[#9188FF]/20"
              >
                <div className="absolute left-1/2 top-[-4px] h-1.5 w-1.5 sm:h-2 sm:w-2 -translate-x-1/2 rounded-full bg-[#9188FF]/40" />
                <div className="absolute bottom-[8%] left-[5%] h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#B7B1FF]/60" />
                <div className="absolute top-[15%] right-[8%] h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-[#9188FF]/40" />
              </div>

              {/* Orbit system 2 - Inner orbit */}
              <div className="absolute inset-[15%] rounded-full border border-[#9188FF]/10">
                <div className="absolute right-[5%] top-[20%] h-1 w-1 rounded-full bg-[#B7B1FF]/40" />
                <div className="absolute bottom-[12%] left-[10%] h-1 w-1 rounded-full bg-[#9188FF]/30" />
              </div>

              {/* Orbit system 3 - Smallest orbit ring */}
              <div className="absolute inset-[22%] rounded-full border border-[#9188FF]/5">
                <div className="absolute left-[8%] top-[30%] h-0.5 w-0.5 sm:h-1 sm:w-1 rounded-full bg-[#B7B1FF]/30" />
              </div>

              {/* Main portrait circle */}
              <div className="absolute left-1/2 top-1/2 z-20 flex h-[180px] w-[180px] xs:h-[200px] xs:w-[200px] sm:h-[220px] sm:w-[220px] md:h-[260px] md:w-[260px] lg:h-[340px] lg:w-[340px] xl:h-[380px] xl:w-[380px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-[#7C83FF] p-1.5 sm:p-2 shadow-[0_15px_40px_rgba(107,96,211,0.18)] md:shadow-[0_20px_60px_rgba(107,96,211,0.18)] backdrop-blur-md">
                <div className="absolute inset-0.5 sm:inset-1 rounded-full border border-[#8B83FF]/25" />
                <img
                  src={portraitUrl}
                  alt="Parmeet Kaur portrait"
                  className="h-full w-full rounded-full object-cover object-center ring-2 sm:ring-4 ring-[#B8A7FF]"
                />
              </div>

              {/* Bottom glow ring */}
              <div className="absolute bottom-[16%] left-1/2 h-[12px] xs:h-[16px] sm:h-[24px] md:h-[30px] lg:h-[34px] xl:h-[40px] w-[80px] xs:w-[120px] sm:w-[180px] md:w-[240px] lg:w-[320px] xl:w-[380px] -translate-x-1/2 rounded-[50%] border border-white/60 bg-white/50 shadow-[0_10px_20px_rgba(50,45,90,0.10)] backdrop-blur-sm" />

              {/* 3D Cubes */}
              <div className="absolute left-1/2 top-1/2 h-[140px] w-[140px] xs:h-[160px] xs:w-[160px] sm:h-[200px] sm:w-[200px] md:h-[240px] md:w-[240px] lg:h-[300px] lg:w-[300px] xl:h-[340px] xl:w-[340px] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]">
                <Cube
                  className="hero-cube absolute left-[2px] xs:left-[5px] sm:left-[20px] top-[10px] xs:top-[15px] sm:top-[40px] md:top-[48px]"
                  size="14px 18px 48px 58px 68px"
                />

                <Cube
                  className="hero-cube absolute right-[2px] xs:right-[5px] sm:right-[25px] top-[12px] xs:top-[18px] sm:top-[55px] md:top-[65px]"
                  size="16px 20px 60px 72px 82px"
                  glass
                />

                <Cube
                  className="hero-cube absolute left-[10px] xs:left-[15px] sm:left-[55px] top-[30px] xs:top-[40px] sm:top-[110px] md:top-[125px]"
                  size="18px 24px 65px 78px 88px"
                  glass
                />

                <Cube
                  className="hero-cube absolute left-1/2 top-[20px] xs:top-[25px] sm:top-[70px] md:top-[80px] -translate-x-1/2"
                  size="24px 32px 90px 105px 115px"
                  glass
                  strong
                />

                <Cube
                  className="hero-cube absolute left-[2px] xs:left-[3px] sm:left-[15px] bottom-[8px] xs:bottom-[12px] sm:bottom-[38px] md:bottom-[45px]"
                  size="12px 18px 52px 68px 78px"
                />

                <Cube
                  className="hero-cube absolute left-[20px] xs:left-[30px] sm:left-[90px] bottom-[4px] xs:bottom-[6px] sm:bottom-[22px] md:bottom-[28px]"
                  size="16px 24px 68px 82px 92px"
                  glass
                />

                <Cube
                  className="hero-cube absolute right-[2px] xs:right-[5px] sm:right-[25px] bottom-[8px] xs:bottom-[12px] sm:bottom-[35px] md:bottom-[42px]"
                  size="12px 18px 48px 62px 72px"
                />
              </div>

              {/* Glass orb */}
              <div
                ref={orbRef}
                className="absolute bottom-[4%] xs:bottom-[6%] sm:bottom-[10%] right-[4%] xs:right-[8%] sm:right-[12%] h-[20px] w-[20px] xs:h-[28px] xs:w-[28px] sm:h-[50px] sm:w-[50px] md:h-[70px] md:w-[70px] lg:h-[100px] lg:w-[100px] xl:h-[120px] xl:w-[120px] rounded-full border border-white/80 bg-gradient-to-br from-[#D9D5FF]/90 via-[#AFA8FF]/65 to-[#8178F0]/45 shadow-[inset_-4px_-4px_8px_rgba(90,80,180,0.12),0_8px_20px_rgba(60,50,120,0.15)] backdrop-blur-sm"
              />

              {/* Particles */}
              <span className="hero-particle absolute left-[5%] sm:left-[12%] top-[22%] sm:top-[30%] h-1 w-1 sm:h-2 sm:w-2 rounded-full bg-[#9B93FF]/50" />
              <span className="hero-particle absolute right-[5%] sm:right-[15%] top-[18%] sm:top-[20%] h-1 w-1 sm:h-3 sm:w-3 rounded-full bg-[#9B93FF]/40" />
              <span className="hero-particle absolute right-[2%] sm:right-[4%] top-[45%] sm:top-[48%] h-1 w-1 sm:h-2 sm:w-2 rounded-full bg-[#9B93FF]/50" />
              <span className="hero-particle absolute left-[8%] sm:left-[18%] bottom-[20%] sm:bottom-[28%] h-1 w-1 sm:h-3 sm:w-3 rounded-full bg-[#9B93FF]/35" />
              <span className="hero-particle absolute right-[18%] sm:right-[26%] bottom-[8%] sm:bottom-[13%] h-1 w-1 sm:h-2 sm:w-2 rounded-full bg-[#9B93FF]/50" />

              {/* Info cards */}
              <div className="absolute right-[2%] sm:right-[4%] top-[12%] sm:top-[18%] rounded-xl border border-white/80 bg-white/65 px-2 sm:px-4 py-1.5 sm:py-3 shadow-lg shadow-gray-200/20 backdrop-blur-xl hidden xs:block">
                <div className="font-mono text-[7px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-gray-400">
                  Stack
                </div>
                <div className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs font-medium text-gray-700">
                  MERN
                </div>
              </div>

              <div className="absolute bottom-[18%] sm:bottom-[24%] left-[2%] sm:left-[4%] rounded-xl border border-white/80 bg-white/65 px-2 sm:px-4 py-1.5 sm:py-3 shadow-lg shadow-gray-200/20 backdrop-blur-xl hidden xs:block">
                <div className="font-mono text-[7px] sm:text-[9px] uppercase tracking-[0.12em] sm:tracking-[0.18em] text-gray-400">
                  Focus
                </div>
                <div className="mt-0.5 sm:mt-1 text-[8px] sm:text-xs font-medium text-gray-700">
                  Web · UI · Systems
                </div>
              </div>
            </div>
          </div>

          {/* =====================
              LEFT CONTENT - SMALLER HEADING & FULL WIDTH
          ====================== */}

          <div
            ref={copyRef}
            className="relative z-20 max-w-full w-full text-center lg:text-left mx-auto order-last lg:order-first"
          >
            {/* Eyebrow - Smaller */}
            <div className="mb-2 xs:mb-3 sm:mb-4 flex items-center justify-center lg:justify-start gap-2">
              <span className="h-[5px] w-[5px] xs:h-[6px] xs:w-[6px] rounded-full bg-[#7C83FF] hidden sm:inline-block" />
              <span className="font-mono text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.14em] xs:tracking-[0.18em] sm:tracking-[0.22em] text-gray-500">
                👋 HELLO, I'M PARMEET KAUR
              </span>
            </div>

          <h1 className="font-display text-[clamp(2.4rem,7vw,6.8rem)] font-medium leading-[0.95] sm:leading-[0.91] tracking-[-0.04em] sm:tracking-[-0.055em] text-[#111522]">
              Building
              <br />

              <span className="relative inline-block">
                digital
                <span className="absolute -bottom-1 left-0 h-[3px] w-[40px] sm:w-[72px] bg-[#8B83FF]" />
              </span>

              <br />

              <span className="text-[#7C83FF]">
                experiences.
              </span>
            </h1>

            {/* Description - Full width on small screens */}
            <p className="mt-2 xs:mt-3 sm:mt-4 md:mt-5 w-full text-[0.8rem] xs:text-[0.85rem] sm:text-[0.95rem] md:text-[1.05rem] leading-5 xs:leading-6 sm:leading-7 text-gray-500 lg:max-w-[500px]">
              I'm a full-stack developer who loves creating modern, 
              interactive, and scalable web experiences.
              <span className="block mt-1 text-[#7C83FF] font-medium text-[0.85rem] xs:text-[0.9rem] sm:text-[1rem]">
                Let's build something amazing together.
              </span>
            </p>

            {/* Buttons - Compact */}
            <div className="mt-4 xs:mt-5 sm:mt-6 md:mt-7 flex flex-wrap items-center justify-center lg:justify-start gap-2 xs:gap-2.5 sm:gap-3">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-[#111522] px-4 xs:px-4 sm:px-5 py-2 xs:py-2 sm:py-2.5 text-[0.75rem] xs:text-[0.8rem] sm:text-[0.85rem] text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                View my work
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/60 px-4 xs:px-4 sm:px-5 py-2 xs:py-2 sm:py-2.5 text-[0.75rem] xs:text-[0.8rem] sm:text-[0.85rem] text-[#111522] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#8B83FF]"
              >
                Let's connect
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* =========================
          FOOTER ELEMENTS
      ========================== */}

      <div className="absolute bottom-3 xs:bottom-4 sm:bottom-6 md:bottom-8 left-3 xs:left-4 sm:left-6 md:left-12 flex items-center gap-2 xs:gap-3">
        <span className="font-mono text-[7px] xs:text-[8px] sm:text-[9px] uppercase tracking-[0.12em] xs:tracking-[0.14em] sm:tracking-[0.18em] text-gray-400 hidden xs:inline">
          Scroll to explore
        </span>
        <div className="h-4 xs:h-5 sm:h-6 w-px overflow-hidden bg-gray-200">
          <div className="h-full w-full origin-top animate-[scrollLine_1.8s_ease-in-out_infinite] bg-[#8B83FF]" />
        </div>
      </div>

      <div className="absolute bottom-3 xs:bottom-4 sm:bottom-6 md:bottom-8 right-3 xs:right-4 sm:right-6 md:right-12 font-mono text-[7px] xs:text-[8px] sm:text-[9px] tracking-[0.14em] xs:tracking-[0.16em] sm:tracking-[0.2em] text-gray-400">
        01 / 05
      </div>
    </section>
  );
}

function Cube({
  className = "",
  size = "70px",
  glass = false,
  strong = false,
  responsive = false,
}) {
  // Handle responsive sizes - supports multiple breakpoints
  let finalSize = size;
  if (typeof window !== 'undefined') {
    const width = window.innerWidth;
    const sizes = size.split(' ');
    
    if (width < 480) {
      finalSize = sizes[0] || sizes[sizes.length - 1] || '16px';
    } else if (width < 640) {
      finalSize = sizes[1] || sizes[0] || '20px';
    } else if (width < 768) {
      finalSize = sizes[2] || sizes[1] || sizes[0] || '48px';
    } else if (width < 1024) {
      finalSize = sizes[3] || sizes[2] || sizes[1] || '58px';
    } else {
      finalSize = sizes[4] || sizes[3] || sizes[2] || '68px';
    }
  }

  // Parse size to get numeric value for depth
  const numericSize = parseInt(finalSize) || 30;
  const depth = `translateZ(${numericSize / 2}px)`;

  return (
    <div
      className={`hero-cube ${className}`}
      style={{
        width: finalSize,
        height: finalSize,
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className={`cube-face cube-front ${
          glass ? "cube-glass" : ""
        } ${strong ? "cube-strong" : ""}`}
        style={{
          transform: depth,
        }}
      />

      <div
        className={`cube-face cube-back ${
          glass ? "cube-glass" : ""
        } ${strong ? "cube-strong" : ""}`}
        style={{
          transform: `rotateY(180deg) ${depth}`,
        }}
      />

      <div
        className={`cube-face cube-right ${
          glass ? "cube-glass" : ""
        } ${strong ? "cube-strong" : ""}`}
        style={{
          transform: `rotateY(90deg) ${depth}`,
        }}
      />

      <div
        className={`cube-face cube-left ${
          glass ? "cube-glass" : ""
        } ${strong ? "cube-strong" : ""}`}
        style={{
          transform: `rotateY(-90deg) ${depth}`,
        }}
      />

      <div
        className={`cube-face cube-top ${
          glass ? "cube-glass" : ""
        } ${strong ? "cube-strong" : ""}`}
        style={{
          transform: `rotateX(90deg) ${depth}`,
        }}
      />

      <div
        className={`cube-face cube-bottom ${
          glass ? "cube-glass" : ""
        } ${strong ? "cube-strong" : ""}`}
        style={{
          transform: `rotateX(-90deg) ${depth}`,
        }}
      />
    </div>
  );
}