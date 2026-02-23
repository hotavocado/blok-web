import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Search users by name or email
export const searchUsers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const searchLower = args.searchTerm.toLowerCase();
    
    // Get all users (in a real app, you'd want pagination)
    const allUsers = await ctx.db.query("users").collect();
    
    // Filter by name or email, exclude current user
    const matchingUsers = allUsers.filter(user => 
      user._id !== currentUser._id &&
      (user.name.toLowerCase().includes(searchLower) || 
       user.email.toLowerCase().includes(searchLower))
    );

    // For each user, check if there's a pending request or if they're already friends
    const usersWithStatus = await Promise.all(
      matchingUsers.map(async (user) => {
        // Check for existing friend request (either direction)
        const sentRequest = await ctx.db
          .query("friendRequests")
          .withIndex("by_from_and_to", (q) => 
            q.eq("fromUserId", currentUser._id).eq("toUserId", user._id)
          )
          .filter((q) => q.eq(q.field("status"), "pending"))
          .first();

        const receivedRequest = await ctx.db
          .query("friendRequests")
          .withIndex("by_from_and_to", (q) => 
            q.eq("fromUserId", user._id).eq("toUserId", currentUser._id)
          )
          .filter((q) => q.eq(q.field("status"), "pending"))
          .first();

        // Check if already friends
        const [smallerId, largerId] = [currentUser._id, user._id].sort();
        const friendship = await ctx.db
          .query("friends")
          .withIndex("by_users", (q) => q.eq("userId1", smallerId).eq("userId2", largerId))
          .first();

        let status = "none";
        if (friendship) {
          status = "friends";
        } else if (sentRequest) {
          status = "pending";
        } else if (receivedRequest) {
          status = "received";
        }

        return {
          ...user,
          requestStatus: status,
        };
      })
    );

    return usersWithStatus;
  },
});

// Send friend request
export const sendFriendRequest = mutation({
  args: { toUserId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    // Check if request already exists
    const existingRequest = await ctx.db
      .query("friendRequests")
      .withIndex("by_from_and_to", (q) => 
        q.eq("fromUserId", currentUser._id).eq("toUserId", args.toUserId)
      )
      .first();

    if (existingRequest) {
      throw new Error("Friend request already sent");
    }

    // Create friend request
    await ctx.db.insert("friendRequests", {
      fromUserId: currentUser._id,
      toUserId: args.toUserId,
      status: "pending",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Cancel friend request
export const cancelFriendRequest = mutation({
  args: { toUserId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const request = await ctx.db
      .query("friendRequests")
      .withIndex("by_from_and_to", (q) => 
        q.eq("fromUserId", currentUser._id).eq("toUserId", args.toUserId)
      )
      .filter((q) => q.eq(q.field("status"), "pending"))
      .first();

    if (request) {
      await ctx.db.delete(request._id);
    }

    return { success: true };
  },
});

// Get pending friend requests (received)
export const getPendingRequests = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) return [];

    // Get all pending requests sent to current user
    const requests = await ctx.db
      .query("friendRequests")
      .withIndex("by_to_user", (q) => q.eq("toUserId", currentUser._id))
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    // Get user details for each request
    const requestsWithUsers = await Promise.all(
      requests.map(async (request) => {
        const fromUser = await ctx.db.get(request.fromUserId);
        return {
          requestId: request._id,
          user: fromUser,
          createdAt: request.createdAt,
        };
      })
    );

    return requestsWithUsers;
  },
});

// Accept friend request
export const acceptFriendRequest = mutation({
  args: { requestId: v.id("friendRequests") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");
    if (request.toUserId !== currentUser._id) throw new Error("Not authorized");

    // Update request status
    await ctx.db.patch(args.requestId, { status: "accepted" });

    // Create friendship (always store smaller ID first)
    const [smallerId, largerId] = [request.fromUserId, request.toUserId].sort();
    await ctx.db.insert("friends", {
      userId1: smallerId,
      userId2: largerId,
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Ignore friend request
export const ignoreFriendRequest = mutation({
  args: { requestId: v.id("friendRequests") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) throw new Error("User not found");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");
    if (request.toUserId !== currentUser._id) throw new Error("Not authorized");

    // Update request status to ignored
    await ctx.db.patch(args.requestId, { status: "ignored" });

    return { success: true };
  },
});

// Get friends list
export const getFriends = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!currentUser) return [];

    // Get all friendships where current user is involved
    const friendships1 = await ctx.db
      .query("friends")
      .withIndex("by_user1", (q) => q.eq("userId1", currentUser._id))
      .collect();

    const friendships2 = await ctx.db
      .query("friends")
      .withIndex("by_user2", (q) => q.eq("userId2", currentUser._id))
      .collect();

    const allFriendships = [...friendships1, ...friendships2];

    // Get friend user objects
    const friends = await Promise.all(
      allFriendships.map(async (friendship) => {
        const friendId = friendship.userId1 === currentUser._id 
          ? friendship.userId2 
          : friendship.userId1;
        const friend = await ctx.db.get(friendId);
        return {
          ...friend,
          friendshipCreatedAt: friendship.createdAt,
        };
      })
    );

    return friends;
  },
});
