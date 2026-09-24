import React from 'react';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number; // For text variant
  animate?: boolean;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  className = '',
  lines = 1,
  animate = true
}) => {
  const baseClasses = `bg-secondary-200 ${animate ? 'animate-pulse' : ''} ${className}`;
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'rounded-sm';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded';
      case 'card':
        return 'rounded-lg';
      default:
        return 'rounded';
    }
  };

  const getStyle = () => ({
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  });

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...getStyle(),
              width: index === lines - 1 ? '75%' : '100%', // Last line is shorter
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()}`}
      style={getStyle()}
    />
  );
};

// Predefined skeleton components for common use cases
export const SkeletonProjectCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl shadow-card p-6 ${className}`}>
    {/* Status bar */}
    <div className="h-1 bg-secondary-200 rounded-full mb-4 animate-pulse" />
    
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <SkeletonLoader variant="circular" width={48} height={48} />
        <SkeletonLoader variant="circular" width={48} height={48} />
        <SkeletonLoader variant="text" width="80px" height="24px" />
      </div>
      <SkeletonLoader variant="text" width="60px" height="18px" />
    </div>

    {/* Title */}
    <SkeletonLoader variant="text" width="70%" height="1.5rem" className="mb-2" />
    
    {/* Date */}
    <SkeletonLoader variant="text" width="40%" height="1rem" className="mb-3" />

    {/* Description */}
    <SkeletonLoader variant="text" lines={2} className="mb-4" />
    
    {/* Technologies */}
    <div className="flex flex-wrap gap-2 mb-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <SkeletonLoader
          key={index}
          variant="text"
          width={`${60 + Math.random() * 40}px`}
          height="1.5rem"
          className="rounded-full"
        />
      ))}
    </div>

    {/* Image */}
    <SkeletonLoader variant="rectangular" width="100%" height="8rem" className="rounded-lg" />
  </div>
);

export const SkeletonHomeName: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`text-center mb-16 ${className}`}>
    {/* Profile Image */}
    <div className="relative inline-block mb-6">
      <div className="w-40 h-40 lg:w-48 lg:h-48 mx-auto rounded-full overflow-hidden shadow-2xl">
        <SkeletonLoader variant="circular" width="100%" height="100%" />
      </div>
    </div>

    {/* Name */}
    <div className="mb-4">
      <SkeletonLoader variant="text" width="400px" height="3rem" className="mx-auto lg:h-16" />
    </div>
    
    {/* Role Title */}
    <div className="mb-4">
      <SkeletonLoader variant="text" width="300px" height="2rem" className="mx-auto mb-6 lg:h-12" />
      
      {/* Technology Stack Badges */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 max-w-2xl mx-auto">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonLoader
            key={index}
            variant="text"
            width={`${60 + Math.random() * 40}px`}
            height="1.875rem"
            className="rounded-full"
          />
        ))}
      </div>
    </div>
    
    {/* Availability Status */}
    <SkeletonLoader variant="text" width="200px" height="3rem" className="mx-auto mb-8 rounded-full" />

    {/* CTA Button */}
    <SkeletonLoader variant="text" width="180px" height="3rem" className="mx-auto rounded-xl" />
  </div>
);