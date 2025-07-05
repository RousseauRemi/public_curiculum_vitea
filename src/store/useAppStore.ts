import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, type AppState, type CVData } from './types';

// Import CV data
import cvDataFr from '../data/cv-data-fr.json';
import cvDataEn from '../data/cv-data-en.json';

type Theme = 'light' | 'dark';

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
      language: Language.FR,
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
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
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