import { memo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ProjectCard } from './ProjectCard';
import { useAnimationOnce } from '../hooks/useAnimationOnce';
import { handleListNavigation } from '../utils/accessibility';
import type { ProjetInterne } from '../../store/types';

interface ProjectGridProps {
  projects: ProjetInterne[];
  onProjectSelect: (project: ProjetInterne) => void;
}

export const ProjectGrid = memo<ProjectGridProps>(({ projects, onProjectSelect }) => {
  const { ref, shouldAnimate } = useAnimationOnce('project-grid');
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (focusedIndex === -1) return;
    
    const handled = handleListNavigation(
      event.nativeEvent,
      focusedIndex,
      projects.length,
      setFocusedIndex,
      3 // items per row on desktop
    );
    
    if (handled) {
      // Focus the new element
      const newFocusedElement = document.querySelector(`[data-project-index="${focusedIndex}"]`) as HTMLElement;
      if (newFocusedElement) {
        newFocusedElement.focus();
      }
    }
  }, [focusedIndex, projects.length]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 desktop:grid-cols-3 gap-6"
      onKeyDown={handleKeyDown}
      role="grid"
      aria-label="Projects grid"
    >
      {projects.map((project, index) => (
        <div 
          key={project.id}
          data-project-index={index}
          role="gridcell"
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(-1)}
        >
          <ProjectCard
            project={project}
            index={index}
            isAnimated={shouldAnimate}
            onSelect={onProjectSelect}
          />
        </div>
      ))}
    </motion.div>
  );
});