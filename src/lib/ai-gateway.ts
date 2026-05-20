import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export const createLovableAiGatewayProvider = (lovableApiKey: string) =>
  createOpenAICompatible({
    name: "lovable",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: {
      "Lovable-API-Key": lovableApiKey,
      "X-Lovable-AIG-SDK": "vercel-ai-sdk",
    },
  });

export const DEFAULT_MODEL = "google/gemini-3-flash-preview";

export function getLovableApiKey(): string | undefined {
  // Cloudflare worker env or node process.env
  return (
    (globalThis as any)?.process?.env?.LOVABLE_API_KEY ??
    (typeof process !== "undefined" ? process.env?.LOVABLE_API_KEY : undefined)
  );
}