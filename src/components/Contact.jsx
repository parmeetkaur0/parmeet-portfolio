import { useState } from 'react';
import useReveal from '../hooks/useReveal';
import ContactForm from './ContactForm';

export default function Contact() {
  const ref = useReveal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
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
            <button 
              onClick={openModal} 
              className="btn-line px-8 py-4 text-[0.9rem] hover:bg-[#7C83FF] hover:text-white transition-all duration-300"
            >
              Get in Touch
            </button>
            <a 
              href="https://www.linkedin.com/in/parmeet-kaur0/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted text-[0.85rem] hover:text-[#7C83FF] transition-colors duration-300"
            >
              LinkedIn
            </a>
            <a 
              href="mailto:kparmeet300@gmail.com" 
              className="text-muted text-[0.85rem] hover:text-[#7C83FF] transition-colors duration-300"
            >
              Email
            </a>
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 flex items-center justify-center transition-all duration-300 hover:scale-110"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <span className="inline-block text-[#7C83FF] font-mono text-[0.6rem] sm:text-[0.7rem] tracking-[0.2em] uppercase bg-[#7C83FF]/10 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#7C83FF]/20 mb-3">
                  Get In Touch
                </span>
                <h2 className="font-display text-2xl sm:text-3xl text-gray-900">
                  Let's build something.
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Have a project in mind? Send a message and I'll get back to you soon.
                </p>
              </div>

              {/* Contact Form */}
              <ContactForm />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </>
  );
}