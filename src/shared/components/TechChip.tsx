import React, { memo } from 'react';
import { getTechnologyDotColor } from '../utils/technologyColors';

interface TechChipProps {
  technology: string;
  className?: string;
  title?: string;
}

// Unified monochrome technology chip — neutral surface with a small
// family-colored dot, replacing the old rainbow gradient badges.
const TechChip: React.FC<TechChipProps> = memo(({ technology, className = '', title }) => (
  <span className={`tech-chip ${className}`} title={title}>
    <span className={`tech-chip-dot ${getTechnologyDotColor(technology)}`} />
    {technology}
  </span>
));

TechChip.displayName = 'TechChip';

export default TechChip;
