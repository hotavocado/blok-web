import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all users
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

// Get user by ID
export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Search users by name or email
export const search = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allUsers = await ctx.db.query("users").collect();
    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(args.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});

// Create a new user
export const create = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      avatarUrl: args.avatarUrl,
      bio: args.bio,
      createdAt: Date.now(),
    });
    return userId;
  },
});

// Update user
export const update = mutation({
  args: {
    userId: v.id("users"),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    await ctx.db.patch(userId, updates);
  },
});
