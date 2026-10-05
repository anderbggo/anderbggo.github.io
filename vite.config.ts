import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

const deployBase =
  (process.env.VITE_BASE_URL as string | undefined)?.trim() || "/";

const gpmatcherRedirects: Plugin = {
  name: "gpmatcher-canonical-routes",
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      const url = new URL(request.url ?? "/", "http://localhost");
      if (url.pathname === "/gpmatcher" || url.pathname === "/gpmatcher/privacy") {
        response.writeHead(301, { Location: `${url.pathname}/${url.search}` });
        response.end();
        return;
      }
      next();
    });
  },
};

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [react(), gpmatcherRedirects],
    base: isProd ? deployBase : "/",
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          contribute: resolve(__dirname, "contribute/index.html"),
          vestige: resolve(__dirname, "vestige/index.html"),
          vestigePrivacy: resolve(__dirname, "vestige/privacy/index.html"),
          gpmatcher: resolve(__dirname, "gpmatcher/index.html"),
          gpmatcherPrivacy: resolve(__dirname, "gpmatcher/privacy/index.html"),
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
