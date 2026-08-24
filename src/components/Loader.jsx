import { useEffect, useState } from 'react';

export default function Loader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => Math.min(96, p + Math.random() * 18));
    }, 120);

    const finish = () => {
      clearInterval(timer);
      setProgress(100);
      setTimeout(() => setHidden(true), 250);
      setTimeout(() => {
        setRemoved(true);
        onDone && onDone();
      }, 950);
    };

    if (document.readyState === 'complete') {
      setTimeout(finish, 600);
    } else {
      window.addEventListener('load', finish);
    }
    return () => {
      clearInterval(timer);
      window.removeEventListener('load', finish);
    };
  }, [onDone]);

  if (removed) return null;

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center gap-5 bg-hero-bg transition-opacity duration-700 ease-cinematic ${
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="font-display text-lg tracking-[0.3em] text-hero-muted">Parmeet Kaur</div>
      <div className="w-40 h-px bg-hero-border overflow-hidden">
        <div
          className="h-full bg-hero-accent transition-[width] duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
