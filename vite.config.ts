import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Cloudflare Pages serves 404.html for any unmatched path (HTTP 404, but the
// HTML still renders). Since the site uses hash-based routing, copying
// index.html to 404.html lets every deep link fall back to the app shell
// WITHOUT needing a /* catch-all redirect (which caused infinite loops).
function spa404Fallback() {
  return {
    name: 'spa-404-fallback',
    apply: 'build' as const,
    closeBundle() {
      const dist = path.resolve(__dirname, 'dist');
      const index = path.join(dist, 'index.html');
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(dist, '404.html'));
      }
    },
  };
}

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:4000',
            changeOrigin: true,
            secure: false,
          },
        },
      },
      plugins: [react(), spa404Fallback()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optimize chunk splitting for better caching
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              // Vendor chunks
              if (id.includes('node_modules')) {
                if (id.includes('motion')) {
                  return 'vendor-motion';
                }
                if (id.includes('react') || id.includes('react-dom')) {
                  return 'vendor-react';
                }
                if (id.includes('lucide-react')) {
                  return 'vendor-lucide';
                }
                if (id.includes('@supabase')) {
                  return 'vendor-supabase';
                }
                if (id.includes('jose') || id.includes('jsonwebtoken')) {
                  return 'vendor-auth';
                }
                return 'vendor-misc';
              }
            },
            // Optimize chunk file names for caching
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
            assetFileNames: (assetInfo) => {
              const name = assetInfo.name ?? '';
              const info = name.split('.');
              const ext = info[info.length - 1];
              if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(name)) {
                return `assets/images/[name]-[hash].${ext}`;
              }
              if (/\.(woff2?|ttf|eot)$/.test(name)) {
                return `assets/fonts/[name]-[hash].${ext}`;
              }
              return `assets/[ext]/[name]-[hash].${ext}`;
            },
          },
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 800,
        // Enable minification with terser for better compression
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 2,
          },
          mangle: {
            safari10: true,
          },
          format: {
            comments: false,
          },
        },
        // CSS code splitting
        cssCodeSplit: true,
        // Generate source maps for production debugging
        sourcemap: false,
        // Optimize dependencies
        target: 'es2020',
        // Module preloading
        modulePreload: {
          polyfill: true,
        },
        // Report compressed size
        reportCompressedSize: true,
      },
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'motion/react', 'lucide-react', '@supabase/supabase-js'],
        exclude: [],
      },
    };
});
