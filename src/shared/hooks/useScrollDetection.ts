import { useState, useEffect } from 'react';
import useAppStore from '../../store/useAppStore';

interface UseScrollDetectionReturn {
  isScrolled: boolean;
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

export const useScrollDetection = (): UseScrollDetectionReturn => {
  const { activeSection, setActiveSection, setMobileMenuOpen } = useAppStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = ['home', 'recommendations', 'experience', 'skills', 'education', 'projects'];
      let currentSection = 'home';
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Consider a section active if it's in the top half of the viewport
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = sectionId;
          }
        }
      }
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Run once on mount to set initial active section
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, setActiveSection]);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'download-cv') {
      // Handle CV download - this will be triggered by the EnhancedPDFButton component
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      // Close mobile menu first to avoid interference
      setMobileMenuOpen(false);
      
      // Small delay to ensure menu closes before scrolling
      setTimeout(() => {
        // Get navigation height for mobile offset
        const nav = document.querySelector('nav[aria-label="Mobile navigation"]');
        const navHeight = nav ? nav.getBoundingClientRect().height : 64;
        
        // Calculate the target position accounting for fixed navigation
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const targetPosition = elementPosition - navHeight - 20; // 20px extra padding
        
        // Scroll to position accounting for mobile navigation
        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });
        
        setActiveSection(sectionId);
      }, 100);
    } else {
      console.warn(`Element with id '${sectionId}' not found`);
    }
  };

  return {
    isScrolled,
    activeSection,
    scrollToSection
  };
};