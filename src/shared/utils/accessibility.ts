/**
 * Accessibility utilities and helpers
 */

/**
 * Get ARIA label for project status
 */
export const getStatusAriaLabel = (status: string, language: 'fr' | 'en'): string => {
  const statusLabels = {
    fr: {
      enReflexion: 'Statut: En réflexion',
      demarre: 'Statut: Démarré',
      enCours: 'Statut: En cours',
      termine: 'Statut: Terminé',
      archive: 'Statut: Archivé'
    },
    en: {
      enReflexion: 'Status: In reflection',
      demarre: 'Status: Started', 
      enCours: 'Status: In progress',
      termine: 'Status: Completed',
      archive: 'Status: Archived'
    }
  };

  return statusLabels[language][status as keyof typeof statusLabels.fr] || 
         `${language === 'fr' ? 'Statut' : 'Status'}: ${status}`;
};

/**
 * Get ARIA label for project category
 */
export const getCategoryAriaLabel = (category: string, language: 'fr' | 'en'): string => {
  const categoryLabels = {
    fr: {
      informatics: 'Catégorie: Informatique',
      gardening: 'Catégorie: Jardinage',
      wood: 'Catégorie: Travail du bois',
      electronics: 'Catégorie: Électronique'
    },
    en: {
      informatics: 'Category: Informatics',
      gardening: 'Category: Gardening', 
      wood: 'Category: Woodworking',
      electronics: 'Category: Electronics'
    }
  };

  return categoryLabels[language][category as keyof typeof categoryLabels.fr] ||
         `${language === 'fr' ? 'Catégorie' : 'Category'}: ${category}`;
};

/**
 * Get ARIA label for technology badge
 */
export const getTechnologyAriaLabel = (technology: string, language: 'fr' | 'en'): string => {
  return `${language === 'fr' ? 'Technologie utilisée' : 'Technology used'}: ${technology}`;
};

/**
 * Get ARIA label for image with context
 */
export const getImageAriaLabel = (
  projectName: string, 
  imageType: string = 'web',
  language: 'fr' | 'en'
): string => {
  const typeLabels = {
    fr: {
      web: 'Capture d\'écran web',
      mobile: 'Capture d\'écran mobile',
      photo: 'Photo'
    },
    en: {
      web: 'Web screenshot',
      mobile: 'Mobile screenshot',
      photo: 'Photo'
    }
  };

  const typeLabel = typeLabels[language][imageType as keyof typeof typeLabels.fr] || imageType;
  return `${typeLabel} ${language === 'fr' ? 'du projet' : 'of project'} ${projectName}`;
};

/**
 * Get ARIA label for navigation buttons
 */
export const getNavigationAriaLabel = (action: string, target: string, language: 'fr' | 'en'): string => {
  const actionLabels = {
    fr: {
      goto: 'Aller à la section',
      open: 'Ouvrir',
      close: 'Fermer',
      toggle: 'Basculer',
      expand: 'Développer',
      collapse: 'Réduire'
    },
    en: {
      goto: 'Go to section',
      open: 'Open',
      close: 'Close', 
      toggle: 'Toggle',
      expand: 'Expand',
      collapse: 'Collapse'
    }
  };

  const actionLabel = actionLabels[language][action as keyof typeof actionLabels.fr] || action;
  return `${actionLabel} ${target}`;
};

/**
 * Check if element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ];

  return focusableSelectors.some(selector => element.matches(selector));
};

/**
 * Get next focusable element
 */
export const getNextFocusableElement = (
  currentElement: HTMLElement,
  container?: HTMLElement
): HTMLElement | null => {
  const root = container || document.body;
  const focusableElements = root.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const focusableArray = Array.from(focusableElements) as HTMLElement[];
  const currentIndex = focusableArray.indexOf(currentElement);
  
  if (currentIndex === -1) return null;
  
  return focusableArray[currentIndex + 1] || focusableArray[0];
};

/**
 * Get previous focusable element
 */
export const getPrevFocusableElement = (
  currentElement: HTMLElement,
  container?: HTMLElement
): HTMLElement | null => {
  const root = container || document.body;
  const focusableElements = root.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  
  const focusableArray = Array.from(focusableElements) as HTMLElement[];
  const currentIndex = focusableArray.indexOf(currentElement);
  
  if (currentIndex === -1) return null;
  
  return focusableArray[currentIndex - 1] || focusableArray[focusableArray.length - 1];
};


/**
 * Keyboard navigation constants
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End'
} as const;

/**
 * Handle keyboard navigation for lists/grids
 */
export const handleListNavigation = (
  event: KeyboardEvent,
  currentIndex: number,
  totalItems: number,
  onIndexChange: (newIndex: number) => void,
  itemsPerRow = 1
): boolean => {
  switch (event.key) {
    case KEYBOARD_KEYS.ARROW_UP:
      event.preventDefault();
      onIndexChange(Math.max(0, currentIndex - itemsPerRow));
      return true;
      
    case KEYBOARD_KEYS.ARROW_DOWN:
      event.preventDefault();
      onIndexChange(Math.min(totalItems - 1, currentIndex + itemsPerRow));
      return true;
      
    case KEYBOARD_KEYS.ARROW_LEFT:
      event.preventDefault();
      onIndexChange(Math.max(0, currentIndex - 1));
      return true;
      
    case KEYBOARD_KEYS.ARROW_RIGHT:
      event.preventDefault();
      onIndexChange(Math.min(totalItems - 1, currentIndex + 1));
      return true;
      
    case KEYBOARD_KEYS.HOME:
      event.preventDefault();
      onIndexChange(0);
      return true;
      
    case KEYBOARD_KEYS.END:
      event.preventDefault();
      onIndexChange(totalItems - 1);
      return true;
      
    default:
      return false;
  }
};