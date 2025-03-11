import { authMiddleware } from "@clerk/nextjs"
import { NextResponse } from "next/server"
import { i18nMiddleware } from "./lib/i18n-middleware"
import { securityHeadersMiddleware } from "./lib/security-headers"
import { rateLimitMiddleware } from "./lib/rate-limit"
import { serverLogger } from "./lib/server-logger"

// Combine multiple middleware functions
const combinedMiddleware = (request) => {
  // Log request
  serverLogger.info("Incoming request", {
    url: request.url,
    method: request.method,
  })

  // Apply security headers
  const securityResponse = securityHeadersMiddleware(request)
  if (securityResponse) return securityResponse

  // Apply rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const rateLimitResponse = rateLimitMiddleware(request)
    if (rateLimitResponse) return rateLimitResponse
  }

  // Apply i18n middleware
  const i18nResponse = i18nMiddleware(request)
  if (i18nResponse) return i18nResponse

  return NextResponse.next()
}

// Clerk auth middleware
export default authMiddleware({
  publicRoutes: ["/", "/sign-in(.*)", "/sign-up(.*)", "/api/webhooks(.*)", "/docs(.*)", "/(en|es|fr)(.*)"],
  beforeAuth: (req) => combinedMiddleware(req),
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

