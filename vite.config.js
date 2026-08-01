import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const DEPLOYED_API_URL = "https://two026-team02-schim-server.onrender.com";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || DEPLOYED_API_URL,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
