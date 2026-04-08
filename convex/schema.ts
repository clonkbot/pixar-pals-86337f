import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  videos: defineTable({
    userId: v.id("users"),
    title: v.string(),
    prompt: v.string(),
    videoBase64: v.optional(v.string()),
    thumbnailBase64: v.optional(v.string()),
    status: v.union(
      v.literal("generating_thumbnail"),
      v.literal("generating_video"),
      v.literal("completed"),
      v.literal("failed")
    ),
    errorMessage: v.optional(v.string()),
    aspectRatio: v.union(v.literal("16:9"), v.literal("9:16")),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]).index("by_user_and_status", ["userId", "status"]),
});
