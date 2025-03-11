import { getRequestConfig } from "next-intl/server"
import { notFound } from "next/navigation"

// Define the supported locales
export const locales = ["en", "es", "fr"]
export const defaultLocale = "en"

export default getRequestConfig(async ({ locale }) => {
  // Validate that the locale is supported
  if (!locales.includes(locale)) {
    notFound()
  }

  // Load the messages for the locale
  const messages = (await import(`./messages/${locale}.json`)).default

  return {
    messages,
    timeZone: "UTC",
    now: new Date(),
  }
})

