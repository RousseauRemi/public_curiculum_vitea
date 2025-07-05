import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, FileDown } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { usePDFGeneration } from '../../shared/hooks/usePDFGeneration';

// Final call-to-action band — gives the page a strong closing instead of
// ending on the archived projects.
const ContactCTA: React.FC = () => {
  const { language, getCVData } = useAppStore();
  const { personalInfo } = getCVData();
  const { EnhancedPDFButton } = usePDFGeneration();

  const isFr = language === 'fr';

  return (
    <section id="contact-cta" className="print-hidden relative overflow-hidden bg-slate-950">
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-primary-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <motion.p
          className="eyebrow !text-primary-400 mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Contact
        </motion.p>

        <motion.h2
          className="font-display text-3xl sm:text-5xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {isFr ? 'Travaillons ensemble' : "Let's work together"}
        </motion.h2>

        <motion.p
          className="text-slate-400 text-lg max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {isFr
            ? 'Un projet, une mission, une équipe à renforcer ? Discutons-en — je réponds rapidement.'
            : 'A project, a mission, a team to strengthen? Let’s talk — I reply quickly.'}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-semibold px-7 py-3.5 rounded-xl shadow-lg shadow-primary-600/25 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Mail size={18} />
            {isFr ? 'Me contacter' : 'Contact me'}
          </a>
          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5"
          >
            <Linkedin size={18} />
            LinkedIn
          </a>
          <EnhancedPDFButton className="inline-flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-200 font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5">
            <FileDown size={18} />
            {isFr ? 'Télécharger CV' : 'Download CV'}
          </EnhancedPDFButton>
        </motion.div>

        <p className="text-slate-600 text-sm mt-16">
          © {new Date().getFullYear()} {personalInfo.prenom} {personalInfo.nom} — React · TypeScript · Tailwind CSS
        </p>
      </div>
    </section>
  );
};

export default ContactCTA;
