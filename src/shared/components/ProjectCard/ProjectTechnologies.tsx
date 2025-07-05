import React from 'react';
import { getTechnologyColor } from '../../utils/technologyColors';
import { getTechnologyAriaLabel } from '../../utils/accessibility';
import useAppStore from '../../../store/useAppStore';

interface ProjectTechnologiesProps {
  technologies: string[];
  maxVisible?: number;
}

export const ProjectTechnologies: React.FC<ProjectTechnologiesProps> = ({ 
  technologies, 
  maxVisible = 3 
}) => {
  const { language } = useAppStore();
  
  if (technologies.length === 0) return null;

  return (
    <div className="print-hidden flex flex-wrap mb-4 -mr-3 -mb-3">
      {technologies.slice(0, maxVisible).map((tech, techIndex) => (
        <span
          key={techIndex}
          className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getTechnologyColor(tech)} text-white mr-3 mb-3`}
          aria-label={getTechnologyAriaLabel(tech, language)}
          title={getTechnologyAriaLabel(tech, language)}
        >
          {tech}
        </span>
      ))}
      {technologies.length > maxVisible && (
        <span 
          className="px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 text-neutral-600 mr-3 mb-3"
          aria-label={`${technologies.length - maxVisible} ${language === 'fr' ? 'technologies supplémentaires' : 'additional technologies'}`}
        >
          +{technologies.length - maxVisible}
        </span>
      )}
    </div>
  );
};