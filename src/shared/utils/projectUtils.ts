import type { ProjetInterne, ProjectCategory } from '../../store/types';
import { Monitor, Sprout, Hammer, Zap } from 'lucide-react';

/**
 * Project status color mapping
 */
export const statusColorMap: Record<string, string> = {
  accent: '#14b8a6',
  primary: '#2563eb',
  warning: '#f59e0b',
  success: '#059669',
  default: '#6b7280'
};

/**
 * Get the hex color for a project status
 * @param statusColor - The status color key (e.g., 'accent', 'primary')
 * @returns The hex color code
 */
export const getStatusColor = (statusColor: string): string => {
  const cleanColor = statusColor.replace('bg-', '').replace('-100', '');
  return statusColorMap[cleanColor] || statusColorMap.default;
};

/**
 * Get project name
 * @param project - The project object
 * @returns The project name
 */
export const getProjectName = (project: ProjetInterne): string => {
  return project.name || project.nomProjet || '';
};

/**
 * Get project status
 * @param project - The project object
 * @returns The project status
 */
export const getProjectStatus = (project: ProjetInterne): string => {
  return project.status || project.state || 'enCours';
};

/**
 * Get project display date
 * @param project - The project object
 * @returns The project display date
 */
export const getProjectDisplayDate = (project: ProjetInterne): string => {
  return project.startDate || project.dateDebut || '';
};

/**
 * Get project end date
 * @param project - The project object
 * @returns The project end date
 */
export const getProjectEndDate = (project: ProjetInterne): string => {
  return project.endDate || project.dateFin || '';
};

/**
 * Get all technologies from a project (including sub-projects and tools)
 * @param project - The project object
 * @returns Array of all technologies
 */
export const getAllTechnologies = (project: ProjetInterne): string[] => {
  // Collect technologies from sub-projects
  let allTechs: string[] = [];
  
  if (project.subProjects && project.subProjects.length > 0) {
    allTechs = project.subProjects.flatMap((sp) => sp.technologies || []);
  }
  
  // Add project-level technologies if available
  if (project.technologies && project.technologies.length > 0) {
    allTechs.push(...project.technologies);
  }
  
  // If no technologies found, use tools (outils) as fallback
  if (allTechs.length === 0 && project.outils && project.outils.length > 0) {
    allTechs = project.outils;
  }
  
  return [...new Set(allTechs)]; // Remove duplicates
};

/**
 * Project category icon mapping
 */
export const categoryIconMap = {
  informatics: Monitor,
  gardening: Sprout,
  wood: Hammer,
  electronics: Zap
} as const;

/**
 * Get the icon component for a project category
 * @param category - The project category
 * @returns The icon component
 */
export const getCategoryIcon = (category: ProjectCategory | undefined) => {
  if (!category) return null;
  return categoryIconMap[category] || null;
};

/**
 * Get project category from a project
 * @param project - The project object
 * @returns The project category
 */
export const getProjectCategory = (project: ProjetInterne): ProjectCategory | undefined => {
  if (project.categories && project.categories.length > 0) {
    return project.categories[0];
  }
  return project.category;
};

/**
 * Get all project categories from a project
 * @param project - The project object
 * @returns Array of project categories
 */
export const getProjectCategories = (project: ProjetInterne): ProjectCategory[] => {
  if (project.categories && project.categories.length > 0) {
    return project.categories;
  }
  return project.category ? [project.category] : [];
};

/**
 * Check if project has a specific category
 * @param project - The project object
 * @param category - The category to check for
 * @returns True if project has the category
 */
export const projectHasCategory = (project: ProjetInterne, category: ProjectCategory): boolean => {
  const categories = getProjectCategories(project);
  return categories.includes(category);
};

/**
 * Project category color mapping
 */
export const categoryColorMap: Record<ProjectCategory, { bgColor: string; textColor: string }> = {
  informatics: {
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800'
  },
  gardening: {
    bgColor: 'bg-green-100', 
    textColor: 'text-green-800'
  },
  wood: {
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800'
  },
  electronics: {
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800'
  }
};

/**
 * Get the color classes for a project category
 * @param category - The project category
 * @returns The color classes object
 */
export const getCategoryColor = (category: ProjectCategory | undefined) => {
  if (!category) return { bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
  return categoryColorMap[category] || { bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
};