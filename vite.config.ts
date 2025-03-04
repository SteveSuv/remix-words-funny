import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: { port: 3001, strictPort: true },
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
  define: {
    "process.env": process.env,
  },
});
