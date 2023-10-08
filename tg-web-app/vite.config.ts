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
      "/webhook": {
        target: process.env.BACKEND_URL,
      },
      "/image": {
        target: process.env.IMGPROXY_URL,
        rewrite(path) {
          const key = path.split("/")[2];
          const bucket = process.env.OBJECT_STORAGE_BUCKET;

          return `/insecure/plain/s3://${bucket}/${key}`;
        },
      },
    },
  },
  plugins: [react()],
});
