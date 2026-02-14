import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all groups
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("groups").collect();
  },
});

// Get group by ID with creator info
export const getById = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);
    if (!group) return null;
    
    const creator = await ctx.db.get(group.createdBy);
    return { ...group, creator };
  },
});

// Get groups for a user (where they're a member)
export const getUserGroups = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const groups = await Promise.all(
      memberships.map(async (membership) => {
        const group = await ctx.db.get(membership.groupId);
        return { ...group, role: membership.role };
      })
    );

    return groups.filter((g) => g !== null);
  },
});

// Get group members
export const getMembers = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("groupMembers")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();

    const members = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        return { ...user, role: membership.role, joinedAt: membership.joinedAt };
      })
    );

    return members.filter((m) => m !== null);
  },
});

// Create a group
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
  },
  handler: async (ctx, args) => {
    const groupId = await ctx.db.insert("groups", {
      name: args.name,
      description: args.description,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    });

    // Add creator as admin
    await ctx.db.insert("groupMembers", {
      groupId,
      userId: args.createdBy,
      role: "admin",
      joinedAt: Date.now(),
    });

    return groupId;
  },
});

// Add member to group
export const addMember = mutation({
  args: {
    groupId: v.id("groups"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    // Check if already a member
    const existing = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", args.userId)
      )
      .first();

    if (existing) {
      throw new Error("User is already a member of this group");
    }

    await ctx.db.insert("groupMembers", {
      groupId: args.groupId,
      userId: args.userId,
      role: args.role,
      joinedAt: Date.now(),
    });
  },
});

// Remove member from group
export const removeMember = mutation({
  args: {
    groupId: v.id("groups"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const membership = await ctx.db
      .query("groupMembers")
      .withIndex("by_group_and_user", (q) =>
        q.eq("groupId", args.groupId).eq("userId", args.userId)
      )
      .first();

    if (membership) {
      await ctx.db.delete(membership._id);
    }
  },
});
