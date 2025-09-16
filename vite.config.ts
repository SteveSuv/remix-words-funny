import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: { port: 3001, strictPort: true },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // split large chunk
            const names = [
              "react-router",
              "react-dom",
              "react-hook-form",
              "react",
              "chance",
              "zod",
              "tailwind-merge",
            ];
            for (const name of names) {
              if (id.includes(name)) return `vendor-${name}`;
            }
            return null;
          }
        },
      },
    },
  },
});
