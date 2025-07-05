import React from 'react';
import { ProjectCategory } from '../../../store/types';
import { getCategoryIcon } from '../../utils/projectUtils';
import { getCategoryAriaLabel } from '../../utils/accessibility';
import useAppStore from '../../../store/useAppStore';

const getCategoryColor = (category: string | undefined): { bgColor: string; textColor: string } => {
  switch (category) {
    case ProjectCategory.INFORMATICS:
      return { bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
    case ProjectCategory.GARDENING:
      return { bgColor: 'bg-green-100', textColor: 'text-green-700' };
    case ProjectCategory.WOOD:
      return { bgColor: 'bg-orange-100', textColor: 'text-orange-700' };
    case ProjectCategory.ELECTRONICS:
      return { bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' };
    default:
      return { bgColor: 'bg-secondary-100', textColor: 'text-neutral-700' };
  }
};

interface ProjectCategoriesProps {
  categories: string[];
}

export const ProjectCategories: React.FC<ProjectCategoriesProps> = ({ categories }) => {
  const { language } = useAppStore();
  
  if (categories.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      {categories.map((category, idx) => {
        const CategoryIcon = getCategoryIcon(category as ProjectCategory);
        const categoryColors = getCategoryColor(category);
        return CategoryIcon ? (
          <div 
            key={idx} 
            className={`p-2 rounded-lg ${categoryColors.bgColor} ${categoryColors.textColor}`}
            aria-label={getCategoryAriaLabel(category, language)}
            role="img"
            title={getCategoryAriaLabel(category, language)}
          >
            <CategoryIcon size={20} />
          </div>
        ) : null;
      })}
    </div>
  );
};