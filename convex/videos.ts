import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("videos")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) return null;
    return video;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    prompt: v.string(),
    aspectRatio: v.union(v.literal("16:9"), v.literal("9:16")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db.insert("videos", {
      userId,
      title: args.title,
      prompt: args.prompt,
      aspectRatio: args.aspectRatio,
      status: "generating_thumbnail",
      createdAt: Date.now(),
    });
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("videos"),
    status: v.union(
      v.literal("generating_thumbnail"),
      v.literal("generating_video"),
      v.literal("completed"),
      v.literal("failed")
    ),
    thumbnailBase64: v.optional(v.string()),
    videoBase64: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.status === "completed") {
      updateData.completedAt = Date.now();
    }
    await ctx.db.patch(id, updateData);
  },
});

export const remove = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

export const generateVideo = action({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    const video = await ctx.runQuery(api.videos.get, { id: args.videoId });
    if (!video) throw new Error("Video not found");

    const pixarPrompt = `Pixar-style 3D animated scene for kids: ${video.prompt}. Bright colorful lighting, friendly characters with big expressive eyes, smooth animation, heartwarming atmosphere, suitable for young children, cheerful and magical mood.`;

    try {
      // First generate a thumbnail image
      const thumbnailBase64 = await ctx.runAction(api.ai.generateImage, {
        prompt: pixarPrompt + " Single frame, movie poster style.",
      });

      if (thumbnailBase64) {
        await ctx.runMutation(api.videos.updateStatus, {
          id: args.videoId,
          status: "generating_video",
          thumbnailBase64,
        });
      } else {
        await ctx.runMutation(api.videos.updateStatus, {
          id: args.videoId,
          status: "generating_video",
        });
      }

      // Now generate the video
      const videoBase64 = await ctx.runAction(api.ai.generateVideo, {
        prompt: pixarPrompt,
        aspectRatio: video.aspectRatio,
        referenceImage: thumbnailBase64 || undefined,
      });

      await ctx.runMutation(api.videos.updateStatus, {
        id: args.videoId,
        status: "completed",
        videoBase64,
      });

    } catch (error) {
      await ctx.runMutation(api.videos.updateStatus, {
        id: args.videoId,
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  },
});
