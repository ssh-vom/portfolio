import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/current-track': 'http://localhost:8888',
      '/init-auth': 'http://localhost:8888',
      '/callback': 'http://localhost:8888'
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});


