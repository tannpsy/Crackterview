import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// });

// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // 👈 Match this to backend
        changeOrigin: true,
        secure: false,
      },
      '/user/api': {
        target: 'http://localhost:8000', // 👈 Add this too
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
