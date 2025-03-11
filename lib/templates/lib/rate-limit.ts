import { NextResponse } from "next/server"
import { createLogger } from "./logger"

const logger = createLogger("rate-limit")

// Simple in-memory store for rate limiting
// In production, use Redis or another distributed store
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  limit?: number
  windowMs?: number
}

export async function rateLimitMiddleware(request: Request, options: RateLimitOptions = {}) {
  const { limit = 100, windowMs = 60 * 1000 } = options

  // Get client IP
  const ip = request.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()

  // Get or initialize request count for this IP
  let requestData = ipRequestCounts.get(ip)
  if (!requestData || now > requestData.resetTime) {
    requestData = { count: 0, resetTime: now + windowMs }
    ipRequestCounts.set(ip, requestData)
  }

  // Increment request count
  requestData.count++

  // Check if limit is exceeded
  if (requestData.count > limit) {
    logger.warn(`Rate limit exceeded for IP: ${ip}`)

    // Return 429 Too Many Requests
    return NextResponse.json(
      { error: "Too many requests, please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": `${Math.ceil((requestData.resetTime - now) / 1000)}`,
          "X-RateLimit-Limit": `${limit}`,
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": `${Math.ceil(requestData.resetTime / 1000)}`,
        },
      },
    )
  }

  // Continue with the request
  return null
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now > data.resetTime) {
      ipRequestCounts.delete(ip)
    }
  }
}, 60 * 1000) // Clean up every minute

