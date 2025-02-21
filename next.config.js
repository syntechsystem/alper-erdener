const crypto = require('crypto');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unpkg.com'
      },
      {
        protocol: 'https',
        hostname: 'control.com'
      }
    ],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: false, // This replaces optimizeImages
  },
  poweredByHeader: false,
  compress: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'three': 'three',
      'three/examples/jsm/controls/OrbitControls': 'three/examples/jsm/controls/OrbitControls.js',
      'three/examples/jsm/controls/TrackballControls': 'three/examples/jsm/controls/TrackballControls.js',
      'three/examples/jsm/controls/FlyControls': 'three/examples/jsm/controls/FlyControls.js',
      'three/examples/jsm/renderers/CSS2DRenderer': 'three/examples/jsm/renderers/CSS2DRenderer.js'
    };
    
    // Optimize bundle size
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            priority: 20
          },
          lib: {
            test(module) {
              return module.size() > 160000 && /node_modules[\\/]/.test(module.identifier());
            },
            name(module) {
              const moduleId = module.identifier();
              const hash = moduleId.split('').reduce((hash, char) => {
                return ((hash << 5) - hash) + char.charCodeAt(0) | 0;
              }, 0);
              return `lib-${Math.abs(hash).toString(16).substring(0, 8)}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true
          }
        }
      }
    };
    
    return config;
  },
  experimental: {
    scrollRestoration: true
    // Remove optimizeFonts and optimizeImages from here
  }
};

module.exports = nextConfig;