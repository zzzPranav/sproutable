import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { messageAt, withEnglishFallback } from "@/i18n/catalog";
import english from "../../messages/en.json";
import spanish from "../../messages/es.json";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async () => {
  const jar = await cookies();
  const requested = jar.get("locale")?.value;
  const locale: Locale = requested === "es" ? "es" : "en";
  const messages = locale === "es" ? withEnglishFallback(english, spanish) : english;
  return {
    locale,
    messages,
    onError(error) {
      // Log a string. Passing the error object makes Next treat a missing
      // phrase as a crashed page and show the data-unavailable screen.
      console.warn(error.code ? `${error.code}: ${error.message}` : error.message);
    },
    getMessageFallback({ namespace, key }) {
      const path = [namespace, key].filter(Boolean).join(".");
      return messageAt(english, path) ?? path;
    },
  };
});
