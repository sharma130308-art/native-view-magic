import { createFileRoute } from "@tanstack/react-router";

import { handleFoodRecognition } from "@/lib/ai/food-recognition.server";

export const Route = createFileRoute("/api/food-recognition")({
  server: {
    handlers: {
      POST: ({ request }) => handleFoodRecognition(request),
    },
  },
});
