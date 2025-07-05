import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  animation?: boolean;
  animationDelay?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const variantClasses = {
  default: 'bg-white shadow-md border border-gray-100',
  elevated: 'bg-white shadow-lg border border-gray-100',
  outlined: 'bg-white border-2 border-gray-200 shadow-sm',
  glass: 'bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg'
};

const sizeClasses = {
  sm: 'p-4 rounded-lg',
  md: 'p-6 rounded-xl',
  lg: 'p-8 rounded-2xl'
};

const Card: React.FC<CardProps> = memo(({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  hover = true,
  animation = true,
  animationDelay = 0,
  onClick,
  style
}) => {

  const baseClasses = useMemo(() => {
    const hoverClasses = hover && !onClick 
      ? 'hover:shadow-xl hover:-translate-y-1' 
      : hover && onClick 
      ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
      : onClick 
      ? 'cursor-pointer' 
      : '';

    return `
      transition-all duration-300 
      ${variantClasses[variant]} 
      ${sizeClasses[size]} 
      ${hoverClasses}
      ${className}
    `;
  }, [variant, size, hover, onClick, className]);

  const cardContent = (
    <div className={baseClasses} onClick={onClick} style={style}>
      {children}
    </div>
  );

  if (!animation) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: animationDelay,
        ease: "easeOut"
      }}
      whileHover={hover ? { 
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 }
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {cardContent}
    </motion.div>
  );
});

Card.displayName = 'Card';

export default Card;