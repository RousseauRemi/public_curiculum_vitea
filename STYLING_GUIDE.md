# Styling Standards Guide

This document outlines the standardized approach to styling in this React CV application.

## Principles

1. **Theme-first approach**: Use theme utilities whenever possible
2. **Consistency**: All components should follow the same patterns
3. **Maintainability**: Centralized color and spacing definitions
4. **Performance**: Efficient CSS with minimal redundancy

## Theme Utility Classes

### Text Colors
Use these instead of arbitrary Tailwind colors:

```tsx
// ✅ GOOD - Theme utilities
<h1 className="text-primary">Heading</h1>
<p className="text-secondary">Subtext</p>
<span className="text-theme-muted">Helper text</span>

// ❌ AVOID - Direct Tailwind utilities
<h1 className="text-blue-600">Heading</h1>
<p className="text-gray-600">Subtext</p>
```

### Background Colors
```tsx
// ✅ GOOD
<div className="bg-primary">Primary background</div>
<div className="bg-secondary">Secondary background</div>
<div className="bg-theme-muted">Muted background</div>

// ❌ AVOID
<div className="bg-blue-600">Primary background</div>
<div className="bg-gray-100">Secondary background</div>
```

### Shadows
```tsx
// ✅ GOOD
<div className="shadow-card">Card component</div>
<div className="shadow-professional hover:shadow-professional">Interactive card</div>

// ❌ AVOID
<div className="shadow-md">Card component</div>
<div className="shadow-lg hover:shadow-xl">Interactive card</div>
```

## Color Hierarchy

### Primary Colors
- `text-primary` / `bg-primary` - Main brand color (blue)
- `text-primary-light` / `bg-primary-light` - Lighter variant
- `text-primary-dark` / `bg-primary-dark` - Darker variant

### Secondary Colors
- `text-secondary` / `bg-secondary` - Secondary color (slate)
- `text-secondary-light` / `bg-secondary-light` - Lighter variant
- `text-secondary-dark` / `bg-secondary-dark` - Darker variant

### Semantic Colors
- `text-theme-primary` - Primary text color
- `text-theme-secondary` - Secondary text color  
- `text-theme-muted` - Muted/helper text color
- `text-theme-accent` - Accent text color

## When to Use Tailwind vs Theme Classes

### Use Theme Classes For:
- Colors (text, background, border)
- Shadows and elevation
- Component-specific styling
- Brand-related visual elements

### Use Tailwind Classes For:
- Layout (flexbox, grid, positioning)
- Spacing (margin, padding)
- Typography sizing (text-sm, text-lg, etc.)
- Responsive modifiers
- Utility-based styling (hidden, block, etc.)

## Example Component

```tsx
// ✅ GOOD - Consistent styling approach
const Button: React.FC<ButtonProps> = ({ children, variant = 'primary' }) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary-dark focus:ring-primary shadow-card hover:shadow-professional",
    secondary: "bg-secondary text-primary border border-secondary hover:bg-secondary-dark focus:ring-secondary",
    ghost: "text-primary hover:bg-secondary hover:text-primary-dark focus:ring-primary"
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
};

// ❌ AVOID - Mixed approaches
const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg rounded-lg">
      {children}
    </button>
  );
};
```

## Migration Strategy

When updating existing components:

1. **Identify color usage**: Look for hardcoded Tailwind colors
2. **Replace with theme utilities**: Use the standardized classes
3. **Test consistency**: Ensure the visual output remains consistent
4. **Update hover states**: Use theme-aware hover utilities

## Common Patterns

### Navigation Items
```tsx
<button className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
  isActive 
    ? 'bg-primary text-white shadow-card'
    : 'text-secondary hover:bg-secondary hover:text-primary'
}`}>
```

### Cards
```tsx
<div className="bg-white rounded-xl shadow-card hover:shadow-professional transition-all duration-300 border border-secondary p-6">
```

### Form Elements
```tsx
<input className="w-full px-3 py-2 border border-theme-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
```

## Benefits

1. **Consistent theming** - All colors follow the design system
2. **Easy maintenance** - Change theme variables to update entire app
3. **Better performance** - Reduced CSS bundle size
4. **Type safety** - Theme utilities can be typed
5. **Dark mode ready** - Theme variables can switch contexts