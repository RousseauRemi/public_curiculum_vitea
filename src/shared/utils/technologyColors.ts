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
  devops: 'from-slate-600 to-slate-700',
  ai: 'from-fuchsia-500 to-fuchsia-600'
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

  // AI / LLM
  'ai': 'ai',
  'a.i.': 'ai',
  'intelligence artificielle': 'ai',
  'llm': 'ai',
  'machine learning': 'ai',
  'genai': 'ai',
  'mcp': 'ai',
  'openai': 'ai',
  'ollama': 'ai',

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

// Subtle dot color per family — the only color hint kept on the monochrome chips.
// Literal class names so Tailwind's scanner picks them up.
const dotColors: Record<string, string> = {
  dotnet: 'bg-violet-400',
  angular: 'bg-rose-400',
  react: 'bg-sky-400',
  typescript: 'bg-blue-400',
  python: 'bg-amber-400',
  java: 'bg-orange-400',
  javascript: 'bg-yellow-400',
  css: 'bg-sky-300',
  html: 'bg-orange-300',
  vue: 'bg-emerald-400',
  svelte: 'bg-orange-400',
  tailwind: 'bg-teal-400',
  bootstrap: 'bg-violet-300',
  sass: 'bg-pink-400',
  database: 'bg-indigo-400',
  cloud: 'bg-cyan-400',
  tools: 'bg-slate-400',
  testing: 'bg-rose-300',
  mobile: 'bg-green-400',
  devops: 'bg-slate-500',
  ai: 'bg-fuchsia-400'
};

// Hex equivalents of dotColors for non-Tailwind consumers (PDF document)
const dotColorsHex: Record<string, string> = {
  dotnet: '#a78bfa',
  angular: '#fb7185',
  react: '#38bdf8',
  typescript: '#60a5fa',
  python: '#fbbf24',
  java: '#fb923c',
  javascript: '#facc15',
  css: '#7dd3fc',
  html: '#fdba74',
  vue: '#34d399',
  svelte: '#fb923c',
  tailwind: '#2dd4bf',
  bootstrap: '#c4b5fd',
  sass: '#f472b6',
  database: '#818cf8',
  cloud: '#22d3ee',
  tools: '#94a3b8',
  testing: '#fda4af',
  mobile: '#4ade80',
  devops: '#64748b',
  ai: '#e879f9'
};

// Tinted chip colors (bg-100 / text-700 shades) for non-Tailwind consumers (PDF document)
const chipColorsHex: Record<string, { bg: string; text: string }> = {
  dotnet: { bg: '#ede9fe', text: '#6d28d9' },
  angular: { bg: '#ffe4e6', text: '#be123c' },
  react: { bg: '#e0f2fe', text: '#0369a1' },
  typescript: { bg: '#dbeafe', text: '#1d4ed8' },
  python: { bg: '#fef3c7', text: '#b45309' },
  java: { bg: '#ffedd5', text: '#c2410c' },
  javascript: { bg: '#fef9c3', text: '#a16207' },
  css: { bg: '#e0f2fe', text: '#0369a1' },
  html: { bg: '#ffedd5', text: '#c2410c' },
  vue: { bg: '#d1fae5', text: '#047857' },
  svelte: { bg: '#ffedd5', text: '#c2410c' },
  tailwind: { bg: '#ccfbf1', text: '#0f766e' },
  bootstrap: { bg: '#ede9fe', text: '#6d28d9' },
  sass: { bg: '#fce7f3', text: '#be185d' },
  database: { bg: '#e0e7ff', text: '#4338ca' },
  cloud: { bg: '#cffafe', text: '#0e7490' },
  tools: { bg: '#f1f5f9', text: '#475569' },
  testing: { bg: '#ffe4e6', text: '#be123c' },
  mobile: { bg: '#dcfce7', text: '#15803d' },
  devops: { bg: '#e2e8f0', text: '#334155' },
  ai: { bg: '#fae8ff', text: '#a21caf' }
};

const resolveFamily = (techName: string): string => {
  const normalizedName = techName.toLowerCase().trim();
  if (technologyMap[normalizedName]) {
    return technologyMap[normalizedName];
  }
  for (const [key, familyName] of Object.entries(technologyMap)) {
    if (normalizedName.includes(key)) {
      return familyName;
    }
  }
  return 'tools';
};

/**
 * Get the dot color class for a technology (used by the unified tech chips)
 */
export const getTechnologyDotColor = (techName: string): string => {
  return dotColors[resolveFamily(techName)] || dotColors.tools;
};

/**
 * Get the dot color as a hex value (for the PDF document, which can't use Tailwind classes)
 */
export const getTechnologyDotHex = (techName: string): string => {
  return dotColorsHex[resolveFamily(techName)] || dotColorsHex.tools;
};

/**
 * Get tinted chip colors (background + text) as hex values (for the PDF document)
 */
export const getTechnologyChipHex = (techName: string): { bg: string; text: string } => {
  return chipColorsHex[resolveFamily(techName)] || chipColorsHex.tools;
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