import { test, expect } from '@playwright/test';
import { 
  getProjectName, 
  getProjectStatus, 
  getProjectDisplayDate, 
  getProjectEndDate,
  getAllTechnologies,
  getProjectCategories,
  projectHasCategory,
  getStatusColor
} from '../../src/shared/utils/projectUtils';
import { ProjectCategory, ProjectState } from '../../src/store/types';
import type { ProjetInterne } from '../../src/store/types';

// Mock project data for testing
const mockProject: ProjetInterne = {
  id: 1,
  name: 'Test Project',
  startDate: '2023-01-01',
  endDate: '2023-12-31',
  status: ProjectState.EN_COURS,
  description: 'Test project description',
  category: ProjectCategory.INFORMATICS,
  expandable: true,
  subProjects: [
    {
      id: 1,
      name: 'Sub Project 1',
      startDate: '2023-01-01',
      endDate: '2023-06-30',
      description: 'First sub project',
      technologies: ['React', 'TypeScript'],
      tools: ['Git', 'VSCode'],
      updates: [
        { date: '2023-01-01', description: 'Project started' }
      ]
    },
    {
      id: 2,
      name: 'Sub Project 2', 
      startDate: '2023-07-01',
      endDate: null,
      description: 'Second sub project',
      technologies: ['Node.js', 'Express'],
      tools: ['Docker'],
      updates: []
    }
  ]
};

test.describe('Project Utils', () => {
  test.describe('getProjectName', () => {
    test('should return project name', () => {
      expect(getProjectName(mockProject)).toBe('Test Project');
    });

    test('should return empty string for project without name', () => {
      const project = { ...mockProject, name: '' };
      expect(getProjectName(project)).toBe('');
    });
  });

  test.describe('getProjectStatus', () => {
    test('should return project status', () => {
      expect(getProjectStatus(mockProject)).toBe(ProjectState.EN_COURS);
    });

    test('should return different status', () => {
      const project = { ...mockProject, status: ProjectState.TERMINE };
      expect(getProjectStatus(project)).toBe(ProjectState.TERMINE);
    });
  });

  test.describe('getProjectDisplayDate', () => {
    test('should return start date', () => {
      expect(getProjectDisplayDate(mockProject)).toBe('2023-01-01');
    });

    test('should return different start date', () => {
      const project = { ...mockProject, startDate: '2024-01-01' };
      expect(getProjectDisplayDate(project)).toBe('2024-01-01');
    });
  });

  test.describe('getProjectEndDate', () => {
    test('should return end date', () => {
      expect(getProjectEndDate(mockProject)).toBe('2023-12-31');
    });

    test('should return empty string for null end date', () => {
      const project = { ...mockProject, endDate: null };
      expect(getProjectEndDate(project)).toBe('');
    });
  });

  test.describe('getAllTechnologies', () => {
    test('should return technologies from sub-projects', () => {
      const technologies = getAllTechnologies(mockProject);
      expect(technologies).toContain('React');
      expect(technologies).toContain('TypeScript');
      expect(technologies).toContain('Node.js');
      expect(technologies).toContain('Express');
      expect(technologies.length).toBe(4);
    });

    test('should return unique technologies only', () => {
      const projectWithDuplicates = {
        ...mockProject,
        subProjects: [
          {
            id: 1,
            name: 'Sub 1',
            startDate: '2023-01-01',
            endDate: null,
            description: 'Test',
            technologies: ['React', 'TypeScript'],
            tools: [],
            updates: []
          },
          {
            id: 2,
            name: 'Sub 2',
            startDate: '2023-01-01', 
            endDate: null,
            description: 'Test',
            technologies: ['React', 'Node.js'], // React is duplicate
            tools: [],
            updates: []
          }
        ]
      };
      
      const technologies = getAllTechnologies(projectWithDuplicates);
      expect(technologies).toContain('React');
      expect(technologies).toContain('TypeScript');
      expect(technologies).toContain('Node.js');
      expect(technologies.length).toBe(3); // Should remove duplicate React
    });

    test('should return empty array for project without sub-projects', () => {
      const project = { ...mockProject, subProjects: [] };
      expect(getAllTechnologies(project)).toEqual([]);
    });

    test('should return empty array for project with undefined sub-projects', () => {
      const project = { ...mockProject, subProjects: undefined };
      expect(getAllTechnologies(project)).toEqual([]);
    });
  });

  test.describe('getProjectCategories', () => {
    test('should return categories array when present', () => {
      const project = { 
        ...mockProject, 
        categories: [ProjectCategory.INFORMATICS, ProjectCategory.ELECTRONICS] 
      };
      const categories = getProjectCategories(project);
      expect(categories).toContain(ProjectCategory.INFORMATICS);
      expect(categories).toContain(ProjectCategory.ELECTRONICS);
      expect(categories.length).toBe(2);
    });

    test('should fallback to single category', () => {
      const categories = getProjectCategories(mockProject);
      expect(categories).toContain(ProjectCategory.INFORMATICS);
      expect(categories.length).toBe(1);
    });

    test('should return empty array when no categories', () => {
      const project = { ...mockProject, category: undefined, categories: undefined };
      expect(getProjectCategories(project)).toEqual([]);
    });
  });

  test.describe('projectHasCategory', () => {
    test('should return true when project has category', () => {
      expect(projectHasCategory(mockProject, ProjectCategory.INFORMATICS)).toBe(true);
    });

    test('should return false when project does not have category', () => {
      expect(projectHasCategory(mockProject, ProjectCategory.GARDENING)).toBe(false);
    });

    test('should work with multiple categories', () => {
      const project = {
        ...mockProject,
        categories: [ProjectCategory.INFORMATICS, ProjectCategory.ELECTRONICS]
      };
      expect(projectHasCategory(project, ProjectCategory.INFORMATICS)).toBe(true);
      expect(projectHasCategory(project, ProjectCategory.ELECTRONICS)).toBe(true);
      expect(projectHasCategory(project, ProjectCategory.GARDENING)).toBe(false);
    });
  });

  test.describe('getStatusColor', () => {
    test('should return correct color for known status', () => {
      expect(getStatusColor('primary')).toBe('#2563eb');
      expect(getStatusColor('accent')).toBe('#14b8a6');
      expect(getStatusColor('success')).toBe('#059669');
      expect(getStatusColor('warning')).toBe('#f59e0b');
    });

    test('should return default color for unknown status', () => {
      expect(getStatusColor('unknown')).toBe('#6b7280');
    });

    test('should handle bg- prefix', () => {
      expect(getStatusColor('bg-primary')).toBe('#2563eb');
      expect(getStatusColor('bg-primary-100')).toBe('#2563eb');
    });
  });
});