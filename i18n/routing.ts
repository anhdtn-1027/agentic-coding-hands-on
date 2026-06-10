import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en", "ja"],
  defaultLocale: "vi",
  // 'as-needed': default locale (vi) has no prefix, others get /en /ja
  localePrefix: "as-needed",
  // Spec requires Vietnamese as the default — do NOT auto-switch to the
  // browser's Accept-Language. Locale changes only via the language switcher.
  localeDetection: false,
});
