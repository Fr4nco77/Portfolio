// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  site: "https://franco-carreras.vercel.app",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "es",
        locales: {
          en: "en-US",
          es: "es-ES",
          fr: "fr-FR",
          pt: "pt-BR",
        },
      },
    }),
  ],

  i18n: {
    defaultLocale: "es",
    locales: ["es", "en", "fr", "pt"],
    routing: {
      prefixDefaultLocale: true,
    },
  },

  adapter: vercel(),
});