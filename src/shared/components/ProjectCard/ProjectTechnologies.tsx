import React from 'react';
import TechChip from '../TechChip';
import { getTechnologyAriaLabel } from '../../utils/accessibility';
import useAppStore from '../../../store/useAppStore';

interface ProjectTechnologiesProps {
  technologies: string[];
  maxVisible?: number;
  isInternalProject?: boolean;
}

export const ProjectTechnologies: React.FC<ProjectTechnologiesProps> = ({
  technologies,
  maxVisible = 3,
  isInternalProject = false
}) => {
  const { language } = useAppStore();

  if (technologies.length === 0) return null;

  // For internal projects on mobile, show only 1 tag
  const mobileMaxVisible = isInternalProject ? 1 : maxVisible;
  const desktopMaxVisible = maxVisible;

  const renderChips = (max: number) => (
    <>
      {technologies.slice(0, max).map((tech, techIndex) => (
        <TechChip
          key={techIndex}
          technology={tech}
          className="mr-2 mb-2"
          title={getTechnologyAriaLabel(tech, language)}
        />
      ))}
      {technologies.length > max && (
        <span
          className="tech-chip mr-2 mb-2"
          aria-label={`${technologies.length - max} ${language === 'fr' ? 'technologies supplémentaires' : 'additional technologies'}`}
        >
          +{technologies.length - max}
        </span>
      )}
    </>
  );

  return (
    <div className="print-hidden flex flex-wrap mb-4 -mr-2 -mb-2">
      {/* Mobile view */}
      <div className="flex flex-wrap lg:hidden">
        {renderChips(mobileMaxVisible)}
      </div>

      {/* Desktop view */}
      <div className="hidden lg:flex lg:flex-wrap">
        {renderChips(desktopMaxVisible)}
      </div>
    </div>
  );
};
