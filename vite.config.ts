import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// Dev/preview proxy:
//   /api/*      -> backend (et-be, :4000) or the json-server mock (:4001) when VITE_USE_MOCK=true.
//                  The /api prefix is stripped, so /api/v1/auth/login -> <upstream>/v1/auth/login
//                  (same rewrite as docker/nginx/default.conf.template - keep them identical).
//   /socket.io  -> always the real backend (the mock has no realtime); only used by the optional
//                  Realtime module.
// CSS: PostCSS (postcss.config.js) enables @custom-media breakpoints from src/styles/breakpoints.css.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const backendUpstream = env.VITE_BACKEND_UPSTREAM || 'http://localhost:4000';
  const mockUpstream = env.VITE_MOCK_UPSTREAM || 'http://localhost:4001';
  const apiTarget = env.VITE_USE_MOCK === 'true' ? mockUpstream : backendUpstream;

  const proxy = {
    '/api': {
      target: apiTarget,
      changeOrigin: true,
      rewrite: (requestPath: string): string => requestPath.replace(/^\/api/, ''),
    },
    '/socket.io': {
      target: backendUpstream,
      changeOrigin: true,
      ws: true,
    },
  };

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    css: {
      modules: {
        // Class names stay camelCase in CSS and are accessed as styles.someClass.
        localsConvention: 'camelCaseOnly',
      },
    },
    build: {
      sourcemap: 'hidden',
      rollupOptions: {
        output: {
          manualChunks(id: string): string | undefined {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/react-router')) return 'vendor-react';
            if (id.includes('/motion/')) return 'vendor-motion';
            if (id.includes('/@tanstack/')) return 'vendor-query';
            return undefined;
          },
        },
      },
    },
    server: {
      port: 3000,
      strictPort: true,
      proxy,
    },
    preview: {
      port: 3000,
      strictPort: true,
      proxy,
    },
  };
});
