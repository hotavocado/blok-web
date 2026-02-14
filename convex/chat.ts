import { action } from "./_generated/server";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const sendMessage = action({
  args: {
    messages: v.array(v.object({
      role: v.string(),
      content: v.string(),
    })),
  },
  handler: async (ctx, { messages }) => {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      tools: [
        {
          name: "navigate",
          description: "Navigate to a different page in the app. Available pages: me (user profile), bloks (main bloks feed), discover (search and explore), friends (friends list)",
          input_schema: {
            type: "object",
            properties: {
              page: {
                type: "string",
                enum: ["me", "bloks", "discover", "friends"],
                description: "The page to navigate to",
              },
            },
            required: ["page"],
          },
        },
        {
          name: "sign_out",
          description: "Sign out the current user from the application",
          input_schema: {
            type: "object",
            properties: {},
          },
        },
      ],
      messages: messages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    });

    // Check if Claude wants to use a tool
    const toolUse = response.content.find(
      (block) => block.type === "tool_use"
    );

    if (toolUse && toolUse.type === "tool_use") {
      const action = {
        type: toolUse.name === "navigate" ? "navigate" : "signOut",
        ...(toolUse.name === "navigate" && { page: (toolUse.input as any).page }),
      };

      return {
        content: `Sure, I'll ${toolUse.name === "navigate" ? `take you to ${(toolUse.input as any).page}` : "sign you out"}.`,
        action,
      };
    }

    // Return text response
    const textBlock = response.content.find((block) => block.type === "text");
    return {
      content: textBlock && textBlock.type === "text" ? textBlock.text : "I'm not sure how to help with that.",
      action: null,
    };
  },
});
