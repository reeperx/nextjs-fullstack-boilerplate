import { NextResponse } from "next/server"
import { createTransport } from "nodemailer"
import { rateLimitMiddleware } from "@/lib/rate-limit"
import { createLogger } from "@/lib/logger"

const logger = createLogger("email-api")

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimitMiddleware(request)
    if (rateLimitResult) {
      return rateLimitResult
    }

    // Parse the request body
    const { to, subject, html, text } = await request.json()

    // Validate the request
    if (!to || !subject || (!html && !text)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create a Nodemailer transporter
    const transporter = createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Send the email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    })

    logger.info("Email sent successfully", { messageId: info.messageId, to })

    return NextResponse.json({ success: true, messageId: info.messageId })
  } catch (error) {
    logger.error("Error sending email", { error: error.message })
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}

