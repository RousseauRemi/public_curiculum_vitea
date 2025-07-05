/// <reference types="vite/client" />

// JSON module declarations
declare module '*.json' {
  const value: Record<string, unknown>;
  export default value;
}

// Global polyfills for @react-pdf/renderer
declare global {
  interface Window {
    Buffer: typeof import('buffer').Buffer;
    process: typeof import('process');
    global: typeof window;
  }
}
