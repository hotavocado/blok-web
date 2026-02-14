import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get events for a user (their personal events + group events)
export const getUserEvents = query({
  args: {
    userId: v.id("users"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let eventsQuery = ctx.db.query("events");

    // Filter by date range if provided
    if (args.startDate) {
      eventsQuery = eventsQuery.filter((q) =>
        q.gte(q.field("startTime"), args.startDate)
      );
    }
    if (args.endDate) {
      eventsQuery = eventsQuery.filter((q) =>
        q.lte(q.field("endTime"), args.endDate)
      );
    }

    const allEvents = await eventsQuery.collect();

    // Filter for events user created or is attending
    const userEvents = [];
    for (const event of allEvents) {
      if (event.createdBy === args.userId) {
        userEvents.push(event);
        continue;
      }

      const attendance = await ctx.db
        .query("eventAttendees")
        .withIndex("by_event_and_user", (q) =>
          q.eq("eventId", event._id).eq("userId", args.userId)
        )
        .first();

      if (attendance) {
        userEvents.push({ ...event, attendanceStatus: attendance.status });
      }
    }

    return userEvents;
  },
});

// Get events for a group
export const getGroupEvents = query({
  args: { groupId: v.id("groups") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
      .collect();
  },
});

// Get event by ID with attendees
export const getById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event) return null;

    const attendees = await ctx.db
      .query("eventAttendees")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    const attendeesWithDetails = await Promise.all(
      attendees.map(async (attendee) => {
        const user = await ctx.db.get(attendee.userId);
        return { ...user, status: attendee.status };
      })
    );

    return { ...event, attendees: attendeesWithDetails };
  },
});

// Create an event
export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.number(),
    createdBy: v.id("users"),
    groupId: v.optional(v.id("groups")),
    isAllDay: v.boolean(),
    location: v.optional(v.string()),
    attendeeIds: v.optional(v.array(v.id("users"))),
  },
  handler: async (ctx, args) => {
    const { attendeeIds, ...eventData } = args;

    const eventId = await ctx.db.insert("events", {
      ...eventData,
      createdAt: Date.now(),
    });

    // Add attendees if provided
    if (attendeeIds && attendeeIds.length > 0) {
      for (const userId of attendeeIds) {
        await ctx.db.insert("eventAttendees", {
          eventId,
          userId,
          status: "pending",
          addedAt: Date.now(),
        });
      }
    }

    return eventId;
  },
});

// Update event
export const update = mutation({
  args: {
    eventId: v.id("events"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    isAllDay: v.optional(v.boolean()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { eventId, ...updates } = args;
    await ctx.db.patch(eventId, updates);
  },
});

// Delete event
export const remove = mutation({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    // Delete all attendees first
    const attendees = await ctx.db
      .query("eventAttendees")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .collect();

    for (const attendee of attendees) {
      await ctx.db.delete(attendee._id);
    }

    // Delete the event
    await ctx.db.delete(args.eventId);
  },
});

// Respond to event invitation
export const respondToInvite = mutation({
  args: {
    eventId: v.id("events"),
    userId: v.id("users"),
    status: v.union(
      v.literal("accepted"),
      v.literal("declined"),
      v.literal("pending")
    ),
  },
  handler: async (ctx, args) => {
    const attendance = await ctx.db
      .query("eventAttendees")
      .withIndex("by_event_and_user", (q) =>
        q.eq("eventId", args.eventId).eq("userId", args.userId)
      )
      .first();

    if (attendance) {
      await ctx.db.patch(attendance._id, { status: args.status });
    }
  },
});
