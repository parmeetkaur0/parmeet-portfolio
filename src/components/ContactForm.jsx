import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import useReveal from '../hooks/useReveal';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Footer from './Footer';
import Nav from './Nav';

// Fill these in from your EmailJS dashboard (emailjs.com → Email Services /
// Email Templates / Account → General → Public Key). Never hardcode a
// *private* key here — only the public key is meant for client-side use.
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const headRef = useReveal();
  const formRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      setErrorMsg('Please fill in your name, email, and message.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus('error');
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          subject: form.subject || 'New message from portfolio site',
          message: form.message,
        },
        PUBLIC_KEY
      );
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
      const providerError = err?.text || err?.message;
      setErrorMsg(
        providerError
          ? `Message could not be sent: ${providerError}`
          : 'Something went wrong sending your message. Please try again or email me directly.'
      );
    }
  };

  return (
    <>
    <Nav />
    <section id="contact" className="section py-[clamp(48px,8vw,100px)]">
      <div className="max-w-[720px] mx-auto px-6 md:px-16">
        <div ref={headRef} className="reveal mb-10 md:mb-14">
          <span className="eyebrow">Get In Touch</span>
          <h2 className="font-display text-[clamp(2rem,5vw,3.4rem)] mb-4 leading-tight">
            Let's build something.
          </h2>
          <p className="text-muted max-w-[520px]">
            Have a project in mind or just want to say hi? Send a message and I'll get back to you soon.
          </p>
        </div>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-border bg-bg-secondary p-6 md:p-8 space-y-5"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Name">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="field-input"
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                required
                className="field-input"
              />
            </Field>
          </div>

          <Field label="Subject">
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              className="field-input"
            />
          </Field>

          <Field label="Message">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me a bit about your project…"
              required
              rows={5}
              className="field-input resize-none"
            />
          </Field>

          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white bg-[#7C83FF] transition-all duration-300 hover:bg-[#6b72f0] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? (
                'Sending…'
              ) : (
                <>
                  Send Message <Send className="w-4 h-4" />
                </>
              )}
            </button>

            {status === 'success' && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <CheckCircle2 className="w-4 h-4" /> Message sent — thanks!
              </span>
            )}
            {status === 'error' && (
              <span className="flex flex-wrap items-center gap-1.5 text-sm text-red-500">
                <AlertCircle className="w-4 h-4" /> {errorMsg}
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-ink">
                  Email directly
                </a>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Scoped field styles so this drops in without touching global CSS */}
      <style>{`
        .field-input {
          width: 100%;
          background: transparent;
          border: 1px solid var(--border-color, rgba(15,17,28,0.14));
          border-radius: 0.75rem;
          padding: 0.7rem 0.9rem;
          font-size: 0.92rem;
          color: inherit;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .field-input::placeholder {
          color: rgba(120,120,130,0.6);
        }
        .field-input:focus {
          outline: none;
          border-color: #7C83FF;
          box-shadow: 0 0 0 3px rgba(124,131,255,0.15);
        }
      `}</style>
    </section>
      </>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[0.7rem] tracking-[0.1em] uppercase text-muted mb-1.5">{label}</span>
      {children}
    </label>
  );
}