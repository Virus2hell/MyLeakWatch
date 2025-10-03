import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
    },
  },
})

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:4000',
//         changeOrigin: true,
//         secure: false,
//         // keep path as-is; helpful if the backend is mounted at /api
//         rewrite: path => path,
//         configure: (proxy) => {
//           proxy.on('proxyReq', (proxyReq, req) => {
//             // simple dev visibility to ensure requests flow through
//             console.log('[vite-proxy] ->', req.method, req.url);
//           });
//           proxy.on('proxyRes', (proxyRes, req) => {
//             console.log('[vite-proxy] <-', proxyRes.statusCode, req.url);
//           });
//         }
//       }
//     }
//   }
// });

