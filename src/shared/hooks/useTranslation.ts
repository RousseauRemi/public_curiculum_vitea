import { useEffect, useState, useCallback } from 'react';
import { Language } from '../../store/types';

interface TranslationData {
  [key: string]: string | TranslationData;
}

interface TranslationState {
  data: Record<Language, TranslationData>;
  isLoaded: boolean;
  error: string | null;
  isLoading: boolean;
}

// Global translation state
const translationState: TranslationState = {
  data: {
    [Language.FR]: {},
    [Language.EN]: {}
  },
  isLoaded: false,
  error: null,
  isLoading: false
};

// Subscribers for state changes
const subscribers = new Set<() => void>();

// Notify all subscribers of state changes
function notifySubscribers() {
  subscribers.forEach(callback => callback());
}

// Promise to ensure single loading instance
let loadingPromise: Promise<void> | null = null;

// Load translations with proper error handling and caching
async function loadTranslations(): Promise<void> {
  // If already loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  // If already loaded, no need to load again
  if (translationState.isLoaded) {
    return Promise.resolve();
  }

  translationState.isLoading = true;
  translationState.error = null;
  notifySubscribers();

  loadingPromise = Promise.all([
    fetch('/locales/fr.json').then(res => res.json()),
    fetch('/locales/en.json').then(res => res.json())
  ])
    .then(([frData, enData]) => {
      translationState.data[Language.FR] = frData;
      translationState.data[Language.EN] = enData;
      translationState.isLoaded = true;
      translationState.isLoading = false;
      translationState.error = null;
      notifySubscribers();
    })
    .catch((error) => {
      translationState.isLoading = false;
      translationState.error = error.message || 'Failed to load translations';
      translationState.isLoaded = false;
      console.error('Failed to load translations:', error);
      notifySubscribers();
    })
    .finally(() => {
      loadingPromise = null;
    });

  return loadingPromise;
}

// Initialize translations eagerly
loadTranslations();

export function useTranslation(language: Language) {
  const [, forceUpdate] = useState({});
  
  // Subscribe to translation state changes
  useEffect(() => {
    const updateComponent = () => {
      forceUpdate({});
    };
    subscribers.add(updateComponent);
    
    // Trigger loading if not already done
    if (!translationState.isLoaded && !translationState.isLoading) {
      loadTranslations();
    }
    
    return () => {
      subscribers.delete(updateComponent);
    };
  }, []);

  // Translation function with current state access (no memoization to avoid closure issues)
  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    // If there's an error, return the key as fallback
    if (translationState.error) {
      console.warn(`❌ Translation error: ${translationState.error}`);
      return key;
    }

    // If still loading, return key as placeholder
    if (!translationState.isLoaded) {
      return key;
    }

    const keys = key.split('.');
    let value: string | TranslationData = translationState.data[language];

    // Navigate through nested translation object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`Translation key "${key}" not found for language "${language}"`);
        }
        return key;
      }
    }

    // Ensure we have a string value
    if (typeof value !== 'string') {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Translation value for "${key}" is not a string`);
      }
      return key;
    }

    // Replace parameters in the string if provided
    if (params) {
      return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
        return str.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(paramValue));
      }, value);
    }

    return value;
  }, [language]);

  return {
    t,
    isLoading: translationState.isLoading,
    isLoaded: translationState.isLoaded,
    error: translationState.error
  };
}

// Utility function to preload translations (useful for SSR or preloading)
export function preloadTranslations(): Promise<void> {
  return loadTranslations();
}

// Utility function to get current translation state (for debugging)
export function getTranslationState(): TranslationState {
  return { ...translationState };
}