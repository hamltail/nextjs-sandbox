import { headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const requestHeaders = await headers();
  const acceptLanguage = requestHeaders.get("accept-language");

  const preferredLanguage = acceptLanguage?.split(",")[0]?.trim().toLowerCase();

  const locale = preferredLanguage?.startsWith("ja") ? "ja" : "en";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
