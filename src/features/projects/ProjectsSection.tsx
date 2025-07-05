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

  // Status priority for sorting
  const statusPriority = useMemo((): Record<string, number> => ({
    enReflexion: 1,
    demarre: 2,
    enCours: 3,
    termine: 4,
    archive: 5
  }), []);

  // Memoized filtered and sorted projects
  const filteredProjects = useMemo(() => {
    if (!projetsInternes) return [];
    
    return projetsInternes
      .filter(project => {
        const statusMatch = filter === 'all' || getProjectStatus(project) === filter;
        const categoryMatch = categoryFilter === 'all' || projectHasCategory(project, categoryFilter as ProjectCategory);
        return statusMatch && categoryMatch;
      })
      .sort((a, b) => {
        const statusA = getProjectStatus(a);
        const statusB = getProjectStatus(b);
        const priorityA = statusPriority[statusA] || 999;
        const priorityB = statusPriority[statusB] || 999;
        return priorityA !== priorityB ? priorityA - priorityB : b.id - a.id;
      });
  }, [projetsInternes, filter, categoryFilter, statusPriority]);

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

  return (
    <SectionWrapper id="projects">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-neutral-900 mb-4"
        >
          {t('projects.title')}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-neutral-600 max-w-2xl mx-auto"
        >
          {t('projects.subtitle')}
        </motion.p>
      </div>

      <div className="print-hidden">
        <ProjectFilters
          filter={filter}
          categoryFilter={categoryFilter}
          onFilterChange={handleFilterChange}
          onCategoryFilterChange={handleCategoryFilterChange}
          language={language}
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
        <ProjectGrid
          projects={filteredProjects}
          onProjectSelect={handleProjectSelect}
        />
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