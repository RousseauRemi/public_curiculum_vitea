import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  icon?: LucideIcon;
  color?: string;
  bgColor?: string;
  borderColor?: string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = memo(({
  status,
  icon: Icon,
  color = 'text-gray-600',
  bgColor = 'bg-gray-100',
  borderColor = 'border-gray-300',
  size = 'md',
  showPulse = false,
  className = '',
  children
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-2',
    lg: 'px-4 py-2 text-base gap-2'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 18
  };

  const baseClasses = `
    inline-flex items-center rounded-full font-semibold border
    transition-all duration-200 hover:shadow-md
    ${sizeClasses[size]} ${color} ${bgColor} ${borderColor} ${className}
  `;

  return (
    <motion.span
      className={baseClasses}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, type: "spring", stiffness: 150 }}
      whileHover={{ scale: 1.05 }}
    >
      {Icon && (
        <Icon 
          size={iconSizes[size]} 
          className={showPulse ? 'animate-pulse' : ''} 
        />
      )}
      {showPulse && !Icon && (
        <div 
          className={`w-2 h-2 rounded-full animate-pulse ${color.replace('text-', 'bg-')}`}
        />
      )}
      {children || status}
    </motion.span>
  );
});

StatusBadge.displayName = 'StatusBadge';

export default StatusBadge;