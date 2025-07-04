import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // port: 5000,
    // cors: {
    //   origin: "http://localhost:5173",
    // },
    proxy: {
      "^/api|images*": {
        target: "https://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
