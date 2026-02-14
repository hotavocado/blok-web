import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get or create user from Clerk auth
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    console.log("Identity received:", identity);
    if (!identity) {
      console.error("No identity found in ctx.auth");
      throw new Error("Not authenticated");
    }

    // Check if user already exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user !== null) {
      // User exists, update if needed
      if (
        user.name !== identity.name ||
        user.email !== identity.email ||
        user.avatarUrl !== identity.pictureUrl
      ) {
        await ctx.db.patch(user._id, {
          name: identity.name || "Unknown",
          email: identity.email || "",
          avatarUrl: identity.pictureUrl,
        });
      }
      return user._id;
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      clerkId: identity.subject,
      name: identity.name || "Unknown",
      email: identity.email || "",
      avatarUrl: identity.pictureUrl,
      createdAt: Date.now(),
    });

    return userId;
  },
});

// Get current authenticated user
export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});
