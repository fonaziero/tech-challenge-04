import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import svgr from '@svgr/rollup';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../shared/enviroments/.env') });

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  define: {
    'import.meta.env': {
      ...process.env,
    },
  },
  plugins: [
    react(),
    svgr(),
    federation({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        dashboard: 'http://localhost:3002/assets/remoteEntry.js',
      },
      exposes: {
        './Button': './src/presentation/components/UI/buttons/button/button',
        './CircleButton': './src/presentation/components/UI/buttons/circleButton/index',
        './Header': './src/presentation/components/UI/header/index',
        './Input': './src/presentation/components/UI/inputs/input/index',
        './Select': './src/presentation/components/UI/inputs/select/index',
        './Menu': './src/presentation/components/UI/menu/index',
        './Modal': './src/presentation/components/UI/modal/index',
        './SearchBar': './src/presentation/components/UI/inputs/searchBar/index',
        './NotFound': './src/presentation/pages/not-found/not-found',
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
    port: 3001,
    cors: {
      origin: '*', 
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
  },
});
