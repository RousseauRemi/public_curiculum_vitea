# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Vite
- `npm run build` - Build the project (runs TypeScript check first: `tsc -b && vite build`)
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

### Quality Assurance
Always run linting after making changes: `npm run lint`

## Project Architecture

### Tech Stack
- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite 7.0
- **Styling**: Tailwind CSS 4.1 with custom professional theme
- **State Management**: Zustand with persistence
- **Internationalization**: react-i18next (French/English)
- **PDF Generation**: @react-pdf/renderer
- **Charts**: Recharts for skill visualization
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Project Structure
```
src/
├── features/           # Feature-based components (home, skills, experience, etc.)
├── shared/            # Shared components, hooks, and utilities
│   ├── components/    # Reusable UI components (Navigation, ScrollProgressBar, etc.)
│   ├── hooks/         # Custom hooks (useAnimationOnce, usePDFGeneration, etc.)
│   └── utils/         # Utility functions (technologyColors, etc.)
├── store/             # Zustand store and types
├── data/              # JSON data files (cv-data-fr.json, cv-data-en.json)
├── locales/           # i18n translation files
├── styles/            # Global styles and theme
└── assets/            # Static assets and images
```

### State Management
- Uses Zustand store (`src/store/useAppStore.ts`) with persistence
- Manages: language selection, active section tracking, mobile menu state, loading states
- CV data is dynamically loaded based on selected language
- Store persists language preference in localStorage

### Internationalization
- Supports French (default) and English
- CV data stored in separate JSON files (`cv-data-fr.json`, `cv-data-en.json`)
- UI translations in `src/locales/` directory
- Language state managed via Zustand store

### Styling Architecture
- **Professional theme system** with comprehensive color palette
- **Primary**: Professional blue (#2563eb)
- **Secondary**: Sophisticated slate for backgrounds
- **Accent**: Elegant teal for highlights
- Responsive design with `desktop:` breakpoint at 1200px
- Custom shadows, gradients, and animations defined in theme
- Refer to `THEME_GUIDE.md` for detailed styling patterns

### Component Patterns
- Feature-based organization with dedicated sections
- Section wrapper component for consistent layout
- Custom hooks for animations and PDF generation
- Responsive navigation with mobile menu support
- Scroll progress tracking and smooth scrolling

### Data Flow
1. CV data loaded from JSON files based on language
2. Zustand store provides global state management
3. Components consume data through store getters
4. Animations triggered via intersection observer hooks
5. PDF generation creates downloadable CV versions

### PDF Generation
- Uses `@react-pdf/renderer` for CV export
- Custom hook `usePDFGeneration` handles PDF creation
- Generates professional PDF version of CV content

### Performance Considerations
- Vite for fast development and optimized builds
- Lazy loading and code splitting ready
- Optimized images and assets
- Efficient re-renders through proper state management

### TypeScript Configuration
- Strict mode enabled with comprehensive linting rules
- Separate configs for app (`tsconfig.app.json`) and Node (`tsconfig.node.json`)
- ESLint with TypeScript rules and React-specific rules

## Development Notes

### Theme Implementation
- Professional color system implemented across all components
- Use predefined theme classes from `src/styles/theme.css`
- Follow patterns in `THEME_GUIDE.md` for consistency
- Responsive design follows mobile-first approach

### Adding New Features
1. Create feature directory under `src/features/`
2. Use existing patterns for data structure and state management
3. Follow theme guidelines for styling consistency
4. Add translations to both language files
5. Update navigation if needed

### Data Updates
- CV data stored in JSON format in `src/data/`
- Maintain parallel structure between French and English versions
- Update both files when adding new experiences, skills, or projects
- Images stored in `public/images/` directory