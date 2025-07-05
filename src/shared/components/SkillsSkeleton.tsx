import React from 'react';

export const SkillBarSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-gray-200 rounded w-8"></div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full w-full"></div>
    </div>
  );
};

export const SkillsSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkillBarSkeleton key={index} />
      ))}
    </div>
  );
};

export const SkillChartSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="w-64 h-64 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
};