import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

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
      plugins: [react()],
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
            manualChunks: {
              // Vendor chunks
              'vendor-react': ['react', 'react-dom'],
              'vendor-motion': ['motion/react'],
              'vendor-lucide': ['lucide-react'],
              'vendor-supabase': ['@supabase/supabase-js'],
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
        // Enable minification
        minify: 'esbuild',
        // CSS code splitting
        cssCodeSplit: true,
        // Generate source maps for production debugging
        sourcemap: false,
        // Optimize dependencies
        target: 'es2020',
      },
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', 'motion/react', 'lucide-react', '@supabase/supabase-js'],
        exclude: [],
      },
    };
});
