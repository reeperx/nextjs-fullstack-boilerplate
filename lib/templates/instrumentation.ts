export async function register() {
  // Initialize your observability provider here
  if (process.env.NODE_ENV === "production") {
    // Example: Initialize Sentry
    // const Sentry = await import('@sentry/nextjs');
    // Sentry.init({
    //   dsn: process.env.SENTRY_DSN,
    //   tracesSampleRate: 1.0,
    // });
  }
}

export async function onRequestError(err, request, context) {
  // Log the error
  console.error("Server error:", err)

  // Send to your observability provider
  if (process.env.NODE_ENV === "production") {
    // Example: Send to Sentry
    // const Sentry = await import('@sentry/nextjs');
    // Sentry.captureException(err, {
    //   extra: {
    //     url: request.url,
    //     method: request.method,
    //     context,
    //   },
    // });

    // Or send to your own API
    try {
      await fetch("/api/logging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: err.message,
          stack: err.stack,
          url: request.url,
          method: request.method,
          context,
        }),
      })
    } catch (e) {
      // Silently fail if logging API is down
      console.error("Failed to log error to API:", e)
    }
  }
}

