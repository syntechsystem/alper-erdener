import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: true
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
        passes: 2,
        ecma: 2020
      },
      mangle: {
        safari10: true
      }
    },
    cssCodeSplit: true,
    cssMinify: true,
    modulePreload: {
      polyfill: true
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three'],
          'globe-vendor': ['react-globe.gl'],
          'utils': ['./src/utils/index.js'],
          'components': ['./src/components/Header/index.js', './src/components/Hero/Hero.jsx']
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096
  },
  server: {
    port: 3000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', 'react-globe.gl']
  }
});
