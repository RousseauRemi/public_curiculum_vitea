import { useState, useEffect, useCallback, useMemo } from 'react';
import useAppStore from '../../store/useAppStore';
import { useHTMLToPDF } from '../hooks/useHTMLToPDF';

const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  interface SectionProgress {
    id: string;
    progress: number;
    isActive: boolean;
    isCompleted: boolean;
    label: string;
    isDownload?: boolean;
  }
  
  const [, setSectionProgress] = useState<SectionProgress[]>([]);
  const { language } = useAppStore();
  useHTMLToPDF();

  // Navigation sections
  const sections = useMemo(() => [
    { id: 'home', label: 'Accueil' },
    { id: 'recommendations', label: 'Recommandations' },
    { id: 'experience', label: 'Expérience' },
    { id: 'skills', label: 'Compétences' },
    { id: 'education', label: 'Formation' },
    { id: 'projects', label: 'Projets' },
    { id: 'download-cv', label: language === 'fr' ? 'Télécharger CV' : 'Download CV', isDownload: true }
  ], [language]);


  const calculateProgress = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    
    if (documentHeight > 0) {
      const progress = Math.min((scrollTop / documentHeight) * 100, 100);
      setScrollProgress(progress);
    }

    // Calculate section progress
    const sectionsData = sections.map(section => {
      if (section.isDownload) {
        // Download button doesn't have scroll progress, always show as available
        return {
          ...section,
          progress: 100,
          isCompleted: false, // Don't show as completed (green) since it's not a section
          isActive: false
        };
      }
      
      const element = document.getElementById(section.id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = scrollTop + rect.top;
        const elementHeight = rect.height;
        
        let sectionProgress = 0;
        if (scrollTop >= elementTop - 100 && scrollTop < elementTop + elementHeight - 100) {
          sectionProgress = Math.min(((scrollTop - elementTop + windowHeight) / elementHeight) * 100, 100);
        } else if (scrollTop >= elementTop + elementHeight - 100) {
          sectionProgress = 100;
        }
        
        return {
          ...section,
          progress: Math.max(0, sectionProgress),
          isCompleted: sectionProgress >= 95,
          isActive: false
        };
      }
      return { ...section, progress: 0, isCompleted: false, isActive: false };
    });
    
    setSectionProgress(sectionsData);
  }, [sections]);

  useEffect(() => {
    calculateProgress();
    
    const handleScroll = () => {
      calculateProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateProgress);
    };
  }, [calculateProgress]);

  return (
    <div className="scroll-progress-bar">
      {/* Mobile Progress Bar - Top */}
      <div 
        className="desktop:hidden fixed top-0 left-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 transition-all duration-300 ease-out"
        style={{ 
          width: `${scrollProgress}%`,
          zIndex: 1000
        }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Page scroll progress: ${Math.round(scrollProgress)}%`}
      />


      {/* Desktop Progress Bar - Right Side */}
      <div 
        className="hidden desktop-1600-block fixed right-0 top-0 w-2 bg-gradient-to-b from-blue-500 via-indigo-600 to-purple-700 transition-all duration-300 ease-out"
        style={{ 
          height: `${scrollProgress}%`,
          zIndex: 1000
        }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Page scroll progress: ${Math.round(scrollProgress)}%`}
      />

      
    </div>
  );
};

export default ScrollProgressBar;