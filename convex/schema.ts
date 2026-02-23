import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - synced with Clerk
  users: defineTable({
    clerkId: v.string(), // Clerk user ID
    name: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  // Groups/Organizations table
  groups: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdBy: v.id("users"),
    createdAt: v.number(),
  }).index("by_creator", ["createdBy"]),

  // Group members junction table
  groupMembers: defineTable({
    groupId: v.id("groups"),
    userId: v.id("users"),
    role: v.union(v.literal("admin"), v.literal("member")),
    joinedAt: v.number(),
  })
    .index("by_group", ["groupId"])
    .index("by_user", ["userId"])
    .index("by_group_and_user", ["groupId", "userId"]),

  // Calendar events table
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    createdBy: v.id("users"),
    groupId: v.optional(v.id("groups")), // Optional - personal vs group event
    isAllDay: v.boolean(),
    location: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_creator", ["createdBy"])
    .index("by_group", ["groupId"])
    .index("by_start_time", ["startTime"]),

  // Event attendees junction table
  eventAttendees: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
    status: v.union(
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("pending")
    ),
    addedAt: v.number(),
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_and_user", ["eventId", "userId"]),

  // Friend requests table
  friendRequests: defineTable({
    fromUserId: v.id("users"), // User who sent the request
    toUserId: v.id("users"),   // User who received the request
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("ignored")
    ),
    createdAt: v.number(),
  })
    .index("by_from_user", ["fromUserId"])
    .index("by_to_user", ["toUserId"])
    .index("by_from_and_to", ["fromUserId", "toUserId"])
    .index("by_status", ["status"]),

  // Friends table (accepted friendships)
  friends: defineTable({
    userId1: v.id("users"), // Always the smaller ID
    userId2: v.id("users"), // Always the larger ID
    createdAt: v.number(),
  })
    .index("by_user1", ["userId1"])
    .index("by_user2", ["userId2"])
    .index("by_users", ["userId1", "userId2"]),
});
