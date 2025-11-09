import type { GetStaticPaths } from "astro";
import es from "@i18n/ui/es.ts";
import en from "@i18n/ui/en.ts";
import fr from "@i18n/ui/fr.ts";
import pt from "@i18n/ui/pt";

export const defaultLocale = "es";
export const locales = {
  es: "ES",
  en: "EN",
  fr: "FR",
  pt: "PT",
};

export type Locale = keyof typeof locales;

export const getTranslation = (
  currenLocale: Locale,
  section: keyof typeof es,
) => {
  const translations = { en, es, fr, pt };
  const translation = translations[currenLocale][section];
  return translation;
};

export const generateLangStaticPaths = (() => {
  return Object.keys(locales).map((locale) => {
    return { params: { lang: locale } };
  });
}) satisfies GetStaticPaths;
