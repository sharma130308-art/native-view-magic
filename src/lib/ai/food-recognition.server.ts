import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateText } from "ai";
import { z } from "zod";

import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "./run-id.server";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "google/gemini-3-flash-preview";

const bodySchema = z
  .object({
    image: z
      .string()
      .regex(/^data:image\/(png|jpeg|webp|heic|heif);base64,/, "Photo must be a PNG, JPEG, WebP or HEIC image")
      .max(12_000_000, "Photo is too large")
      .optional(),
    description: z.string().max(2000).optional(),
  })
  .refine((b) => b.image || b.description?.trim(), { message: "Provide a photo or a description" });

const foodSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string(),
        serving: z.string(),
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fat: z.number(),
      }),
    )
    .min(1),
  notes: z.string().optional(),
});

const SYSTEM = `You are a nutritionist AI for a calorie-tracking app. Identify every food and drink visible in the photo (or described in the text), estimate realistic portion sizes, and return nutrition per item.
Rules:
- Estimate calories, protein, carbs and fat in grams for the portion shown, not per 100g.
- serving is a short human portion like "1 bowl (~300g)" or "2 slices".
- If the photo shows no recognizable food, return one item named "Unrecognized" with zeros and explain in notes.
- Be conservative: when unsure between two portion sizes, pick the middle.
Respond with ONLY valid JSON, no markdown fences, exactly this shape:
{"items":[{"name":"Grilled chicken breast","serving":"1 piece (~170g)","calories":280,"protein":53,"carbs":0,"fat":6}],"notes":"optional short note"}
All nutrition values must be plain numbers.`;

export async function handleFoodRecognition(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return Response.json({ error: "AI is not configured." }, { status: 401 });

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch (error) {
    const message = error instanceof z.ZodError ? error.errors[0]?.message : "Invalid request";
    return Response.json({ error: message ?? "Invalid request" }, { status: 400 });
  }

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAICompatible({
    name: "lovable",
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const content: Array<{ type: "text"; text: string } | { type: "image"; image: URL }> = [];
  if (body.description?.trim()) {
    content.push({ type: "text", text: `User description: ${body.description.trim()}` });
  } else {
    content.push({ type: "text", text: "What food is in this photo? Estimate the nutrition." });
  }
  if (body.image) content.push({ type: "image", image: new URL(body.image) });

  try {
    const result = await generateObject({
      model: provider.chatModel(MODEL),
      schema: foodSchema,
      system: SYSTEM,
      messages: [{ role: "user", content }],
      maxRetries: 0,
      abortSignal: request.signal,
    });
    return withLovableAiGatewayRunIdHeader(Response.json(result.object), runIdFetch);
  } catch (error) {
    const e = error as { statusCode?: number; message?: string };
    const status = e.statusCode ?? 500;
    return Response.json({ error: e.message ?? "Food recognition failed" }, { status });
  }
}
