import React from 'react';
import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useHTMLToPDF } from '../../hooks/useHTMLToPDF';
import useAppStore from '../../../store/useAppStore';
import { Language } from '../../../store/types';
import { SkeletonLoader } from '../SkeletonLoader';
import type { NavigationItem } from './types';

interface DesktopNavigationProps {
  navigationItems: NavigationItem[];
  isScrolled: boolean;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  isLoading?: boolean;
  isNavigating?: boolean;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  navigationItems,
  isScrolled,
  activeSection,
  onNavigate,
  isLoading = false,
  isNavigating = false
}) => {
  const { language, setLanguage } = useAppStore();
  const { t } = useTranslation(language);
  const { EnhancedPDFButton } = useHTMLToPDF();

  const toggleLanguage = () => {
    setLanguage(language === Language.FR ? Language.EN : Language.FR);
  };

  return (
    <motion.nav 
      role="navigation"
      aria-label="Main navigation"
      className={`hidden lg:flex fixed top-0 left-0 right-0 bg-white shadow-card z-50 border-b border-secondary-200 ${
        isScrolled ? 'shadow-professional' : ''
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="px-2 py-4 flex items-center justify-between w-full">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <motion.div 
            className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            RR
          </motion.div>
          <div>
            <h3 className="font-semibold text-primary">Rémi Rousseau</h3>
            <p className="text-xs text-secondary">Fullstack Developer</p>
          </div>
        </motion.div>
        
        <div className="flex items-center gap-2">
          {isLoading ? (
            // Show skeleton loaders for navigation items
            Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader
                key={index}
                variant="text"
                width={`${60 + Math.random() * 30}px`}
                height="2rem"
                className="rounded-lg"
              />
            ))
          ) : (
            navigationItems.map((item, index) => (
            item.isDownload ? (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <EnhancedPDFButton className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2">
                  <FileDown size={14} />
                  {item.label}
                </EnhancedPDFButton>
              </motion.div>
            ) : (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                disabled={isNavigating}
                aria-current={activeSection === item.id ? 'page' : undefined}
                aria-label={`Navigate to ${item.label} section`}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  activeSection === item.id
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-secondary hover:bg-secondary hover:text-primary'
                } ${isNavigating ? 'opacity-60 cursor-not-allowed' : ''}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 + index * 0.05 }}
                whileHover={{ 
                  scale: 1.05,
                  y: activeSection !== item.id ? -2 : 0
                }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            )
          ))
          )}
        </div>

        <div className="flex items-center">
          <motion.button
            onClick={toggleLanguage}
            aria-label={`Switch to ${language === Language.FR ? 'English' : 'French'}`}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:bg-secondary hover:text-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            title={t('navigation.languageToggle')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.3 }}
              className="text-lg"
            >
              {language === Language.FR ? '🇫🇷' : '🇺🇸'}
            </motion.div>
            {language.toUpperCase()}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};