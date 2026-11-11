import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import vuetify from "vite-plugin-vuetify";

const backend = "http://localhost:3000";

export default defineConfig({
  server: {
    proxy: {
      "/api": backend,
      "/images": backend,
      "/socket.io": { target: backend, ws: true },
    },
  },
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "別為青春雀步｜CIAO 期中公演",
        short_name: "CIAO 期中公演",
        description: "CIAO 期中公演節目表與即時演出資訊",
        theme_color: "#09090D",
        background_color: "#09090D",
        display: "standalone",
        icons: [
          // Since we don't have real icons, this is just a placeholder
          // It might trigger a warning but allows testing the PWA
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
    }),
  ],
});
