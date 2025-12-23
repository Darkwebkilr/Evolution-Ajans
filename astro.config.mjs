import { defineConfig } from "astro/config";
import "./src/styles/global.css";
import tailwindcss from "@tailwindcss/vite";
import vue from "@astrojs/vue";

import icon from "astro-icon";
import lottie from "astro-integration-lottie";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  experimental: {},

  integrations: [vue(), icon(), lottie()],
});
