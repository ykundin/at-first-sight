import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: Number(process.env.PORT) || 3000,
    proxy: {
      "/api": {
        target: process.env.BACKEND_URL,
      },
    },
  },
  plugins: [react()],
});
