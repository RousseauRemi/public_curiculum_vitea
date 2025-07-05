// Technology color mapping for consistent styling across the application
// Grouped by color families to reduce redundancy

// Core color definitions by technology families
const colorFamilies: Record<string, string> = {
  dotnet: 'from-purple-500 to-purple-600',
  angular: 'from-red-500 to-red-600',
  react: 'from-blue-500 to-blue-600',
  typescript: 'from-green-500 to-green-600',
  python: 'from-yellow-500 to-yellow-600',
  java: 'from-orange-500 to-orange-600',
  javascript: 'from-amber-400 to-amber-500',
  css: 'from-blue-300 to-blue-400',
  html: 'from-orange-300 to-orange-400',
  vue: 'from-emerald-400 to-emerald-500',
  svelte: 'from-orange-400 to-orange-500',
  tailwind: 'from-teal-400 to-teal-500',
  bootstrap: 'from-purple-400 to-purple-500',
  sass: 'from-pink-400 to-pink-500',
  database: 'from-indigo-500 to-indigo-600',
  cloud: 'from-sky-500 to-sky-600',
  tools: 'from-gray-500 to-gray-600',
  testing: 'from-red-400 to-red-500',
  mobile: 'from-green-600 to-green-700',
  devops: 'from-slate-600 to-slate-700'
};

// Technology to color family mapping
const technologyMap: Record<string, string> = {
  // .NET Ecosystem
  '.net': 'dotnet',
  'dotnet': 'dotnet',
  'c#': 'dotnet',
  'csharp': 'dotnet',
  'asp.net': 'dotnet',
  'aspnet': 'dotnet',
  'asp': 'dotnet',
  'wpf': 'dotnet',
  'wcf': 'dotnet',
  'entity framework': 'dotnet',
  'entityframework': 'dotnet',
  'ef': 'dotnet',
  'winforms': 'dotnet',
  'blazor': 'dotnet',
  'xamarin': 'dotnet',
  'maui': 'dotnet',
  'xunit': 'dotnet',
  'nunit': 'dotnet',

  // Angular Ecosystem
  'angular': 'angular',
  'angularjs': 'angular',
  'rxjs': 'angular',
  'ngrx': 'angular',

  // React Ecosystem
  'react': 'react',
  'reactjs': 'react',
  'nextjs': 'react',
  'next.js': 'react',
  'redux': 'react',
  'gatsby': 'react',

  // TypeScript/JavaScript
  'typescript': 'typescript',
  'ts': 'typescript',
  'javascript': 'javascript',
  'js': 'javascript',
  'node.js': 'javascript',
  'nodejs': 'javascript',
  'npm': 'javascript',
  'yarn': 'javascript',
  'webpack': 'javascript',
  'vite': 'javascript',

  // Python Ecosystem
  'python': 'python',
  'django': 'python',
  'flask': 'python',
  'fastapi': 'python',
  'pandas': 'python',
  'numpy': 'python',
  'matplotlib': 'python',
  'scipy': 'python',
  'sklearn': 'python',

  // Java Ecosystem
  'java': 'java',
  'spring': 'java',
  'spring boot': 'java',
  'springboot': 'java',
  'hibernate': 'java',
  'maven': 'java',
  'gradle': 'java',

  // CSS & Styling
  'css': 'css',
  'html': 'html',
  'tailwind': 'tailwind',
  'tailwindcss': 'tailwind',
  'bootstrap': 'bootstrap',
  'sass': 'sass',
  'scss': 'sass',
  'less': 'sass',

  // Vue Ecosystem
  'vue': 'vue',
  'vuejs': 'vue',
  'nuxt': 'vue',

  // Other Frameworks
  'svelte': 'svelte',
  'sveltekit': 'svelte',

  // Databases
  'sql server': 'database',
  'sqlserver': 'database',
  'postgresql': 'database',
  'postgres': 'database',
  'mysql': 'database',
  'mongodb': 'database',
  'redis': 'database',
  'sqlite': 'database',
  'oracle': 'database',

  // Cloud & Infrastructure
  'azure': 'cloud',
  'aws': 'cloud',
  'google cloud': 'cloud',
  'gcp': 'cloud',
  'firebase': 'cloud',
  'heroku': 'cloud',
  'vercel': 'cloud',
  'netlify': 'cloud',

  // Testing
  'jest': 'testing',
  'cypress': 'testing',
  'selenium': 'testing',
  'mocha': 'testing',
  'chai': 'testing',
  'jasmine': 'testing',

  // Mobile
  'react native': 'mobile',
  'flutter': 'mobile',
  'swift': 'mobile',
  'kotlin': 'mobile',
  'ionic': 'mobile',

  // DevOps & Tools
  'docker': 'devops',
  'kubernetes': 'devops',
  'jenkins': 'devops',
  'github actions': 'devops',
  'git': 'tools',
  'github': 'tools',
  'gitlab': 'tools',
  'bitbucket': 'tools',
  'jira': 'tools',
  'confluence': 'tools'
};

/**
 * Get the appropriate color gradient for a technology
 * @param techName - The name of the technology
 * @returns Tailwind gradient class string
 */
export const getTechnologyColor = (techName: string): string => {
  const normalizedName = techName.toLowerCase().trim();
  
  // Check for exact matches first
  const family = technologyMap[normalizedName];
  if (family && colorFamilies[family]) {
    return colorFamilies[family];
  }
  
  // Check for partial matches
  for (const [key, familyName] of Object.entries(technologyMap)) {
    if (normalizedName.includes(key) && colorFamilies[familyName]) {
      return colorFamilies[familyName];
    }
  }
  
  // Default color for unknown technologies
  return colorFamilies.tools;
};

/**
 * Sort technologies by priority based on their color family
 */
export const sortTechnologiesByPriority = (technologies: string[]): string[] => {
  const priorityOrder = ['dotnet', 'angular', 'react', 'typescript', 'python', 'java', 'javascript'];
  
  return [...technologies].sort((a, b) => {
    const aFamily = technologyMap[a.toLowerCase()] || 'tools';
    const bFamily = technologyMap[b.toLowerCase()] || 'tools';
    
    const aPriority = priorityOrder.indexOf(aFamily);
    const bPriority = priorityOrder.indexOf(bFamily);
    
    // If both have priorities, sort by priority
    if (aPriority !== -1 && bPriority !== -1) {
      return aPriority - bPriority;
    }
    
    // Priority items come first
    if (aPriority !== -1) return -1;
    if (bPriority !== -1) return 1;
    
    // Otherwise alphabetical
    return a.localeCompare(b);
  });
};

/**
 * Get technology color for skills section with background and border colors
 */
export const getSkillTechnologyColor = (techName: string): { bg: string; border: string } => {
  const gradientColor = getTechnologyColor(techName);
  return getTechnologyColorShades(gradientColor);
};

/**
 * Convert technology gradient colors to light background and border colors
 */
export const getTechnologyColorShades = (gradientColor: string): { bg: string; border: string } => {
  // Extract the base color from gradient (e.g., "from-purple-500 to-purple-600" -> "purple")
  const colorMatch = gradientColor.match(/from-(\w+)-\d+/);
  if (!colorMatch) {
    return { bg: 'bg-gray-200', border: 'border-gray-300' };
  }
  
  const baseColor = colorMatch[1];
  
  // Return faded versions for backgrounds
  return {
    bg: `bg-${baseColor}-100`,
    border: `border-${baseColor}-200`
  };
};

/**
 * Get all available technology colors (for documentation/reference)
 */
export const getAllTechnologyColors = () => {
  return Object.entries(colorFamilies).map(([family, gradient]) => ({
    family,
    gradient,
    technologies: Object.entries(technologyMap)
      .filter(([, f]) => f === family)
      .map(([tech]) => tech)
  }));
};