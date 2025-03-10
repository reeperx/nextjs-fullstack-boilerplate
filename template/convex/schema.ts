import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    onboardingCompleted: v.boolean(),
  }).index("by_clerk_id", ["clerkId"]),
  
  profiles: defineTable({
    userId: v.id("users"),
    bio: v.optional(v.string()),
    location: v.optional(v.string()),
    website: v.optional(v.string()),
    socialLinks: v.optional(v.array(v.object({
      platform: v.string(),
      url: v.string(),
    }))),
  }).index("by_user_id", ["userId"]),
  
  subscriptions: defineTable({
    userId: v.id("users"),
    status: v.string(), // active, canceled, etc.
    plan: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    paymentMethod: v.string(), // paypal, payfast, etc.
    paymentId: v.string(),
  }).index("by_user_id", ["userId"]),
  
  payments: defineTable({
    userId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    status: v.string(), // completed, failed, etc.
    provider: v.string(), // paypal, payfast, etc.
    transactionId: v.string(),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"]),
  
  emailLogs: defineTable({
    userId: v.optional(v.id("users")),
    to: v.string(),
    subject: v.string(),
    body: v.string(),
    sentAt: v.number(),
    status: v.string(), // sent, failed, etc.
  }).index("by_user_id", ["userId"]),
});