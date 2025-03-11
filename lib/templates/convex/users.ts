import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Get a user by Clerk ID
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()
  },
})

// Create a new user
export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now()

    const userId = await ctx.db.insert("users", {
      userId: args.userId,
      email: args.email,
      name: args.name,
      imageUrl: args.imageUrl,
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    // Create a default profile for the user
    await ctx.db.insert("profiles", {
      userId: args.userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    })

    return userId
  },
})

// Update a user
export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    return await ctx.db.patch(user._id, {
      name: args.name,
      imageUrl: args.imageUrl,
      updatedAt: Date.now(),
    })
  },
})

// Delete a user
export const deleteUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    if (!user) {
      throw new Error("User not found")
    }

    // Delete the user's profile
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first()

    if (profile) {
      await ctx.db.delete(profile._id)
    }

    // Delete the user
    return await ctx.db.delete(user._id)
  },
})

