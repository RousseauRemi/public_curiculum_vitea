import React, { memo } from 'react';
import { getTechnologyDotColor } from '../utils/technologyColors';

interface TechChipProps {
  technology: string;
  className?: string;
  title?: string;
  /** Rich tooltip shown on hover (e.g. years of experience). Falls back to native `title` when absent. */
  tooltip?: string;
}

// Unified monochrome technology chip — neutral surface with a small
// family-colored dot, replacing the old rainbow gradient badges.
const TechChip: React.FC<TechChipProps> = memo(({ technology, className = '', title, tooltip }) => {
  const chip = (
    <span className={`tech-chip ${className}`} title={tooltip ? undefined : title}>
      <span className={`tech-chip-dot ${getTechnologyDotColor(technology)}`} />
      {technology}
    </span>
  );

  if (!tooltip) return chip;

  return (
    <span className="relative inline-flex group/chip">
      {chip}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[240px] rounded-lg bg-neutral-900 text-white text-xs font-normal leading-snug text-center px-3 py-2 opacity-0 group-hover/chip:opacity-100 transition-opacity duration-150 z-30 shadow-lg print-hidden"
      >
        {tooltip}
        <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-neutral-900" />
      </span>
    </span>
  );
});

TechChip.displayName = 'TechChip';

export default TechChip;
