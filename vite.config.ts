import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // PDF library - must be matched before the generic 'react' rule
          // ('@react-pdf' contains 'react') so it stays in its lazy chunk
          if (id.includes('@react-pdf') || id.includes('yoga-layout') || id.includes('fontkit')) {
            return 'pdf';
          }

          // Charts library - large dependency, separate chunk
          if (id.includes('recharts')) {
            return 'charts';
          }

          // React core - highest priority
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor';
          }
          
          // Animation library - UI enhancement
          if (id.includes('framer-motion')) {
            return 'ui';
          }
          
          // Icons - frequently used UI elements
          if (id.includes('lucide-react')) {
            return 'ui';
          }
          
          // Internationalization - can be lazy loaded
          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'i18n';
          }
          
          // State management and utilities
          if (id.includes('zustand') || id.includes('react-intersection-observer')) {
            return 'utils';
          }
          
          // Node modules that don't fit above categories
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    target: 'esnext',
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      'lucide-react',
      'zustand',
      'react-intersection-observer',
      // Pre-bundle so its CJS deps (base64-js via linebreak…) get ESM interop in dev.
      // Lazy loading is preserved by the dynamic import() in usePDFGeneration.
      '@react-pdf/renderer'
    ]
  },
  server: {
    port: 3000
  },
  preview: {
    port: 4173
  }
})