import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, FileDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useHTMLToPDF } from '../../hooks/useHTMLToPDF';
import useAppStore from '../../../store/useAppStore';
import { Language } from '../../../store/types';
import { SkeletonLoader } from '../SkeletonLoader';
import type { NavigationItem } from './types';

interface MobileNavigationProps {
  navigationItems: NavigationItem[];
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isLoading?: boolean;
  isNavigating?: boolean;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  navigationItems,
  activeSection,
  onNavigate,
  isLoading = false,
  isNavigating = false
}) => {
  const { language, isMobileMenuOpen, setLanguage, setMobileMenuOpen } = useAppStore();
  const { t } = useTranslation(language);
  const { EnhancedPDFButton } = useHTMLToPDF();
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  const toggleLanguage = () => {
    setLanguage(language === Language.FR ? Language.EN : Language.FR);
  };

  // Enhanced mobile navigation handler with focus management
  const handleMobileNavigation = (sectionId: string) => {
    onNavigate(sectionId);
    
    // Return focus to menu button after navigation
    setTimeout(() => {
      if (menuButtonRef.current) {
        menuButtonRef.current.focus();
      }
    }, 400);
  };

  // Handle escape key to close menu
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setMobileMenuOpen(false);
        // Return focus to menu button
        setTimeout(() => {
          if (menuButtonRef.current) {
            menuButtonRef.current.focus();
          }
        }, 100);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, setMobileMenuOpen]);

  return (
    <>
      <motion.nav 
        role="navigation"
        aria-label="Mobile navigation"
        className="flex lg:hidden fixed top-0 left-0 right-0 bg-white shadow-card z-50 border-b border-secondary-200"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex items-center justify-between p-4 w-full">
          {/* Left side - Name and logo */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <motion.div 
              className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              RR
            </motion.div>
            <span className="font-semibold text-primary">Rémi Rousseau</span>
          </motion.div>
          
          {/* Right side - Language toggle and menu button */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            <motion.button
              onClick={toggleLanguage}
              aria-label={`Switch to ${language === Language.FR ? 'English' : 'French'}`}
              className="p-2 rounded-lg text-secondary hover:bg-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              title={t('navigation.languageToggle')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                className="text-xl"
              >
                {language === Language.FR ? '🇫🇷' : '🇺🇸'}
              </motion.div>
            </motion.button>
            
            <motion.button
              ref={menuButtonRef}
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className="p-2 rounded-lg text-secondary hover:bg-secondary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </motion.div>
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="absolute top-full left-0 right-0 bg-white shadow-card border-t border-secondary-200 z-50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="p-4">
                <ul className="space-y-2">
                  {isLoading ? (
                    // Show skeleton loaders for mobile navigation items
                    Array.from({ length: 6 }).map((_, index) => (
                      <li key={index}>
                        <SkeletonLoader
                          variant="text"
                          width="100%"
                          height="3rem"
                          className="rounded-lg"
                        />
                      </li>
                    ))
                  ) : (
                    navigationItems.map((item, index) => (
                    <motion.li 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      {item.isDownload ? (
                        <motion.div
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <EnhancedPDFButton className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                            <FileDown size={16} />
                            {item.label}
                          </EnhancedPDFButton>
                        </motion.div>
                      ) : (
                        <motion.button
                          onClick={() => handleMobileNavigation(item.id)}
                          disabled={isNavigating}
                          aria-current={activeSection === item.id ? 'page' : undefined}
                          aria-label={`Navigate to ${item.label} section`}
                          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            activeSection === item.id
                              ? 'bg-green-500 text-white'
                              : 'text-secondary hover:bg-secondary hover:text-primary'
                          } ${isNavigating ? 'opacity-60 cursor-not-allowed' : ''}`}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {item.label}
                        </motion.button>
                      )}
                    </motion.li>
                  ))
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile menu backdrop */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="block lg:hidden fixed inset-0 bg-black bg-opacity-30 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};