import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AiGenerator } from "@/components/ai-generator";

export const Route = createFileRoute("/notes")({ component: NotesPage });

function NotesPage() {
  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Turn raw meeting notes or transcripts into a crisp summary with action items."
    >
      <AiGenerator
        title="Summarize"
        description="Paste your notes or transcript."
        system="You are an executive assistant. Summarize meeting notes in markdown with sections: TL;DR, Key Decisions, Action Items (with owners if mentioned, and due dates), Open Questions, and Next Steps."
        cta="Summarize"
        fields={[
          { name: "context", label: "Meeting context (optional)", placeholder: "Title, attendees, purpose", rows: 2 },
          { name: "notes", label: "Raw notes / transcript", placeholder: "Paste your notes here…", required: true, rows: 12 },
        ]}
        buildPrompt={(v) =>
          `Meeting context: ${v.context || "(not provided)"}\n\nRaw notes:\n${v.notes}`
        }
      />
    </AppShell>
  );
}