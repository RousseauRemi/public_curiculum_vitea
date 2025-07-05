/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      // Keep custom breakpoints that were already there
      'lg-plus': '1000px',
      'desktop': '1600px',
      'xl-wide': '1400px',
    },
    extend: {
      colors: {
        // Primary - Professional Blue
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Secondary - Sophisticated Slate
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Accent - Elegant Teal
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        // Success - Professional Green
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Warning - Professional Amber
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Error - Professional Red
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Neutral - Professional Grays
        neutral: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'professional': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hero': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'colored': '0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -2px rgba(59, 130, 246, 0.05)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #475569 0%, #334155 100%)',
        'gradient-accent': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
        'gradient-hero': 'linear-gradient(135deg, #2563eb 0%, #14b8a6 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-right': 'fadeInRight 0.6s ease-out',
        'pulse-subtle': 'pulse 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeInRight: {
          '0%': {
            opacity: '0',
            transform: 'translateX(-20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-primary-600',
    'bg-success-500',
    'border-primary-500',
    'border-success-500',
    // Project status badge colors (using standard Tailwind colors)
    'bg-teal-100', 'text-teal-800', 'border-teal-200', // En Réflexion
    'bg-blue-100', 'text-blue-800', 'border-blue-200', // Démarré
    'bg-yellow-100', 'text-yellow-800', 'border-yellow-200', // En Cours
    'bg-green-100', 'text-green-800', 'border-green-200', // Terminé
    'bg-gray-100', 'text-gray-800', 'border-gray-200', // Archivé
    // Technology background colors (light versions)
    'bg-purple-100', 'border-purple-200', // .NET
    'bg-red-100', 'border-red-200', // Angular
    'bg-blue-100', 'border-blue-200', // React, WPF
    'bg-green-100', 'border-green-200', // TypeScript
    'bg-yellow-100', 'border-yellow-200', // Python
    'bg-cyan-100', 'border-cyan-200', // Flutter
    'bg-indigo-100', 'border-indigo-200', // Databases
    'bg-amber-100', 'border-amber-200', // MCP, RabbitMQ
    'bg-gray-100', 'border-gray-200', // Fallback
  ]
}