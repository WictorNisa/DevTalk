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
    rollupOptions: {
      onwarn(warning, warn){
        return;
      }
    }
  }
});
