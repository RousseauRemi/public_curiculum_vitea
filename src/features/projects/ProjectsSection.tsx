import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../../shared/components/SectionWrapper';
import { ProjectFilters } from '../../shared/components/ProjectFilters';
import { ProjectGrid } from '../../shared/components/ProjectGrid';
import { ProjectModal } from '../../shared/components/ProjectModal';
import { SkeletonProjectCard } from '../../shared/components/SkeletonLoader';
import useAppStore from '../../store/useAppStore';
import { useTranslation } from '../../shared/hooks/useTranslation';
import { getProjectStatus, projectHasCategory } from '../../shared/utils/projectUtils';
import type { ProjetInterne } from '../../store/types';
import { ProjectCategory } from '../../store/types';

const ProjectsSection: React.FC = () => {
  const { language, getCVData } = useAppStore();
  const { t, isLoading: translationsLoading } = useTranslation(language);
  const { projetsInternes } = getCVData();
  
  // Loading state - show skeleton if translations are loading or data is not available
  const isLoading = translationsLoading || !projetsInternes;
  
  // State management
  const [selectedProject, setSelectedProject] = useState<ProjetInterne | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Number of projects shown before the "show all" button
  const FEATURED_COUNT = 6;

  // Memoized filtered and sorted projects (newest activity first)
  const filteredProjects = useMemo(() => {
    if (!projetsInternes) return [];

    return projetsInternes
      .filter(project => {
        const statusMatch = filter === 'all' || getProjectStatus(project) === filter;
        const categoryMatch = categoryFilter === 'all' || projectHasCategory(project, categoryFilter as ProjectCategory);
        return statusMatch && categoryMatch;
      })
      .sort((a, b) => {
        const dateA = a.sortDate ?? '';
        const dateB = b.sortDate ?? '';
        // "YYYY-MM" strings compare chronologically; missing dates sink to the end
        return dateA !== dateB ? dateB.localeCompare(dateA) : b.id - a.id;
      });
  }, [projetsInternes, filter, categoryFilter]);

  // Memoized callback handlers
  const handleFilterChange = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  const handleCategoryFilterChange = useCallback((newCategory: string) => {
    setCategoryFilter(newCategory);
  }, []);

  const handleProjectSelect = useCallback((project: ProjetInterne) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
    setSelectedImage(null);
  }, []);

  const handleModalClose = useCallback(() => {
    setSelectedProject(null);
    setCurrentImageIndex(0);
    setSelectedImage(null);
  }, []);

  const handleImageSelect = useCallback((image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  }, []);

  const handleImageNavigation = useCallback((direction: 'prev' | 'next') => {
    if (!selectedProject?.images) return;
    
    const totalImages = selectedProject.images.length;
    let newIndex = currentImageIndex;
    
    if (direction === 'prev') {
      newIndex = currentImageIndex === 0 ? totalImages - 1 : currentImageIndex - 1;
    } else {
      newIndex = currentImageIndex === totalImages - 1 ? 0 : currentImageIndex + 1;
    }
    
    setCurrentImageIndex(newIndex);
    const newImage = selectedProject.images[newIndex];
    setSelectedImage(typeof newImage === 'string' ? newImage : newImage.url);
  }, [currentImageIndex, selectedProject]);

  const handleImageClose = useCallback(() => {
    setSelectedImage(null);
  }, []);

  const projectsCount = filteredProjects.length;
  const visibleProjects = showAll ? filteredProjects : filteredProjects.slice(0, FEATURED_COUNT);
  const hiddenProjects = showAll ? [] : filteredProjects.slice(FEATURED_COUNT);

  return (
    <SectionWrapper
      id="projects"
      title={t('projects.title')}
      eyebrow={language === 'fr' ? 'Côté perso' : 'Side projects'}
      subtitle={t('projects.subtitle')}
      className="section-light"
    >
      <div className="print-hidden">
        <ProjectFilters
          filter={filter}
          categoryFilter={categoryFilter}
          onFilterChange={handleFilterChange}
          onCategoryFilterChange={handleCategoryFilterChange}
          language={language}
          projects={projetsInternes}
        />
      </div>

      {/* Projects count */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 print-hidden"
      >
        <p className="text-neutral-600 text-center">
          {projectsCount} {projectsCount === 1 ? t('projects.projectFound') : t('projects.projectsFound')}
        </p>
      </motion.div>

      {/* Projects Grid */}
      {isLoading ? (
        // Loading skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonProjectCard key={index} />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <>
          <ProjectGrid
            projects={visibleProjects}
            onProjectSelect={handleProjectSelect}
          />
          {/* Remaining projects still rendered for PDF export */}
          {hiddenProjects.length > 0 && (
            <div className="pdf-only">
              <div className="mt-6">
                <ProjectGrid
                  projects={hiddenProjects}
                  onProjectSelect={handleProjectSelect}
                />
              </div>
            </div>
          )}
          {hiddenProjects.length > 0 && (
            <div className="print-hidden flex justify-center mt-10">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 bg-white text-neutral-800 border border-secondary-200 hover:border-primary-300 hover:text-primary-600 font-semibold px-6 py-3 rounded-xl shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                {language === 'fr'
                  ? `Voir les ${hiddenProjects.length} autres projets`
                  : `Show ${hiddenProjects.length} more projects`}
              </button>
            </div>
          )}
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <p className="text-neutral-500 text-lg">{t('projects.noProjects')}</p>
        </motion.div>
      )}

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        selectedImage={selectedImage}
        onClose={handleModalClose}
        onImageSelect={handleImageSelect}
        onImageNavigation={handleImageNavigation}
        onImageClose={handleImageClose}
        language={language}
      />
    </SectionWrapper>
  );
};

export default ProjectsSection;