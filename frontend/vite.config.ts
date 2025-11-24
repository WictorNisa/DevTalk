import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(), // Path plugin to reduce redundancy between vite config and tsconfig
    svgr(), // Plugin to properly load SVG to be manipulated with Tailwind CSS
  ],
  define: {
    global: 'globalThis'
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'ui-vendor': ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        }
      }
    }
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    strictPort: true,
  },
  server: {
    port: 5173,
    host: true,
  }
});
