import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useScrollDetection } from '../../hooks/useScrollDetection';
import useAppStore from '../../../store/useAppStore';
import { DesktopNavigation } from './DesktopNavigation';
import { MobileNavigation } from './MobileNavigation';
import type { NavigationItem } from './types';

export const Navigation: React.FC = () => {
  const { language, isMobileMenuOpen, setMobileMenuOpen } = useAppStore();
  const { t, isLoaded } = useTranslation(language);
  const { isScrolled, activeSection, scrollToSection } = useScrollDetection();
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Use translations directly - the useTranslation hook already handles loading states
  const getNavigationLabel = (key: string) => {
    return t(key);
  };

  // Unified navigation handler for both desktop and mobile
  const handleNavigation = async (sectionId: string, isMobile: boolean = false) => {
    // Don't navigate if already navigating
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    try {
      // Navigate to section
      scrollToSection(sectionId);
      
      // Auto-close mobile menu if it's open (with slight delay for better UX)
      if (isMobile && isMobileMenuOpen) {
        setTimeout(() => {
          setMobileMenuOpen(false);
        }, 300);
      }
      
      // Reset navigating state after scroll completes
      setTimeout(() => {
        setIsNavigating(false);
      }, 600);
    } catch (error) {
      console.error('Navigation error:', error);
      setIsNavigating(false);
    }
  };

  const navigationItems: NavigationItem[] = [
    { id: 'home', label: getNavigationLabel('navigation.home') },
    { id: 'recommendations', label: getNavigationLabel('navigation.recommendations') },
    { id: 'experience', label: getNavigationLabel('navigation.experience') },
    { id: 'skills', label: getNavigationLabel('navigation.skills') },
    { id: 'education', label: getNavigationLabel('navigation.education') },
    { id: 'projects', label: getNavigationLabel('navigation.projects') },
    { id: 'download-cv', label: language === 'fr' ? 'Télécharger CV' : 'Download CV', isDownload: true }
  ];

  return (
    <>
      <DesktopNavigation
        navigationItems={navigationItems}
        isScrolled={isScrolled}
        activeSection={activeSection}
        onNavigate={(sectionId) => handleNavigation(sectionId, false)}
        isLoading={!isLoaded}
        isNavigating={isNavigating}
      />
      <MobileNavigation
        navigationItems={navigationItems}
        activeSection={activeSection}
        onNavigate={(sectionId) => handleNavigation(sectionId, true)}
        isLoading={!isLoaded}
        isNavigating={isNavigating}
      />
    </>
  );
};