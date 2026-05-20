import { useState } from "react";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <div className="hidden md:block sticky top-0 h-screen">
        <AppSidebar />
      </div>

      {/* Mobile sidebar */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="h-full"><AppSidebar onNavigate={() => setOpen(false)} /></div>
          <button
            className="flex-1 bg-black/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b bg-card px-4 py-3">
          <span className="font-semibold">Workplace AI</span>
          <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </header>
        <main className="flex-1 p-6 md:p-10 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}