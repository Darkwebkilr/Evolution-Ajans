import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";
import sitemap from "@astrojs/sitemap";
import indexNow from "astro-indexnow";

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "ee53d0b5d75ffee8940a2d380be0833d";

// https://astro.build/config
export default defineConfig({
  site: "https://evolutionajans.com",
  trailingSlash: "always",
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

  integrations: [
    icon(),
    sitemap({
      filter: (page) =>
        page !== "https://evolutionajans.com/tesekkurler" &&
        page !== "https://evolutionajans.com/tesekkurler/" &&
        !page.includes("/admin/"),
      serialize(item) {
        item.changefreq = "daily";
        item.priority = 0.7;
        item.lastmod = new Date();
        return item;
      },
    }),
    indexNow({
      key: INDEXNOW_KEY,
    }),
  ],
});
