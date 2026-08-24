import useReveal from '../hooks/useReveal';

export default function Contact() {
  const ref = useReveal();
  return (
    <section id="contact" className="section relative overflow-hidden text-center pt-24 pb-20">
      <div
        aria-hidden="true"
        className="contact-orb pointer-events-none absolute left-[40%] -translate-x-1/2 top-[8%] w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle at 35% 30%, rgba(79,70,229,0.18), rgba(180,129,31,0.08) 55%, transparent 75%)',
          filter: 'blur(6px)',
        }}
      />
      <div ref={ref} className="reveal relative max-w-[720px] mx-auto px-6">
        <h2 className="font-display text-[clamp(2.6rem,7vw,5.2rem)] leading-[1.02] mb-6">
          Let's build<br />something<br />great.
        </h2>
        <p className="text-muted mb-11">
          Open to opportunities, collaborations and interesting products.
        </p>
        <div className="flex items-center justify-center gap-7 flex-wrap">
          <a href="/contactform" className="btn-line px-8 py-4 text-[0.9rem]">Get in Touch</a>
          <a href="https://www.linkedin.com/in/parmeet-kaur0/" className="text-muted text-[0.85rem] hover:text-ink transition-colors duration-300">LinkedIn</a>
          <a href="mailto:kparmeet300@gmail.com" className="text-muted text-[0.85rem] hover:text-ink transition-colors duration-300">Email</a>
        </div>
      </div>
    </section>
  );
}
