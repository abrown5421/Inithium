/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  server: {
    port: 5173,
    host: 'localhost',
  },
  preview: {
    port: 5173,
    host: 'localhost',
  },
  plugins: [
    react()
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