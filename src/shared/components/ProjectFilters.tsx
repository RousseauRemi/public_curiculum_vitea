import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Sprout, Hammer, Zap } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { ProjectState, ProjectCategory } from '../../store/types';
import { handleListNavigation } from '../utils/accessibility';

interface ProjectFiltersProps {
  filter: string;
  categoryFilter: string;
  onFilterChange: (filter: string) => void;
  onCategoryFilterChange: (category: string) => void;
  language: 'fr' | 'en';
}

export const ProjectFilters = memo<ProjectFiltersProps>(({ 
  filter, 
  categoryFilter, 
  onFilterChange, 
  onCategoryFilterChange, 
  language 
}) => {
  const { t } = useTranslation(language);
  const [focusedStatusIndex, setFocusedStatusIndex] = useState(-1);
  const [focusedCategoryIndex, setFocusedCategoryIndex] = useState(-1);

  const statusFilters = [
    { key: 'all', label: t('projects.filterAll'), color: 'bg-neutral-100 text-neutral-700' },
    { key: ProjectState.EN_REFLEXION, label: t('projects.states.enReflexion'), color: 'bg-accent-100 text-accent-700' },
    { key: ProjectState.DEMARRE, label: t('projects.states.demarre'), color: 'bg-primary-100 text-primary-700' },
    { key: ProjectState.EN_COURS, label: t('projects.states.enCours'), color: 'bg-warning-100 text-warning-700' },
    { key: ProjectState.TERMINE, label: t('projects.states.termine'), color: 'bg-success-100 text-success-700' },
    { key: ProjectState.ARCHIVE, label: t('projects.states.archive'), color: 'bg-secondary-100 text-secondary-700' },
  ];

  const categoryFilters = [
    { key: 'all', label: t('projects.categories.all'), icon: null, color: 'bg-neutral-100 text-neutral-700' },
    { key: ProjectCategory.INFORMATICS, label: t('projects.categories.informatics'), icon: Monitor, color: 'bg-blue-100 text-blue-700' },
    { key: ProjectCategory.GARDENING, label: t('projects.categories.gardening'), icon: Sprout, color: 'bg-green-100 text-green-700' },
    { key: ProjectCategory.WOOD, label: t('projects.categories.wood'), icon: Hammer, color: 'bg-orange-100 text-orange-700' },
    { key: ProjectCategory.ELECTRONICS, label: t('projects.categories.electronics'), icon: Zap, color: 'bg-yellow-100 text-yellow-700' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 space-y-6"
    >
      {/* Status Filter */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-3" id="status-filter-label">{t('projects.filterByStatus')}</h3>
        <div 
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="status-filter-label"
          onKeyDown={(e) => handleListNavigation(
            e.nativeEvent,
            focusedStatusIndex,
            statusFilters.length,
            setFocusedStatusIndex
          )}
        >
          {statusFilters.map((statusFilter, index) => (
            <button
              key={statusFilter.key}
              onClick={() => onFilterChange(statusFilter.key)}
              onFocus={() => setFocusedStatusIndex(index)}
              onBlur={() => setFocusedStatusIndex(-1)}
              aria-pressed={filter === statusFilter.key}
              aria-label={`${statusFilter.label} ${filter === statusFilter.key ? '(selected)' : ''}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                filter === statusFilter.key
                  ? `${statusFilter.color} ring-2 ring-offset-2 ring-primary-500`
                  : `${statusFilter.color} hover:opacity-80`
              }`}
            >
              {statusFilter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-3" id="category-filter-label">{t('projects.filterByCategory')}</h3>
        <div 
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="category-filter-label"
          onKeyDown={(e) => handleListNavigation(
            e.nativeEvent,
            focusedCategoryIndex,
            categoryFilters.length,
            setFocusedCategoryIndex
          )}
        >
          {categoryFilters.map((catFilter, index) => {
            const Icon = catFilter.icon;
            return (
              <button
                key={catFilter.key}
                onClick={() => onCategoryFilterChange(catFilter.key)}
                onFocus={() => setFocusedCategoryIndex(index)}
                onBlur={() => setFocusedCategoryIndex(-1)}
                aria-pressed={categoryFilter === catFilter.key}
                aria-label={`${catFilter.label} ${categoryFilter === catFilter.key ? '(selected)' : ''}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  categoryFilter === catFilter.key
                    ? `${catFilter.color} ring-2 ring-offset-2 ring-primary-500`
                    : `${catFilter.color} hover:opacity-80`
                }`}
              >
                {Icon && <Icon size={16} />}
                {catFilter.label}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
});