import react from "@vitejs/plugin-react";
import ssr from "vite-plugin-ssr/plugin";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import mkcert from "vite-plugin-mkcert";
import { resolve } from "path";
import vitePluginImp from "vite-plugin-imp";
import { VitePWA } from "vite-plugin-pwa";

const config = defineConfig(({ mode }) => {
  return {
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
    plugins: [
      react(),
      mkcert(),
      VitePWA({ registerType: "autoUpdate" }),
      ssr({ prerender: true }),
      vitePluginImp({
        exclude: ["antd"],
        libList: [
          {
            libName: "lodash",
            libDirectory: "",
            camel2DashComponentName: false,
          },
        ],
      }),
      mode === "dev" && visualizer(),
    ],
    envPrefix: ["vite_", "GITHUB_"],
    resolve: {
      alias: {
        "@components": resolve("components"),
        "@public": resolve("public"),
        "@type": resolve("type"),
        "@api": resolve("api"),
        "@constant": resolve("constant"),
        "@utils": resolve("utils"),
        "@providers": resolve("providers"),
        "@worker": resolve("worker"),
      },
    },
  };
});

export default config;
