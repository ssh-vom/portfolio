import { defineConfig } from "vite";
import yaml from "@rollup/plugin-yaml";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react(), yaml()],
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
