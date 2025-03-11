import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  profiles: defineTable({
    userId: v.string(),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    preferences: v.optional(
      v.object({
        theme: v.optional(v.string()),
        language: v.optional(v.string()),
        notifications: v.optional(v.boolean()),
      }),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  subscriptions: defineTable({
    userId: v.string(),
    plan: v.string(),
    status: v.string(),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    paymentMethod: v.string(),
    paymentId: v.string(),
    amount: v.number(),
    currency: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  payments: defineTable({
    userId: v.string(),
    subscriptionId: v.optional(v.id("subscriptions")),
    amount: v.number(),
    currency: v.string(),
    status: v.string(),
    provider: v.string(),
    providerPaymentId: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  emails: defineTable({
    userId: v.string(),
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    status: v.string(),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),
})

