import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, type AppState, type CVData } from './types';

// Import CV data
import cvDataFr from '../data/cv-data-fr.json';
import cvDataEn from '../data/cv-data-en.json';

type Theme = 'light' | 'dark';

/** The URL is the source of truth for the language: English at /, French under /fr/.
 *  Each language has its own prerendered page (scripts/prerender.mjs), so a shared link or a
 *  crawler always gets the language in the address, whatever an earlier visit stored. */
export const languageFromPath = (pathname: string): Language =>
  /^\/fr(\/|$)/.test(pathname) ? Language.FR : Language.EN;

export const pathForLanguage = (language: Language): string =>
  language === Language.FR ? '/fr/' : '/';

interface AppStore extends AppState {
  // Actions
  setLanguage: (language: Language) => void;
  setActiveSection: (section: string) => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
  setLoading: (isLoading: boolean) => void;

  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Data getters
  getCVData: () => CVData;
  
  // Hydration state
  isHydrated: boolean;
  setHydrated: (isHydrated: boolean) => void;
}

const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      language: typeof window !== 'undefined' ? languageFromPath(window.location.pathname) : Language.EN,
      isLoading: false,
      activeSection: 'home',
      isMobileMenuOpen: false,
      isHydrated: false,
      theme: 'light',

      // Actions
      setLanguage: (language: Language) => {
        set({ language });
      },

      toggleTheme: () => {
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' });
      },


      setActiveSection: (section: string) => {
        set({ activeSection: section });
      },

      setMobileMenuOpen: (isOpen: boolean) => {
        set({ isMobileMenuOpen: isOpen });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setHydrated: (isHydrated: boolean) => {
        set({ isHydrated });
      },

      // Data getter
      getCVData: (): CVData => {
        const { language } = get();
        return language === Language.FR ? (cvDataFr as CVData) : (cvDataEn as CVData);
      },
    }),
    {
      name: 'cv-app-storage',
      // Only the theme is remembered; the language comes from the URL. The custom merge also
      // ignores the `language` older versions stored, which would otherwise override the URL.
      partialize: (state) => ({
        theme: state.theme,
      }),
      merge: (persisted, current) => ({
        ...current,
        theme: (persisted as Partial<AppStore> | undefined)?.theme ?? current.theme,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);

export default useAppStore;