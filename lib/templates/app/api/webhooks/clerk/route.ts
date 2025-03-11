import { Webhook } from "svix"
import { headers } from "next/headers"
import type { WebhookEvent } from "@clerk/nextjs/server"
import { createLogger } from "@/lib/logger"

const logger = createLogger("clerk-webhook")

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    logger.error("Missing svix headers")
    return new Response("Missing svix headers", { status: 400 })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "")

  let evt: WebhookEvent

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    logger.error("Error verifying webhook", { error: err })
    return new Response("Error verifying webhook", { status: 400 })
  }

  // Get the event type
  const eventType = evt.type
  logger.info(`Webhook received: ${eventType}`)

  // Handle the event
  try {
    switch (eventType) {
      case "user.created":
        // Create user in your database
        await handleUserCreated(evt.data)
        break
      case "user.updated":
        // Update user in your database
        await handleUserUpdated(evt.data)
        break
      case "user.deleted":
        // Delete user from your database
        await handleUserDeleted(evt.data)
        break
      // Add more event types as needed
    }

    return new Response("Webhook processed successfully", { status: 200 })
  } catch (error) {
    logger.error("Error processing webhook", { error, eventType })
    return new Response("Error processing webhook", { status: 500 })
  }
}

async function handleUserCreated(data: any) {
  // Implement user creation logic
  logger.info("User created", { userId: data.id })
}

async function handleUserUpdated(data: any) {
  // Implement user update logic
  logger.info("User updated", { userId: data.id })
}

async function handleUserDeleted(data: any) {
  // Implement user deletion logic
  logger.info("User deleted", { userId: data.id })
}

