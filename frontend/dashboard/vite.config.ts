import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../shared/enviroments/.env') });

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@dashboard': path.resolve(__dirname, '../dashboard/src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/global.css";`,
      },
    },
  },
  define: {
    'import.meta.env': {
      ...process.env,
    },
  },
  plugins: [
    react(),
    federation({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      remotes: {
        host: 'http://localhost:3001/assets/remoteEntry.js'
      },
      exposes: {
        './DashboardApp': './src/App',
      },
      shared: [
        'react',
        'react-dom',
        'react-router-dom',
      ],
    }),
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: false,
    minify: false,
    assetsInlineLimit: 32768,
  },
  server: {
    port: 3002,
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Origin', 'Content-Type', 'Accept'],
    },
  },
});
