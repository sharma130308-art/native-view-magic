import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { z } from "zod";

import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

const bodySchema = z.object({
  image: z
    .string()
    .regex(/^data:image\/(png|jpeg|webp|gif);base64,/, "Screenshot must be a PNG, JPEG, WebP or GIF image")
    .max(12_000_000, "Screenshot is too large"),
  notes: z.string().max(2000).optional(),
});

const SYSTEM = `You diagnose why a mobile "native preview" of an app (a web recreation of a Flutter app shown in a phone-sized viewport) is not visible or looks blank/broken.
You only diagnose — never claim to have changed anything. Look at the screenshot carefully and answer in Markdown with these sections:
## What I see
## Most likely cause
## Other possible causes
## How to check / fix
Consider: blank white page, build/compile errors, runtime error overlays, missing images, content clipped by viewport height or safe areas, zero-size containers, wrong viewport (desktop vs mobile), dark text on dark background, loading spinners stuck, wrong URL/route, 404 pages. Be concise and specific to what is visible.`;

export async function handlePreviewDoctor(request: Request) {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 401 });

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch (error) {
    const message = error instanceof z.ZodError ? error.errors[0]?.message : "Invalid request";
    return Response.json({ error: message ?? "Invalid request" }, { status: 400 });
  }

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  let upstreamError: { status: number; message: string } | undefined;
  const result = streamText({
    model: provider.responses(MODEL),
    system: SYSTEM,
    maxRetries: 0,
    abortSignal: request.signal,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: body.notes?.trim()
              ? `Developer notes: ${body.notes.trim()}`
              : "Why is this native preview not visible?",
          },
          { type: "image", image: new URL(body.image) },
        ],
      },
    ],
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "medium",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
    onError: ({ error }) => {
      const e = error as { statusCode?: number; message?: string };
      upstreamError = { status: e.statusCode ?? 500, message: e.message ?? "AI request failed" };
    },
  });

  const response = result.toTextStreamResponse({
    headers: { "Cache-Control": "no-cache, no-transform" },
  });
  void upstreamError;
  return withLovableAiGatewayRunIdHeader(response, runIdFetch);
}
