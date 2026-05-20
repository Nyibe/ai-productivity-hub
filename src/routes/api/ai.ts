import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, generateText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL, getLovableApiKey } from "@/lib/ai-gateway";

type BodyChat = { mode: "chat"; messages: UIMessage[]; system?: string };
type BodyGenerate = { mode: "generate"; system: string; prompt: string };
type Body = BodyChat | BodyGenerate;

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const key = getLovableApiKey();
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const body = (await request.json()) as Body;
        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway(DEFAULT_MODEL);

        try {
          if (body.mode === "chat") {
            const result = streamText({
              model,
              system:
                body.system ??
                "You are a helpful AI workplace productivity assistant. Be concise, structured, and professional. Use markdown.",
              messages: await convertToModelMessages(body.messages),
            });
            return result.toUIMessageStreamResponse({ originalMessages: body.messages });
          }

          const { text } = await generateText({
            model,
            system: body.system,
            prompt: body.prompt,
          });
          return Response.json({ text });
        } catch (err: any) {
          const status = err?.statusCode ?? err?.status ?? 500;
          const message =
            status === 429
              ? "Rate limit reached. Please try again shortly."
              : status === 402
                ? "AI credits exhausted. Add credits in Settings → Workspace → Usage."
                : (err?.message ?? "AI request failed");
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});