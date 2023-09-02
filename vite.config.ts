import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import mkcert from "vite-plugin-mkcert";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import vitePluginImp from "vite-plugin-imp";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost",
    https: true, // 需要开启https服务
    headers: {
      Accept: "application/vnd.github.v3+json",
    },
    // hmr: {
    //   protocol: 'ws',
    //   host: '127.0.0.1'
    // }
    // proxy: {
    //   hostname: "0.0.0.0",
    //   port: "9999",
    //   "/login": {
    //     target: "https://github.com/",
    //     changeOrigin: true,
    //   },
    //   "/api": {
    //     target: "https://api.github.com/",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
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
        target: "https://api.github.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    chunkSplitPlugin({
      strategy: "default",
      customSplitting: {
        // 源码中 utils 目录的代码都会打包进 `utils` 这个 chunk 中
        utils: [/src\/utils/],
        // lazyLoadDemo: [/src\/components\/LazyLoadDemo/],
        // 除了lazyLoadDemo 目录， components 目录下所有文件都打包到一起
        // components: [/src\/components\/(?!LazyLoadDemo)/],
        api: [/src\/api/],
        types: [/src\/types/],
        providers: [/src\/providers/],
      },
    }),
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

// 手动分包策略
// function manualChunks(id, { getModuleInfo }) {
//   const match = /.*\.strings\.(\w+)\.js/.exec(id);
//   if (match) {
//     const language = match[1]; // 例如 “en”
//     const dependentEntryPoints = [];

//     // 在这里，我们使用 Set 一次性处理每个依赖模块
//     // 它可以阻止循环依赖中的无限循环
//     const idsToHandle = new Set(getModuleInfo(id).dynamicImporters);

//     for (const moduleId of idsToHandle) {
//       const { isEntry, dynamicImporters, importers } = getModuleInfo(moduleId);
//       if (isEntry || dynamicImporters.length > 0)
//         dependentEntryPoints.push(moduleId);

//       // Set 迭代器足够智能，可以处理
//       // 在迭代过程中添加元素
//       for (const importerId of importers) idsToHandle.add(importerId);
//     }

//     // 如果仅有一个入口，那么我们会根据入口名
//     // 将它放到独立的 chunk 中
//     if (dependentEntryPoints.length === 1) {
//       return `${
//         dependentEntryPoints[0].split("/").slice(-1)[0].split(".")[0]
//       }.strings.${language}`;
//     }
//     // 对于多个入口，我们会把它放到“共享”的 chunk 中
//     if (dependentEntryPoints.length > 1) {
//       return `shared.strings.${language}`;
//     }
//   }
// }
