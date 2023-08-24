import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import mkcert from "vite-plugin-mkcert";

console.log(process.env.VITE_GITHUB_TOKEN, "process.env.VITE_GITHUB_TOKEN");

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    https: true, // 需要开启https服务
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: "bearer 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",
    },
    proxy: {
      hostname: "0.0.0.0",
      port: "9999",
      "/login": {
        target: "https://github.com/",
        changeOrigin: true,
      },
      "/api": {
        target: "https://api.github.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  preview: {
    port: 5173,
    https: true, // 需要开启https服务
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
    proxy: {
      "/login": {
        target: "https://github.com/",
        changeOrigin: true,
      },
      "/api": {
        target: "https://api.github.com",
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mkcert()],
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
});
