import React, { useEffect } from 'react';
import { Mail, MapPin, Linkedin, ExternalLink, FileDown } from 'lucide-react';
import SectionWrapper from '../../shared/components/SectionWrapper';
import useAppStore from '../../store/useAppStore';
import { useTranslation } from '../../shared/hooks/useTranslation';
import { useHTMLToPDF } from '../../shared/hooks/useHTMLToPDF';
import { getTechnologyColor } from '../../shared/utils/technologyColors';
import { SkeletonHomeName } from '../../shared/components/SkeletonLoader';

const HomeSection: React.FC = () => {
  const { language, getCVData, isHydrated, setHydrated } = useAppStore();
  const { t } = useTranslation(language);
  const { EnhancedPDFButton } = useHTMLToPDF();
  const { personalInfo } = getCVData();

  // Ensure hydration is set on client side
  useEffect(() => {
    if (!isHydrated) {
      setHydrated(true);
    }
  }, [isHydrated, setHydrated]);

  // Get availability status styling using theme colors
  const getAvailabilityStyle = (status: string) => {
    switch (status) {
      case 'available-free':
        return {
          bgColor: 'bg-success-50',
          textColor: 'text-success-700',
          borderColor: 'border-success-200',
          dotColor: 'bg-success-500'
        };
      case 'in-mission-open':
        return {
          bgColor: 'bg-primary-50',
          textColor: 'text-primary-700',
          borderColor: 'border-primary-200',
          dotColor: 'bg-primary-500'
        };
      default:
        return {
          bgColor: 'bg-success-50',
          textColor: 'text-success-700',
          borderColor: 'border-success-200',
          dotColor: 'bg-success-500'
        };
    }
  };

  const availabilityStyle = getAvailabilityStyle(personalInfo.availabilityStatus);
  
  // Extract role title from description
  const getRoleTitle = () => {
    if (language === 'fr') {
      return 'Développeur Full Stack';
    } else {
      return 'Full Stack Developer';
    }
  };

  // Get cleaned description without the role title
  const getCleanedDescription = () => {
    const description = personalInfo.description;
    if (language === 'fr') {
      return description.replace('Développeur .Net Fullstack spécialisé en Angular, React, Python et Flutter, je suis', 'Je suis');
    } else {
      return description.replace('.Net Fullstack Developer specialized in Angular, React, Python and Flutter, I am', 'I am');
    }
  };

  const contactItems = [
    {
      icon: <Mail size={20} />,
      label: t('contact.email'),
      value: personalInfo.email,
      href: `mailto:${personalInfo.email}`,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: <MapPin size={20} />,
      label: t('contact.location'),
      value: personalInfo.localisation,
      href: null,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    {
      icon: <Linkedin size={20} />,
      label: t('contact.linkedin'),
      value: 'LinkedIn Profile',
      href: personalInfo.linkedin,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ];

  const passionIcons = {
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
    <SectionWrapper id="home" className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center relative overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-indigo-200/15 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-blue-300/10 rounded-full blur-xl"></div>
      </div>
      
      <div className="w-full relative z-10 text-center">
        {/* Hero Section */}
        {!isHydrated ? (
          <SkeletonHomeName />
        ) : (
        <div className="mb-16">
          <div className="relative inline-block mb-6">
            <div className="w-40 h-40 lg:w-48 lg:h-48 mx-auto rounded-full overflow-hidden shadow-2xl">
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

          <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 mb-4">
            {personalInfo.prenom} <span className="text-primary-600">{personalInfo.nom}</span>
          </h1>
          
          {/* Enhanced Role Title */}
          <div className="mb-4">
            <h2 className="text-2xl lg:text-4xl font-bold mb-6">
              <span className="text-transparent bg-gradient-to-r from-purple-700 via-blue-700 to-slate-800 bg-clip-text">
                {getRoleTitle()}
              </span>
            </h2>
            
            {/* Technology Stack Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-2xl mx-auto">
              {['.NET', 'Angular', 'React', 'TypeScript', 'Python', 'Flutter'].map((tech) => (
                <span 
                  key={tech}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-gradient-to-r ${getTechnologyColor(tech)} text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          
          {/* Availability Status */}
          <div className={`availability-status inline-flex items-center gap-3 ${availabilityStyle.bgColor} ${availabilityStyle.textColor} px-6 py-3 rounded-full border ${availabilityStyle.borderColor} mb-8 text-lg font-semibold`}>
            <div className={`w-3 h-3 ${availabilityStyle.dotColor} rounded-full animate-pulse`}></div>
            <span>{t(`availability.${personalInfo.availabilityStatus}`)}</span>
          </div>

          {/* CTA Button */}
          <div className="pdf-buttons mb-16 flex justify-center">
            <EnhancedPDFButton className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 flex items-center gap-2">
              <FileDown size={18} />
              {language === 'fr' ? 'Télécharger CV' : 'Download CV'}
            </EnhancedPDFButton>
          </div>
        </div>
        )}

        {/* Content Grid - About & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* About Me Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 text-center">
              {t('sections.aboutMe')}
            </h2>
            <p className="text-neutral-800 leading-relaxed text-lg font-medium mb-8 text-center">
              {getCleanedDescription()}
            </p>
            
            {/* Passions */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 text-center">Passions</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {personalInfo.passions.map((passion, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200"
                  >
                    <span className="text-lg">
                      {passionIcons[passion as keyof typeof passionIcons] || '⭐'}
                    </span>
                    <span className="text-sm font-semibold text-gray-800">{passion}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h3 className="text-2xl font-bold text-neutral-900 mb-6 text-center">Contact</h3>
            <div className="space-y-4">
              {contactItems.map((item, index) => (
                item.href ? (
                  <a
                    key={index}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : '_self'}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer group"
                  >
                    <div className={`flex-shrink-0 w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center ${item.iconColor} shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900 mb-1 text-left">{item.label}</p>
                      <div className="text-primary-600 group-hover:text-primary-700 transition-colors duration-200 font-medium flex items-center gap-1 text-left">
                        <span className="break-all">{item.value}</span>
                        {item.href.startsWith('http') && (
                          <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </a>
                ) : (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <div className={`flex-shrink-0 w-14 h-14 ${item.bgColor} rounded-xl flex items-center justify-center ${item.iconColor} shadow-sm`}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900 mb-1 text-left">{item.label}</p>
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