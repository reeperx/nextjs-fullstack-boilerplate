import { NextResponse } from "next/server"
import { locales, defaultLocale } from "@/i18n"

export function i18nMiddleware(request: Request) {
  const { pathname } = new URL(request.url)

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  if (pathnameHasLocale) return null

  // Redirect if there is no locale
  const locale = defaultLocale
  return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url))
}

