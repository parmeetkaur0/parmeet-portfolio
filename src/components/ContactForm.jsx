// ContactForm.jsx (Updated - without Nav)
import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import useReveal from '../hooks/useReveal';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

// EmailJS configuration
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL;

const initialForm = { name: '', email: '', subject: '', message: '' };

export default function ContactForm() {
  const formRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle');
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
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
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
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 sm:p-6 space-y-4 sm:space-y-5"
    >
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
        <Field label="Name">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
            className="field-input w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-[0.92rem] text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:border-[#7C83FF] focus:ring-2 focus:ring-[#7C83FF]/20"
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
            className="field-input w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-[0.92rem] text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:border-[#7C83FF] focus:ring-2 focus:ring-[#7C83FF]/20"
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
          className="field-input w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-[0.92rem] text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:border-[#7C83FF] focus:ring-2 focus:ring-[#7C83FF]/20"
        />
      </Field>

      <Field label="Message">
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me a bit about your project…"
          required
          rows={4}
          className="field-input w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm sm:text-[0.92rem] text-gray-900 placeholder:text-gray-400 transition-all duration-300 focus:outline-none focus:border-[#7C83FF] focus:ring-2 focus:ring-[#7C83FF]/20 resize-none"
        />
      </Field>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 pt-1">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white bg-[#7C83FF] transition-all duration-300 hover:bg-[#6b72f0] hover:shadow-lg hover:shadow-[#7C83FF]/25 disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
        >
          {status === 'sending' ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              Send Message <Send className="w-4 h-4" />
            </>
          )}
        </button>

        {status === 'success' && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" /> Message sent — thanks!
          </span>
        )}
        {status === 'error' && (
          <span className="flex flex-wrap items-center gap-1.5 text-sm text-red-500 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-ink font-medium">
              Email directly
            </a>
          </span>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[0.65rem] sm:text-[0.7rem] tracking-[0.1em] uppercase text-gray-500 mb-1.5 font-mono">
        {label}
      </span>
      {children}
    </label>
  );
}