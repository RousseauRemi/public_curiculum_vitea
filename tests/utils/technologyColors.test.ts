import { test, expect } from '@playwright/test';
import { 
  getTechnologyColor, 
  sortTechnologiesByPriority,
  getSkillTechnologyColor,
  getTechnologyColorShades
} from '../../src/shared/utils/technologyColors';

test.describe('Technology Colors Utils', () => {
  test.describe('getTechnologyColor', () => {
    test('should return correct colors for .NET technologies', () => {
      expect(getTechnologyColor('.net')).toBe('from-purple-500 to-purple-600');
      expect(getTechnologyColor('dotnet')).toBe('from-purple-500 to-purple-600');
      expect(getTechnologyColor('c#')).toBe('from-purple-500 to-purple-600');
      expect(getTechnologyColor('csharp')).toBe('from-purple-500 to-purple-600');
    });

    test('should return correct colors for Angular technologies', () => {
      expect(getTechnologyColor('angular')).toBe('from-red-500 to-red-600');
      expect(getTechnologyColor('angularjs')).toBe('from-red-500 to-red-600');
      expect(getTechnologyColor('rxjs')).toBe('from-red-500 to-red-600');
    });

    test('should return correct colors for React technologies', () => {
      expect(getTechnologyColor('react')).toBe('from-blue-500 to-blue-600');
      expect(getTechnologyColor('reactjs')).toBe('from-blue-500 to-blue-600');
      expect(getTechnologyColor('nextjs')).toBe('from-blue-500 to-blue-600');
      expect(getTechnologyColor('redux')).toBe('from-blue-500 to-blue-600');
    });

    test('should return correct colors for TypeScript/JavaScript', () => {
      expect(getTechnologyColor('typescript')).toBe('from-green-500 to-green-600');
      expect(getTechnologyColor('ts')).toBe('from-green-500 to-green-600');
      expect(getTechnologyColor('javascript')).toBe('from-amber-400 to-amber-500');
      expect(getTechnologyColor('js')).toBe('from-amber-400 to-amber-500');
    });

    test('should be case insensitive', () => {
      expect(getTechnologyColor('REACT')).toBe('from-blue-500 to-blue-600');
      expect(getTechnologyColor('React')).toBe('from-blue-500 to-blue-600');
      expect(getTechnologyColor('rEaCt')).toBe('from-blue-500 to-blue-600');
    });

    test('should handle partial matches', () => {
      expect(getTechnologyColor('some react framework')).toBe('from-blue-500 to-blue-600');
      expect(getTechnologyColor('angular cli')).toBe('from-red-500 to-red-600');
    });

    test('should return default color for unknown technologies', () => {
      expect(getTechnologyColor('unknown-tech')).toBe('from-gray-500 to-gray-600');
      expect(getTechnologyColor('random-framework')).toBe('from-gray-500 to-gray-600');
    });

    test('should handle empty or null input', () => {
      expect(getTechnologyColor('')).toBe('from-gray-500 to-gray-600');
      expect(getTechnologyColor('   ')).toBe('from-gray-500 to-gray-600');
    });
  });

  test.describe('sortTechnologiesByPriority', () => {
    test('should sort technologies by priority order', () => {
      const technologies = ['python', 'react', '.net', 'unknown', 'angular'];
      const sorted = sortTechnologiesByPriority(technologies);
      
      // Should be in priority order: dotnet, angular, react, typescript, python, java, javascript
      expect(sorted.indexOf('.net')).toBeLessThan(sorted.indexOf('angular'));
      expect(sorted.indexOf('angular')).toBeLessThan(sorted.indexOf('react'));
      expect(sorted.indexOf('react')).toBeLessThan(sorted.indexOf('python'));
    });

    test('should put unknown technologies at the end alphabetically', () => {
      const technologies = ['ztech', 'atech', 'react', 'btech'];
      const sorted = sortTechnologiesByPriority(technologies);
      
      expect(sorted[0]).toBe('react'); // Priority tech comes first
      expect(sorted[1]).toBe('atech'); // Unknown techs sorted alphabetically
      expect(sorted[2]).toBe('btech');
      expect(sorted[3]).toBe('ztech');
    });

    test('should not mutate original array', () => {
      const technologies = ['python', 'react', 'angular'];
      const original = [...technologies];
      sortTechnologiesByPriority(technologies);
      
      expect(technologies).toEqual(original);
    });

    test('should handle empty array', () => {
      expect(sortTechnologiesByPriority([])).toEqual([]);
    });
  });

  test.describe('getSkillTechnologyColor', () => {
    test('should return object with bg and border properties', () => {
      const result = getSkillTechnologyColor('react');
      expect(result).toHaveProperty('bg');
      expect(result).toHaveProperty('border');
      expect(typeof result.bg).toBe('string');
      expect(typeof result.border).toBe('string');
    });

    test('should return consistent colors for same technology', () => {
      const result1 = getSkillTechnologyColor('react');
      const result2 = getSkillTechnologyColor('react');
      expect(result1).toEqual(result2);
    });

    test('should work with different technologies', () => {
      const reactColors = getSkillTechnologyColor('react');
      const angularColors = getSkillTechnologyColor('angular');
      
      // Should return different colors for different technologies
      expect(reactColors.bg).not.toBe(angularColors.bg);
    });
  });

  test.describe('getTechnologyColorShades', () => {
    test('should extract color from gradient and return light versions', () => {
      const result = getTechnologyColorShades('from-blue-500 to-blue-600');
      expect(result.bg).toBe('bg-blue-100');
      expect(result.border).toBe('border-blue-200');
    });

    test('should handle different color gradients', () => {
      const result = getTechnologyColorShades('from-red-400 to-red-500');
      expect(result.bg).toBe('bg-red-100');
      expect(result.border).toBe('border-red-200');
    });

    test('should return default for invalid gradient', () => {
      const result = getTechnologyColorShades('invalid-gradient');
      expect(result.bg).toBe('bg-gray-200');
      expect(result.border).toBe('border-gray-300');
    });

    test('should handle empty string', () => {
      const result = getTechnologyColorShades('');
      expect(result.bg).toBe('bg-gray-200');
      expect(result.border).toBe('border-gray-300');
    });
  });
});