import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AiGenerator } from "@/components/ai-generator";

export const Route = createFileRoute("/planner")({ component: PlannerPage });

function PlannerPage() {
  return (
    <AppShell
      title="AI Task Planner"
      description="Break a goal into an actionable, prioritized plan."
    >
      <AiGenerator
        title="Plan"
        description="Describe what you want to accomplish."
        system="You are a productivity coach. Produce a structured plan in markdown with: Objective, Milestones, Day-by-day Task List (with priority P1/P2/P3 and time estimates), Dependencies, and Risks. Keep it realistic."
        cta="Build plan"
        fields={[
          { name: "goal", label: "Goal", placeholder: "e.g. Launch internal onboarding portal in 3 weeks", required: true, rows: 3 },
          { name: "constraints", label: "Constraints / context", placeholder: "Team size, deadlines, tools, blockers…", rows: 4 },
        ]}
        buildPrompt={(v) =>
          `Goal: ${v.goal}\n\nConstraints & context: ${v.constraints || "(none provided)"}`
        }
      />
    </AppShell>
  );
}