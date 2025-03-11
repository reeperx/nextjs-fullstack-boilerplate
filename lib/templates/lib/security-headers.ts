import { NextResponse } from "next/server"

export function securityHeadersMiddleware(request: Request) {
  // Only apply security headers to HTML responses
  if (!request.url.includes("/_next/") && !request.url.includes("/api/")) {
    const response = NextResponse.next()

    // Set security headers
    const headers = response.headers

    // Content Security Policy
    headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://*.clerk.accounts.dev https://*.convex.cloud;",
    )

    // XSS Protection
    headers.set("X-XSS-Protection", "1; mode=block")

    // Content Type Options
    headers.set("X-Content-Type-Options", "nosniff")

    // Frame Options
    headers.set("X-Frame-Options", "DENY")

    // Referrer Policy
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

    // Permissions Policy
    headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

    return response
  }

  return null
}

