import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AiGenerator } from "@/components/ai-generator";

export const Route = createFileRoute("/research")({ component: ResearchPage });

function ResearchPage() {
  return (
    <AppShell
      title="AI Research Assistant"
      description="Get a structured briefing on any topic. Always verify with primary sources."
    >
      <AiGenerator
        title="Research"
        description="What do you want to learn about?"
        system="You are a research analyst. Produce a markdown briefing with: Executive Summary, Background, Key Concepts, Current Landscape, Opportunities & Risks, and Suggested Next Steps. Flag uncertainty explicitly and avoid fabricating citations."
        cta="Generate briefing"
        fields={[
          { name: "topic", label: "Topic / question", placeholder: "e.g. Best practices for async stand-ups in distributed teams", required: true, rows: 3 },
          { name: "audience", label: "Audience & depth", placeholder: "e.g. Exec summary for non-technical leadership", rows: 2 },
        ]}
        buildPrompt={(v) =>
          `Topic: ${v.topic}\n\nAudience & depth: ${v.audience || "general professional audience"}`
        }
      />
    </AppShell>
  );
}