import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

import { yahooFinancePlugin } from "./src/server/yahooFinancePlugin";

export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "src/pages",
    }),
    react(),
    yahooFinancePlugin(),
  ],
  resolve: {
    alias: {
      "@pages": path.resolve(__dirname, "src/pages"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@containers": path.resolve(__dirname, "src/containers"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@custom-types": path.resolve(__dirname, "src/custom-types"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@libs": path.resolve(__dirname, "src/libs"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@styles": path.resolve(__dirname, "src/styles"),
    },
  },
  server: {
    port: 7100,
  },
});
