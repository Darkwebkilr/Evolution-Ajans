import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";
import lottie from "astro-integration-lottie";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://evolutionajans.com",
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,
        ignored: [
          "**/C:/DumpStack.log.tmp**",
          "**/C:/DumpStack.log**",
          "**/C:/hiberfil.sys**",
          "**/C:/pagefile.sys**",
          "**/C:/swapfile.sys**",
          "**/C:/System Volume Information**",
          "C:/DumpStack.log.tmp",
          "C:/DumpStack.log",
          "C:/hiberfil.sys",
          "C:/pagefile.sys",
          "C:/swapfile.sys",
          "C:/System Volume Information"
        ]
      }
    }
  },
  experimental: {},

  integrations: [icon(), lottie(), sitemap()],
});
