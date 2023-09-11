import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { UserConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import { resolve } from "path";

const config: UserConfig = {
  preview: {
    host: "0.0.0.0",
    https: true,
    port: 5173,
  },
  server: {
    host: "0.0.0.0",
    https: true,
    port: 5173,
  },
  plugins: [react(), mkcert(), ssr({ prerender: true })],
  envPrefix: ["vite_"],
  resolve: {
    alias: {
      "@components": resolve("components"),
      "@public": resolve("public"),
      "@type": resolve("type"),
      "@api": resolve("api"),
      "@constant": resolve("constant"),
      "@utils": resolve("utils"),
      "@providers": resolve("providers"),
    },
  },
};

export default config;
