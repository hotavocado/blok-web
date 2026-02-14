# Claude API Setup for AI Agent

## Get API Key
1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-`)

## Backend Setup Options

### Option 1: Convex Action (Recommended - already using Convex)

Create `/convex/chat.ts`:

```typescript
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
          description: "Navigate to a different page in the app",
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
          description: "Sign out the current user",
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
        ...(toolUse.name === "navigate" && { page: toolUse.input.page }),
      };

      return {
        content: `Sure, I'll ${toolUse.name === "navigate" ? `navigate to ${toolUse.input.page}` : "sign you out"}.`,
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
```

Then add to `.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### Option 2: Express API Route

If you want a separate backend, create an Express server with this endpoint.

## Update Frontend to Use Convex

In `ChatBubble.js`, replace the fetch call with:

```javascript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

// In component:
const sendMessage = useMutation(api.chat.sendMessage);

// In handleSend:
const data = await sendMessage({ messages: [...messages, userMessage] });
```

## Testing

Once set up, you can ask:
- "Go to the discover page"
- "Switch to bloks"
- "Sign me out"
- General questions about the app

The AI will understand context and execute the appropriate actions.
