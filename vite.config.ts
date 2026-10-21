import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

// base "./" — сайт открывается из подпапки GitHub Pages (https://<user>.github.io/<repo>/).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwind()],
  resolve: {
    alias: { "@": new URL("./src", import.meta.url).pathname },
  },
});
