import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { getTechnologyDotColor } from '../utils/technologyColors';

interface TechnologyBadgeProps {
  technology: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'minimal';
  className?: string;
  animationDelay?: number;
  showIcon?: boolean;
}

const TechnologyBadge: React.FC<TechnologyBadgeProps> = memo(({
  technology,
  size = 'md',
  variant = 'default',
  className = '',
  animationDelay = 0,
  showIcon = true
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outlined':
        return 'border bg-white text-slate-700 border-slate-300';
      case 'minimal':
        return 'bg-slate-100 text-slate-700 hover:bg-slate-200';
      default:
        return 'tech-chip';
    }
  };

  const baseClasses = `
    inline-flex items-center gap-1.5 rounded-full font-medium
    transition-all duration-200
    ${sizeClasses[size]} ${getVariantClasses()} ${className}
  `;

  return (
    <motion.span
      className={baseClasses}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.25,
        delay: animationDelay
      }}
    >
      {showIcon && (
        <span className={`w-1.5 h-1.5 rounded-full ${getTechnologyDotColor(technology)}`} />
      )}
      {technology}
    </motion.span>
  );
});

TechnologyBadge.displayName = 'TechnologyBadge';

export default TechnologyBadge;
