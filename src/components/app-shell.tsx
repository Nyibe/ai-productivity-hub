import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <div className="hidden md:block sticky top-0 h-screen">
        <AppSidebar />
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="h-full">
            <AppSidebar onNavigate={() => setOpen(false)} />
          </div>
          <button
            className="flex-1 bg-black/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b bg-card px-4 py-3">
          <span className="font-semibold">Workplace AI</span>
          <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>
        <main className="flex-1 p-6 md:p-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
            </div>
            {children}
          </div>
        </main>
        <footer className="border-t px-6 py-4 text-xs text-muted-foreground">
          AI-generated content may contain errors. Review outputs carefully before use.
        </footer>
      </div>
    </div>
  );
}