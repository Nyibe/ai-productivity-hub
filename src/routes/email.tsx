import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AiGenerator } from "@/components/ai-generator";

export const Route = createFileRoute("/email")({ component: EmailPage });

function EmailPage() {
  return (
    <AppShell
      title="Smart Email Generator"
      description="Draft polished, on-tone emails in seconds."
    >
      <AiGenerator
        title="Compose"
        description="Describe the email you need."
        system="You are an expert business writer. Produce a clear, well-structured email in markdown with subject line, greeting, body, and sign-off. Match the requested tone."
        cta="Draft email"
        fields={[
          { name: "recipient", label: "Recipient & context", placeholder: "e.g. Manager — follow-up after Tuesday's planning meeting", required: true, rows: 2 },
          { name: "purpose", label: "Purpose / key points", placeholder: "What should the email accomplish? Key points to include.", required: true, rows: 5 },
          { name: "tone", label: "Tone", placeholder: "professional, friendly, concise…", rows: 1 },
        ]}
        buildPrompt={(v) =>
          `Write an email.\n\nRecipient & context: ${v.recipient}\n\nPurpose & key points:\n${v.purpose}\n\nTone: ${v.tone || "professional and concise"}`
        }
      />
    </AppShell>
  );
}