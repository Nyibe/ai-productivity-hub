import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, FileText, ListChecks, Search, MessageSquare, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  component: Index,
});

const tools = [
  { to: "/email", title: "Smart Email Generator", desc: "Draft professional emails in seconds.", icon: Mail },
  { to: "/notes", title: "Meeting Notes Summarizer", desc: "Turn raw notes into action-ready summaries.", icon: FileText },
  { to: "/planner", title: "AI Task Planner", desc: "Break goals into prioritized, time-boxed plans.", icon: ListChecks },
  { to: "/research", title: "AI Research Assistant", desc: "Get structured briefings on any topic.", icon: Search },
  { to: "/chat", title: "AI Chatbot", desc: "A general-purpose workplace copilot.", icon: MessageSquare },
] as const;

function Index() {
  return (
    <AppShell
      title="Welcome back"
      description="Your AI-powered workplace productivity suite. Pick a tool to get started."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <Link key={t.to} to={t.to} className="group">
              <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary mb-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{t.title}</CardTitle>
                  <CardDescription>{t.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center text-sm font-medium text-primary">
                    Open <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-lg border bg-muted/30 p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Responsible AI disclaimer</p>
        <p>
          All outputs are AI-generated and may contain inaccuracies, bias, or outdated information.
          Always review, verify, and edit content before sharing or making decisions.
        </p>
      </div>
    </AppShell>
  );
}
