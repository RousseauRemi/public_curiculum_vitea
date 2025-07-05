import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import type { ProjetInterne } from '../../../store/types';
import useAppStore from '../../../store/useAppStore';
import { getStatusColor, getProjectName, getProjectStatus, getProjectDisplayDate, getAllTechnologies, getProjectCategories } from '../../utils/projectUtils';
import { getNavigationAriaLabel, KEYBOARD_KEYS } from '../../utils/accessibility';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { ProjectCategories } from './ProjectCategories';
import { ProjectTechnologies } from './ProjectTechnologies';
import { ProjectImages } from './ProjectImages';
import { ProjectPDFDetails } from './ProjectPDFDetails';

interface ProjectCardProps {
  project: ProjetInterne;
  index: number;
  isAnimated?: boolean;
  onSelect?: (project: ProjetInterne) => void;
}

export const ProjectCard = memo<ProjectCardProps>(({ project, index, isAnimated = false, onSelect }) => {
  const { language } = useAppStore();
  
  const status = useMemo(() => getProjectStatus(project), [project]);
  const technologies = useMemo(() => getAllTechnologies(project), [project]);
  const projectName = useMemo(() => getProjectName(project), [project]);
  const categories = useMemo(() => getProjectCategories(project), [project]);
  const statusColor = useMemo(() => getStatusColor('bg-primary-500'), []);
  const isExpandable = project.expandable !== false;

  const handleClick = () => {
    if (isExpandable && onSelect) {
      onSelect(project);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE) {
      event.preventDefault();
      handleClick();
    }
  };

  const cardContent = (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isExpandable ? 0 : -1}
      role={isExpandable ? 'button' : 'article'}
      aria-label={isExpandable ? getNavigationAriaLabel('open', `${projectName} project details`, language) : undefined}
      className={`project-card pdf-avoid-break bg-white rounded-xl shadow-card hover:shadow-professional transition-all duration-300 
        ${isExpandable ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2' : 'cursor-default'} overflow-hidden group border border-secondary-200`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <ProjectStatusBadge status={status} statusColor={statusColor} />
            <ProjectCategories categories={categories} />
          </div>
          <div className="flex items-center gap-2">
            {project.subProjects && project.subProjects.length > 1 && (
              <span className="text-xs bg-secondary-100 text-neutral-600 px-2 py-1 rounded-full">
                {project.subProjects.length} {language === 'fr' ? 'modules' : 'modules'}
              </span>
            )}
            {(isExpandable || (project.images && project.images.length > 0)) && (
              <div className="text-neutral-400 group-hover:text-primary-600 transition-colors print-hidden">
                <ExternalLink size={18} />
              </div>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-neutral-900 mb-2">{projectName}</h3>
        
        <div className="flex items-center gap-2 text-sm text-neutral-600 mb-3">
          <Calendar size={14} />
          <span>{getProjectDisplayDate(project)}</span>
        </div>

        <p className="text-neutral-700 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <ProjectPDFDetails project={project} />
        
        <ProjectTechnologies technologies={technologies} />

        <ProjectImages 
          project={project} 
          projectName={projectName}
          isHiddenInPDF={!!(project.subProjects && project.subProjects.length > 0)}
        />
      </div>
    </div>
  );

  if (isAnimated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return <div>{cardContent}</div>;
});