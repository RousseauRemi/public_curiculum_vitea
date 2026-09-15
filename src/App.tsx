import { useEffect } from 'react';
import { ErrorBoundary, SectionErrorBoundary } from './shared/components';
import { Navigation } from './shared/components/Navigation';
import ScrollToTop from './shared/components/ScrollToTop';
import HomeSection from './features/home/HomeSection';
import SkillsSection from './features/skills/SkillsSection';
import ExperienceSection from './features/experience/ExperienceSection';
import EducationSection from './features/education/EducationSection';
import ProjectsSection from './features/projects/ProjectsSection';
import RecommendationsSection from './features/recommendations/RecommendationsSection';
import ContactCTA from './features/contact/ContactCTA';
import useAppStore, { pathForLanguage } from './store/useAppStore';
import './App.css';
import './styles/theme.css';
import './styles/utilities.css';
import './styles/pdf.css';

function App() {
  const theme = useAppStore((state) => state.theme);
  const language = useAppStore((state) => state.language);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Keep the address, <html lang> and title in step with the language switch, so the page can be
  // reloaded or shared in the language being read (English at /, French at /fr/).
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = language === 'fr'
      ? 'Rémi Rousseau - Développeur .NET Fullstack (C#, Angular, React, Flutter)'
      : 'Rémi Rousseau - Full-Stack .NET Developer (C#, Angular, React, Flutter)';
    const path = pathForLanguage(language);
    if (window.location.pathname !== path) {
      // Keep the query string (utm_*, ref…) and the section anchor
      window.history.replaceState(null, '', path + window.location.search + window.location.hash);
    }
  }, [language]);

  return (
    <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
      <div className="min-h-screen bg-secondary-50 text-neutral-900 transition-colors duration-300">
        {/* Skip to main content link for accessibility */}
        <a 
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-[9999] focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>
        <ErrorBoundary fallback={<div className="p-4 text-center text-red-600">Navigation failed to load</div>}>
          <Navigation />
        </ErrorBoundary>
        
        
        {/* Main content area with proper spacing for navigation */}
        <main 
          id="main-content"
          role="main"
          className=""
          aria-label="Main content"
        >
          <div className="pt-16 lg:pt-20">
            <SectionErrorBoundary sectionName="Home">
              <HomeSection />
            </SectionErrorBoundary>

            <SectionErrorBoundary sectionName="Professional Experience">
              <ExperienceSection />
            </SectionErrorBoundary>

            <SectionErrorBoundary sectionName="Skills">
              <SkillsSection />
            </SectionErrorBoundary>

            <SectionErrorBoundary sectionName="Recommendations">
              <RecommendationsSection />
            </SectionErrorBoundary>

            <SectionErrorBoundary sectionName="Education">
              <EducationSection />
            </SectionErrorBoundary>

            <SectionErrorBoundary sectionName="Projects">
              <ProjectsSection />
            </SectionErrorBoundary>

            <SectionErrorBoundary sectionName="Contact">
              <ContactCTA />
            </SectionErrorBoundary>
          </div>
        </main>
        
        {/* Scroll to top button */}
        <ErrorBoundary fallback={null}>
          <ScrollToTop />
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
}

export default App;