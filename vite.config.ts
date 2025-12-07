import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import path from "path";

export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./src/app",
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "src/app"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@containers": path.resolve(__dirname, "src/containers"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@libs": path.resolve(__dirname, "src/libs"),
      "@modules": path.resolve(__dirname, "src/modules"),
      "@customTypes": path.resolve(__dirname, "src/customTypes"),
    },
  },
  server: {
    port: 3000,
  },
});
