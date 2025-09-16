import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  future: {
    unstable_splitRouteModules: true,
    v8_middleware: true,
    unstable_optimizeDeps: true,
    unstable_subResourceIntegrity: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
