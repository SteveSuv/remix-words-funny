import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: { port: 3001, strictPort: true },
  resolve: { tsconfigPaths: true },
  plugins: [tailwindcss(), reactRouter()],
  environments: {
    client: {
      build: {
        rolldownOptions: {
          output: {
            codeSplitting: {
              groups: [
                {
                  name: "ui",
                  tags: ["$initial"],
                  test: /node_modules\/(?:@heroui\/|react-aria(?:-components)?\/|react-stately\/|@react-aria\/|@react-stately\/|@react-types\/|@internationalized\/|tailwind-variants\/)/,
                },
              ],
            },
          },
        },
      },
    },
  },
});
