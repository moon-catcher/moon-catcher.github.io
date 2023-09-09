import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { UserConfig } from "vite";
import { resolve } from "path";

const config: UserConfig = {
  preview: {
    host: "0.0.0.0",
    port: 5173,
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  plugins: [react(), ssr({ prerender: true })],
  envPrefix: ["vite_"],
  resolve: {
    alias: {
      "@components": resolve("components"),
    },
  },
};

export default config;
