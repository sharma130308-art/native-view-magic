import { createFileRoute } from "@tanstack/react-router";

import { handlePreviewDoctor } from "@/lib/ai/preview-doctor.server";

export const Route = createFileRoute("/api/preview-doctor")({
  server: { handlers: { POST: ({ request }) => handlePreviewDoctor(request) } },
});
