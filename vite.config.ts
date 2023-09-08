import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import mkcert from "vite-plugin-mkcert";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import vitePluginImp from "vite-plugin-imp";
import { visualizer } from "rollup-plugin-visualizer";
import ssr from "vite-plugin-ssr/plugin";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    https: true, // 需要开启https服务
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 5173,
    https: true, // 需要开启https服务
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
  },
  plugins: [
    react(),
    ssr({ prerender: true }),
    mkcert(),
    vitePluginImp({
      libList: [
        {
          libName: "lodash",
          libDirectory: "",
          camel2DashComponentName: false,
        },
        {
          libName: "antd",
          style: (name) => {
            if (/[A-Z]/.test(name)) {
              return `antd/es/${name}/style`;
            }
          },
        },
      ],
    }),
    visualizer(),
  ],
  resolve: {
    alias: {
      "@": resolve("src"),
      "@mooncatcher/stem-views": resolve("src/views"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        experimentalMinChunkSize: 1000,
        // manualChunks,
      },
      treeshake: {
        preset: "recommended",
        manualPureFunctions: ["console.log"],
      },
    },
  },
  envPrefix: ["vite_"],
});
