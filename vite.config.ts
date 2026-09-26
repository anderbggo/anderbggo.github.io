import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const deployBase =
  (process.env.VITE_BASE_URL as string | undefined)?.trim() || "/";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [react()],
    base: isProd ? deployBase : "/",
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          contribute: resolve(__dirname, "contribute/index.html"),
          vestige: resolve(__dirname, "vestige/index.html"),
          vestigePrivacy: resolve(__dirname, "vestige/privacy/index.html"),
        },
      },
    },
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
      watch: {
        usePolling: true,
      },
    },
  };
});
