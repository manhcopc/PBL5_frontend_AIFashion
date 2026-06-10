import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Bất cứ request nào bắt đầu bằng /ngrok-proxy sẽ được Vite xử lý
      "/ngrok-proxy": {
        target: "https://agreeably-saxophone-showpiece.ngrok-free.dev/", // dichoimave
        // target: "https://reoccur-plutonium-evidence.ngrok-free.dev/", // buiducmanh
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ngrok-proxy/, ""), // Xóa chữ /ngrok-proxy đi trước khi gửi lên Backend
        headers: {
          "ngrok-skip-browser-warning": "true", // ✅ Chìa khóa vàng: Gắn Header lách Ngrok
        },
      },
    },
  },
});
