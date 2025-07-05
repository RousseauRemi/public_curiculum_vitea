# Professional CV Theme Design System

This document outlines the complete design system for the professional CV website, ensuring consistent styling across all components.

## 🎨 Color Palette

### Primary Colors (Professional Blue)
- **Use for**: Main brand elements, CTAs, active states, primary buttons
- **Classes**: `bg-primary-{50-950}`, `text-primary-{50-950}`, `border-primary-{50-950}`
- **Primary Brand**: `primary-600` (#2563eb)

### Secondary Colors (Sophisticated Slate) 
- **Use for**: Text, backgrounds, subtle elements
- **Classes**: `bg-secondary-{50-950}`, `text-secondary-{50-950}`, `border-secondary-{50-950}`
- **Main Background**: `secondary-50` (#f8fafc)

### Accent Colors (Elegant Teal)
- **Use for**: Highlights, success states, special call-outs
- **Classes**: `bg-accent-{50-950}`, `text-accent-{50-950}`, `border-accent-{50-950}`
- **Accent Brand**: `accent-500` (#14b8a6)

### Status Colors
- **Success**: `success-{50-900}` - Green tones for positive actions
- **Warning**: `warning-{50-900}` - Amber tones for caution states  
- **Error**: `error-{50-900}` - Red tones for error states

### Neutral Colors
- **Use for**: General text, borders, backgrounds
- **Classes**: `bg-neutral-{50-950}`, `text-neutral-{50-950}`, `border-neutral-{50-950}`

## 🚀 Component Patterns

### Cards & Containers
```jsx
// Professional card with hover effects
<div className="card-professional hover:shadow-professional">
  <div className="bg-gradient-card p-6 rounded-xl border border-secondary-200">
    Content here
  </div>
</div>

// Alternative using Tailwind classes
<div className="bg-white p-6 rounded-xl shadow-card hover:shadow-professional transition-all duration-300 border border-secondary-200">
  Content here
</div>
```

### Buttons
```jsx
// Primary button
<button className="btn-primary">
  Primary Action
</button>

// Secondary button  
<button className="btn-secondary">
  Secondary Action
</button>

// Custom button with theme
<button className="bg-gradient-primary text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
  Custom Button
</button>
```

### Section Headers
```jsx
// Professional section header with underline
<h2 className="section-header">
  Section Title
</h2>

// Alternative custom header
<h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center relative">
  Section Title
  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-primary rounded-full"></div>
</h2>
```

### Badges & Tags
```jsx
// Professional badge
<span className="badge-professional">
  Professional Badge
</span>

// Success badge
<span className="badge-success">
  Success State
</span>

// Custom badge
<span className="bg-gradient-primary text-white px-3 py-1 rounded-full text-sm font-medium">
  Custom Badge
</span>
```

### Text Hierarchy
```jsx
// Primary text (headings, important content)
<h1 className="text-4xl font-bold text-neutral-900">Main Heading</h1>
<h2 className="text-3xl font-bold text-neutral-900">Section Heading</h2>
<h3 className="text-xl font-semibold text-neutral-800">Subsection</h3>

// Secondary text (descriptions, metadata)
<p className="text-secondary-600">Secondary information</p>
<p className="text-neutral-600">General description text</p>

// Muted text (labels, captions)
<span className="text-neutral-500 text-sm">Label or caption</span>

// Accent text (links, highlights)
<a className="text-primary-600 hover:text-primary-700">Link text</a>
```

### Backgrounds & Sections
```jsx
// Main content background
<section className="bg-secondary-50 py-16">
  
// Card/container background
<div className="bg-white">

// Alternate section background
<section className="bg-white py-16">

// Hero/special sections
<section className="bg-gradient-hero text-white py-20">
```

## 🎭 Animations & Interactions

### CSS Classes Available
```css
.animate-fade-in-up     /* Fade in from bottom */
.animate-fade-in-right  /* Fade in from left */
.animate-pulse-subtle   /* Gentle pulsing */

.transition-colors      /* Color transitions */
.transition-transform   /* Transform transitions */
.transition-all         /* All property transitions */
```

### Hover Effects
```jsx
// Card hover
<div className="hover:shadow-professional hover:-translate-y-1 transition-all duration-300">

// Button hover
<button className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">

// Scale hover
<div className="hover:scale-105 transition-transform duration-300">
```

## 🔧 Professional Components

### Timeline Elements
```jsx
// Timeline dot
<div className="timeline-dot"></div>

// Timeline line
<div className="timeline-line h-full"></div>

// Custom timeline
<div className="w-3 h-3 bg-gradient-primary rounded-full border-2 border-white shadow-md"></div>
```

### Progress Bars
```jsx
// Skill progress bar
<div className="skill-progress">
  <div className="skill-progress-fill" style={{width: '80%'}}></div>
</div>

// Custom progress
<div className="w-full bg-secondary-200 rounded-full h-2">
  <div className="bg-gradient-primary h-2 rounded-full transition-all duration-1000" style={{width: '80%'}}></div>
</div>
```

### Status Indicators
```jsx
// Success indicator
<div className="flex items-center gap-2 text-success-600">
  <CheckIcon className="w-4 h-4" />
  <span>Completed</span>
</div>

// Warning indicator  
<div className="flex items-center gap-2 text-warning-600">
  <WarningIcon className="w-4 h-4" />
  <span>In Progress</span>
</div>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `<1200px` (default)
- **Desktop**: `≥1200px` (use `desktop:` prefix)

### Responsive Patterns
```jsx
// Responsive grid
<div className="grid grid-cols-1 desktop:grid-cols-3 gap-6">

// Responsive text
<h1 className="text-2xl desktop:text-4xl">

// Responsive spacing
<div className="p-4 desktop:p-8">

// Responsive visibility
<div className="hidden desktop:block">Desktop only</div>
<div className="desktop:hidden">Mobile only</div>
```

## 🌙 Dark Mode Support

The theme automatically supports dark mode through CSS variables. Components will adapt when the `dark` class is applied to the document root.

### Dark Mode Classes
```jsx
// Dark mode aware background
<div className="bg-white dark:bg-neutral-800">

// Dark mode aware text
<p className="text-neutral-900 dark:text-neutral-100">

// Dark mode aware borders
<div className="border-secondary-200 dark:border-neutral-700">
```

## 🎯 Best Practices

### Do's
✅ Use the predefined color palette consistently
✅ Apply hover effects to interactive elements
✅ Use appropriate text hierarchy (primary, secondary, muted)
✅ Follow the spacing system (4px, 8px, 16px, 24px, 32px, 48px, 64px)
✅ Use gradients for hero sections and important CTAs
✅ Apply shadows consistently (card, professional, hero)

### Don'ts
❌ Use arbitrary colors outside the palette
❌ Mix different shadow styles in the same component
❌ Overuse animations - keep them subtle and purposeful
❌ Ignore responsive design patterns
❌ Use low contrast color combinations

## 🔄 Component Migration

When updating existing components to use the new theme:

1. Replace `bg-gray-*` with `bg-secondary-*` or `bg-neutral-*`
2. Replace `text-gray-*` with `text-neutral-*` or `text-secondary-*`
3. Replace `border-gray-*` with `border-secondary-*` or `border-neutral-*`
4. Add appropriate hover effects and transitions
5. Use gradient backgrounds for hero/important sections
6. Apply professional shadows instead of basic ones

## 📖 Examples

### Before & After

**Before:**
```jsx
<div className="bg-gray-100 p-6 rounded-lg shadow-md">
  <h3 className="text-lg font-bold text-gray-900 mb-2">Title</h3>
  <p className="text-gray-600">Description text</p>
  <button className="bg-blue-500 text-white px-4 py-2 rounded">
    Action
  </button>
</div>
```

**After:**
```jsx
<div className="bg-gradient-card p-6 rounded-xl shadow-card hover:shadow-professional transition-all duration-300 border border-secondary-200">
  <h3 className="text-xl font-bold text-neutral-900 mb-3">Title</h3>
  <p className="text-neutral-600 leading-relaxed">Description text</p>
  <button className="btn-primary mt-4">
    Action
  </button>
</div>
```

This design system ensures a cohesive, professional appearance across the entire CV website while maintaining flexibility for component-specific needs.