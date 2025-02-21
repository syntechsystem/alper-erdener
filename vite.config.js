import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import viteCompression from 'vite-plugin-compression';
import path from 'path';

export default defineConfig({
  plugins: [
    react({
      include: "**/*.{js,jsx,ts,tsx}",
      babel: {
        plugins: [],
        babelrc: false,
        configFile: false,
      }
    }),
    splitVendorChunkPlugin(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false
    })
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'), // Src klasörü için alias ekledim
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Production'da sourcemap'i kapattım
    minify: 'terser', // Daha iyi minification
    terserOptions: {
      compress: {
        drop_console: true, // Console.log'ları kaldır
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'three', 'react-globe.gl'], // Vendor chunk'ları ayır
        },
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js',
        assetFileNames: ({name}) => {
          if (/\.(gif|jpe?g|png|svg)$/.test(name ?? '')) {
            return 'assets/images/[name].[hash][extname]';
          }
          if (/\.css$/.test(name ?? '')) {
            return 'assets/css/[name].[hash][extname]';
          }
          return 'assets/[ext]/[name].[hash][extname]';
        },
      }
    },
    target: 'esnext', // Modern browsers için optimize et
  },
  server: {
    port: 3000,
    cors: true, // CORS'u ekledim
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/javascript',
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', 'react-globe.gl'],
    exclude: [] // Gerekirse exclude edilecek paketler buraya
  },
  esbuild: {
    jsxInject: `import React from 'react'`, // Otomatik React import
  }
});