/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/cms',
  server: {
    port: 8080,
    host: 'localhost',
  },
  preview: {
    port: 8080,
    host: 'localhost',
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    tsconfigPaths: true,
    conditions: ['@inithium/source', 'import', 'module', 'browser', 'default']
  },
  envPrefix: ['VITE_', 'API_', 'PORT', 'HOST'],
  define: {
    'process.env': {}
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));