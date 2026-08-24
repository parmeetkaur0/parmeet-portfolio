import { useState, useEffect } from 'react';

export default function Nav({ visible = true }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const links = [
    { href: '#work', label: 'Work' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '#contact', label: 'Contact' },
  ];

  const navVisible = visible !== false;

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when clicking outside or on resize to desktop
  useEffect(() => {
    if (!isMobile && isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-paper/80 border-b border-border transition-all duration-500 ease-cinematic ${
          navVisible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 sm:px-6 md:px-12 lg:px-16 py-4 sm:py-4 md:py-5">
          {/* Logo */}
          <a
            href="/"
            className="font-display text-sm sm:text-base tracking-wide text-ink hover:text-[#7C83FF] transition-colors duration-300"
          >
            Parmeet Kaur
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex gap-6 lg:gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={(e) => handleClick(e, l.href)}
                className="text-[0.75rem] lg:text-[0.82rem] text-muted tracking-wide hover:text-[#7C83FF] transition-colors duration-300 relative group"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#7C83FF] transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
          </ul>

          {/* Mobile Hamburger Button */}
          <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col gap-1.5 p-1 z-50 relative"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span
            className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-ink transition-all duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-2' : ''
            }`}
          />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-500 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 z-40 h-full w-[280px] sm:w-[320px] bg-paper border-l border-border shadow-2xl transition-all duration-500 ease-cinematic md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-6 sm:px-8">
          {/* Mobile Menu Links */}
          <ul className="flex flex-col gap-2">
            {links.map((l, index) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => handleClick(e, l.href)}
                  className={`block text-xl sm:text-2xl font-display text-ink hover:text-[#7C83FF] transition-all duration-300 py-3 border-b border-border/50 hover:pl-4 ${
                    isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                  }`}
                  style={{
                    transitionDelay: isMenuOpen ? `${index * 0.08}s` : '0s',
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Footer */}
          <div className="mt-auto pt-8 pb-6 border-t border-border">
            <p className="text-sm text-muted">Let's connect</p>
            <div className="flex gap-4 mt-3">
              <a
                href="mailto:your@email.com"
                className="text-sm text-muted hover:text-[#7C83FF] transition-colors duration-300"
              >
                Email
              </a>
              <a
                href="https://www.linkedin.com/in/parmeet-kaur0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted hover:text-[#7C83FF] transition-colors duration-300"
              >
                LinkedIn
              </a>
              <a
                href="#"
                className="text-sm text-muted hover:text-[#7C83FF] transition-colors duration-300"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}