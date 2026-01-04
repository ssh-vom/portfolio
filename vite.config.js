import { defineConfig } from "vite";
import yaml from "@rollup/plugin-yaml";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    react(),
    yaml(),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 },
      includePublic: true,
    })
  ],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/current-track": "http://localhost:8888",
      "/init-auth": "http://localhost:8888",
      "/callback": "http://localhost:8888",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
