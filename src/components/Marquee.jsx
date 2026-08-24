const ITEMS = [
  'React',
  'Next.js',
  'Node.js',
  'MongoDB',
  'SQL',
  'React Native',
  'Express.js',
  'REST APIs',
];

export default function Marquee() {
  const track = [...ITEMS, ...ITEMS]; // duplicated for seamless loop

  return (
    <div className="marquee-pause relative overflow-hidden py-3">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-[clamp(1.1rem,2.4vw,1.7rem)] text-ink/90">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-warm" aria-hidden="true" />
          </span>
        ))}
      </div>
      {/* edge fades so the loop feels seamless against the page */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-paper2 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-paper2 to-transparent" />
    </div>
  );
}
