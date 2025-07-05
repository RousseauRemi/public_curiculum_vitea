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
import './App.css';
import './styles/theme.css';
import './styles/utilities.css';
import './styles/pdf.css';

function App() {
  useEffect(() => {
    // Apply initial theme (if needed in the future)
  }, []);

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
            
            <SectionErrorBoundary sectionName="Recommendations">
              <RecommendationsSection />
            </SectionErrorBoundary>
            
            <SectionErrorBoundary sectionName="Professional Experience">
              <ExperienceSection />
            </SectionErrorBoundary>
            
            <SectionErrorBoundary sectionName="Skills">
              <SkillsSection />
            </SectionErrorBoundary>
            
            <SectionErrorBoundary sectionName="Education">
              <EducationSection />
            </SectionErrorBoundary>
            
            <SectionErrorBoundary sectionName="Projects">
              <ProjectsSection />
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