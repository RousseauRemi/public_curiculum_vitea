import React, { memo, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Code2, 
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { getTechnologyColor, sortTechnologiesByPriority } from '../utils/technologyColors';
import { getProjectStatus, getProjectName, getAllTechnologies, getProjectDisplayDate } from '../utils/projectUtils';
import { getNavigationAriaLabel, getTechnologyAriaLabel, getImageAriaLabel, KEYBOARD_KEYS } from '../utils/accessibility';
import type { ProjetInterne } from '../../store/types';

interface ProjectModalProps {
  project: ProjetInterne | null;
  selectedImage: string | null;
  onClose: () => void;
  onImageSelect: (image: string, index: number) => void;
  onImageNavigation: (direction: 'prev' | 'next') => void;
  onImageClose: () => void;
  language: 'fr' | 'en';
}

export const ProjectModal = memo<ProjectModalProps>(({ 
  project, 
  selectedImage, 
  onClose, 
  onImageSelect, 
  onImageNavigation, 
  onImageClose, 
  language 
}) => {
  const { t } = useTranslation(language);

  // Safe key generation to avoid empty keys
  const generateSafeKey = (...parts: (string | number | null | undefined)[]): string => {
    return parts
      .map((part, index) => part?.toString().trim() || `fallback-${index}`)
      .filter(Boolean)
      .join('-');
  };

  const projectData = useMemo(() => {
    if (!project) return null;
    
    return {
      name: getProjectName(project),
      status: getProjectStatus(project),
      technologies: getAllTechnologies(project),
      displayDate: getProjectDisplayDate(project),
    };
  }, [project]);

  const handleImageClick = useCallback((image: string, index: number) => {
    onImageSelect(image, index);
  }, [onImageSelect]);

  const handleImageNavigation = useCallback((direction: 'prev' | 'next') => {
    onImageNavigation(direction);
  }, [onImageNavigation]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === KEYBOARD_KEYS.ESCAPE) {
      if (selectedImage) {
        onImageClose();
      } else {
        onClose();
      }
    } else if (e.key === KEYBOARD_KEYS.ARROW_LEFT) {
      handleImageNavigation('prev');
    } else if (e.key === KEYBOARD_KEYS.ARROW_RIGHT) {
      handleImageNavigation('next');
    }
  }, [selectedImage, onImageClose, onClose, handleImageNavigation]);

  // Focus management
  useEffect(() => {
    if (project) {
      const focusableElement = document.querySelector('[data-modal-close]') as HTMLElement;
      if (focusableElement) {
        focusableElement.focus();
      }
    }
  }, [project]);

  if (!project || !projectData) return null;

  return (
    <AnimatePresence key="project-modal">
      <motion.div
        key={generateSafeKey('modal', project.id, project.name)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <motion.div
          key={generateSafeKey('modal-content', project.id, project.name)}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">{projectData.name}</h2>
                <div className="flex items-center gap-2 text-neutral-600">
                  <Calendar size={16} />
                  <span>{projectData.displayDate}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                data-modal-close
                aria-label={getNavigationAriaLabel('close', 'project details modal', language)}
                className="text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg p-1"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">{t('projects.description')}</h3>
              <p className="text-neutral-700 leading-relaxed">{project.description}</p>
            </div>

            {/* Technologies */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-neutral-800 mb-3">{t('projects.technologies')}</h3>
              <div className="flex flex-wrap gap-2">
                {sortTechnologiesByPriority(projectData.technologies).filter(Boolean).map((tech, index) => (
                  <span
                    key={generateSafeKey('tech', tech, index)}
                    className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getTechnologyColor(tech)} text-white`}
                    aria-label={getTechnologyAriaLabel(tech, language)}
                    title={getTechnologyAriaLabel(tech, language)}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Sub-projects */}
            {project.subProjects && project.subProjects.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">
                  {t('projects.subProjects')} ({project.subProjects.length})
                </h3>
                <div className="space-y-4">
                  {project.subProjects.map((subProject, index) => (
                    <div key={generateSafeKey('subproject', subProject.id, subProject.name, index)} className="bg-secondary-50 rounded-lg p-4">
                      <h4 className="font-semibold text-neutral-800 mb-2">{subProject.name}</h4>
                      <p className="text-neutral-700 text-sm mb-3">{subProject.description}</p>
                      {subProject.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {subProject.technologies.filter(Boolean).map((tech, techIndex) => (
                            <span
                              key={generateSafeKey('subtech', subProject.id, subProject.name, tech, techIndex)}
                              className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTechnologyColor(tech)} text-white`}
                              aria-label={getTechnologyAriaLabel(tech, language)}
                              title={getTechnologyAriaLabel(tech, language)}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {project.images && project.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">{t('projects.images')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {project.images.map((image, index) => {
                    const imageUrl = typeof image === 'string' ? image : image.url;
                    const imageType = typeof image === 'string' ? 'web' : image.type || 'web';
                    return (
                      <div
                        key={generateSafeKey('image', project.id, project.name, imageUrl, index)}
                        className="relative group cursor-pointer bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
                        onClick={() => handleImageClick(imageUrl, index)}
                        onKeyDown={(e) => {
                          if (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.SPACE) {
                            e.preventDefault();
                            handleImageClick(imageUrl, index);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={getNavigationAriaLabel('open', getImageAriaLabel(projectData.name, imageType, language), language)}
                      >
                        <div className="aspect-video flex items-center justify-center p-2">
                          <img
                            src={imageUrl}
                            alt={getImageAriaLabel(projectData.name, imageType, language)}
                            className="max-w-full max-h-full object-contain rounded group-hover:opacity-75 transition-opacity"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                          <Code2 className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
                        </div>
                        {/* Image type indicator */}
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {imageType}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence key="image-modal">
        {selectedImage && (
          <motion.div
            key={generateSafeKey('image-modal', selectedImage)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-60"
            onClick={onImageClose}
          >
            <motion.div
              key={generateSafeKey('image-content', selectedImage)}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage}
                alt={getImageAriaLabel(projectData.name, 'web', language)}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Navigation buttons */}
              {project.images && project.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageNavigation('prev')}
                    aria-label={getNavigationAriaLabel('goto', 'previous image', language)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={() => handleImageNavigation('next')}
                    aria-label={getNavigationAriaLabel('goto', 'next image', language)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              
              {/* Close button */}
              <button
                onClick={onImageClose}
                aria-label={getNavigationAriaLabel('close', 'image viewer', language)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/50"
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
});