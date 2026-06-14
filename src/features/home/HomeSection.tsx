import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Linkedin, ExternalLink, FileDown } from 'lucide-react';
import SectionWrapper from '../../shared/components/SectionWrapper';
import TechChip from '../../shared/components/TechChip';
import useAppStore from '../../store/useAppStore';
import { useTranslation } from '../../shared/hooks/useTranslation';
import { usePDFGeneration } from '../../shared/hooks/usePDFGeneration';
import { SkeletonHomeName } from '../../shared/components/SkeletonLoader';

const CAREER_START_YEAR = 2014;

const HomeSection: React.FC = () => {
  const { language, getCVData, isHydrated, setHydrated } = useAppStore();
  const { t } = useTranslation(language);
  const { EnhancedPDFButton } = usePDFGeneration();
  const { personalInfo, experiences, projetsInternes } = getCVData();

  // Ensure hydration is set on client side
  useEffect(() => {
    if (!isHydrated) {
      setHydrated(true);
    }
  }, [isHydrated, setHydrated]);

  const isFr = language === 'fr';
  const yearsOfExperience = new Date().getFullYear() - CAREER_START_YEAR;

  const stats = [
    {
      value: `${yearsOfExperience}+`,
      label: isFr ? "années d'expérience" : 'years of experience'
    },
    {
      value: `${experiences.length}`,
      label: isFr ? 'missions réalisées' : 'missions completed'
    },
    {
      // Only company-related internal projects (exclude personal/hobby ones)
      value: `${projetsInternes.filter((p) => !p.personal).length}`,
      label: isFr ? 'projets internes' : 'internal projects'
    }
  ];

  // Hover tooltips for the tech chips — years of experience sourced from the
  // skills/competences descriptions (career start 2014).
  const techMeta: Record<string, { fr: string; en: string }> = {
    '.NET': {
      fr: '10+ ans • C#, .NET 8 & Entity Framework Core (migrations, LINQ optimisé)',
      en: '10+ yrs • C#, .NET 8 & Entity Framework Core (migrations, optimized LINQ)',
    },
    AI: {
      fr: '~2 ans • LLM, agents IA, MCP & protocole OpenAI (Claude Code, Ollama)',
      en: '~2 yrs • LLMs, AI agents, MCP & OpenAI protocol (Claude Code, Ollama)',
    },
    Angular: {
      fr: '4 ans • Angular & RxJS sur projets clients',
      en: '4 yrs • Angular & RxJS on client projects',
    },
    React: {
      fr: '2 ans • SPA modernes en poste actuel',
      en: '2 yrs • modern SPAs in current role',
    },
    TypeScript: {
      fr: '4 ans • front Angular & React typés',
      en: '4 yrs • typed Angular & React front-ends',
    },
    Python: {
      fr: '2 ans • API, IA, MCP & protocole OpenAI',
      en: '2 yrs • APIs, AI, MCP & OpenAI protocol',
    },
    Flutter: {
      fr: '2 ans • apps mobiles (projets internes)',
      en: '2 yrs • mobile apps (internal projects)',
    },
  };

  const heroPitch = isFr
    ? "Développeur .NET Full Stack spécialisé Angular, React, Python et Flutter. J'allie expertise technique et esprit d'innovation pour concevoir des applications robustes, du client lourd au web moderne."
    : 'Full Stack .NET developer specialized in Angular, React, Python and Flutter. I combine technical expertise and innovation to build robust applications, from desktop clients to modern web.';

  const contactItems = [
    {
      icon: <Mail size={20} />,
      label: t('contact.email'),
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
    },
    {
      icon: <MapPin size={20} />,
      label: t('contact.location'),
      value: personalInfo.localisation,
      href: null,
    },
    {
      icon: <Linkedin size={20} />,
      label: t('contact.linkedin'),
      value: 'LinkedIn',
      href: personalInfo.linkedin,
    },
  ];

  const passionIcons = {
    'Projets internes': '🛠️',
    'Internal projects': '🛠️',
    'Sport': '🏃‍♂️',
    'Sports': '🏃‍♂️',
    'Méditation': '🧘‍♂️',
    'Meditation': '🧘‍♂️',
    'Lecture': '📚',
    'Reading': '📚',
    'Musique': '🎵',
    'Music': '🎵',
  };

  return (
    <SectionWrapper
      id="home"
      className="section-tint relative overflow-hidden"
      containerClassName="w-full"
    >
      {/* Subtle decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[32rem] h-[32rem] bg-primary-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full relative z-10">
        {!isHydrated ? (
          <SkeletonHomeName />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[60vh] mb-20">
            {/* Left column — pitch */}
            <div className="lg:col-span-7 text-center lg:text-left order-2 lg:order-1">
              {/* Availability — first thing a recruiter should see */}
              <motion.div
                className="availability-status inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-200 mb-6 text-sm font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="relative flex w-2.5 h-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full w-2.5 h-2.5 bg-emerald-500"></span>
                </span>
                <span>{t(`availability.${personalInfo.availabilityStatus}`)}</span>
              </motion.div>

              <motion.h1
                className="font-display text-5xl lg:text-7xl font-bold text-neutral-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
              >
                {personalInfo.prenom}{' '}
                <span className="text-transparent bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text">
                  {personalInfo.nom}
                </span>
              </motion.h1>

              <motion.h2
                className="font-display text-xl lg:text-2xl font-semibold text-neutral-700 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {isFr ? 'Développeur Full Stack' : 'Full Stack Developer'}
              </motion.h2>

              <motion.p
                className="text-neutral-600 text-lg leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                {heroPitch}
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="pdf-buttons flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-primary-600/25 transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Mail size={18} />
                  {isFr ? 'Me contacter' : 'Contact me'}
                </a>
                <EnhancedPDFButton className="inline-flex items-center gap-2 bg-white text-neutral-800 border border-secondary-200 hover:border-secondary-300 font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5">
                  <FileDown size={18} />
                  {isFr ? 'Télécharger CV' : 'Download CV'}
                </EnhancedPDFButton>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex items-center justify-center w-12 h-12 bg-white text-neutral-700 border border-secondary-200 hover:border-secondary-300 hover:text-primary-600 rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Linkedin size={20} />
                </a>
              </motion.div>

              {/* Key metrics */}
              <motion.div
                className="flex items-center justify-center lg:justify-start gap-8 mb-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="font-display text-3xl font-bold text-neutral-900">{stat.value}</p>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Stack */}
              <motion.div
                className="flex flex-wrap justify-center lg:justify-start gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {['.NET', 'AI', 'Angular', 'React', 'TypeScript', 'Python', 'Flutter'].map((tech) => (
                  <TechChip
                    key={tech}
                    technology={tech}
                    tooltip={techMeta[tech] ? (isFr ? techMeta[tech].fr : techMeta[tech].en) : undefined}
                  />
                ))}
              </motion.div>
            </div>

            {/* Right column — photo */}
            <motion.div
              className="lg:col-span-5 flex justify-center order-1 lg:order-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <div className="relative">
                {/* Gradient halo behind the photo */}
                <div className="absolute -inset-6 bg-gradient-to-tr from-primary-500/30 via-accent-400/20 to-transparent rounded-[2.5rem] blur-2xl"></div>
                <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-secondary-200 rotate-2 hover:rotate-0 transition-transform duration-500">
                  <img
                    src={personalInfo.profileImage}
                    alt={`${personalInfo.prenom} ${personalInfo.nom}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to initials if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.nextSibling) return;

                      const fallback = document.createElement('div');
                      fallback.className = 'w-full h-full bg-primary-600 flex items-center justify-center text-white text-4xl font-bold';
                      fallback.textContent = `${personalInfo.prenom[0]}${personalInfo.nom[0]}`;
                      target.parentNode?.appendChild(fallback);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Content Grid - About & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 max-w-6xl mx-auto">
          {/* About Me Section */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-secondary-200">
            <h2 className="font-display text-xl font-bold text-neutral-900 mb-4">
              {t('sections.aboutMe')}
            </h2>
            <p className="text-neutral-600 leading-relaxed mb-8">
              {personalInfo.description}
            </p>

            {/* Passions */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-4">Passions</h3>
              <div className="flex flex-wrap gap-2">
                {personalInfo.passions.map((passion, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-secondary-50 px-3 py-1.5 rounded-full border border-secondary-200"
                  >
                    <span className="text-base">
                      {passionIcons[passion as keyof typeof passionIcons] || '⭐'}
                    </span>
                    <span className="text-sm font-medium text-neutral-700">{passion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-secondary-200">
            <h3 className="font-display text-xl font-bold text-neutral-900 mb-4">Contact</h3>
            <div className="space-y-3">
              {contactItems.map((item, index) => (
                item.href ? (
                  <a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : '_self'}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-3 rounded-xl border border-secondary-200 hover:border-primary-300 hover:shadow-sm transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex-shrink-0 w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 group-hover:scale-105 transition-transform duration-200">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5 text-left">{item.label}</p>
                      <div className="text-neutral-800 group-hover:text-primary-600 transition-colors duration-200 font-medium flex items-center gap-1 text-left">
                        <span className="break-all">{item.value}</span>
                        {item.href.startsWith('http') && (
                          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </a>
                ) : (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl border border-secondary-200">
                    <div className="flex-shrink-0 w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5 text-left">{item.label}</p>
                      <p className="text-neutral-800 font-medium text-left">{item.value}</p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

        </div>
      </div>
    </SectionWrapper>
  );
};

export default HomeSection;
