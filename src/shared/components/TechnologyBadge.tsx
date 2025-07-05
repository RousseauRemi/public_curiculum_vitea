import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { getTechnologyColor } from '../utils/technologyColors';

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
  showIcon = false
}) => {
  const gradientColor = React.useMemo(() => getTechnologyColor(technology), [technology]);
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'outlined':
        return `border-2 bg-white text-gray-800 border-gray-400`;
      case 'minimal':
        return `bg-gray-100 text-gray-700 hover:bg-gray-200`;
      default:
        return `text-white shadow-md hover:shadow-lg`;
    }
  };
  
  const gradientClasses = variant === 'default' ? `bg-gradient-to-r ${gradientColor}` : '';

  const baseClasses = `
    inline-flex items-center gap-1.5 rounded-full font-medium 
    transition-all duration-200 transform hover:scale-105
    ${sizeClasses[size]} ${getVariantClasses()} ${gradientClasses} ${className}
  `;

  return (
    <motion.span
      className={baseClasses}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.3, 
        delay: animationDelay,
        type: "spring",
        stiffness: 150
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      {showIcon && (
        <span 
          className={`w-2 h-2 rounded-full ${variant === 'default' ? 'bg-white' : 'bg-gray-500'}`}
        />
      )}
      {technology}
    </motion.span>
  );
});

TechnologyBadge.displayName = 'TechnologyBadge';

export default TechnologyBadge;