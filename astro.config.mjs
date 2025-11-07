// @ts-check
import { defineConfig } from "astro/config";
import "./src/styles/global.css";
import tailwindcss from "@tailwindcss/vite";

import icon from "astro-icon";
import lottie from "astro-integration-lottie";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [icon(), lottie()],
});
