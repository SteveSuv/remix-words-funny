import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3001, strictPort: true },
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), reactRouter()],
});
