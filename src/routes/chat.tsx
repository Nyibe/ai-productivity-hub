import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import { Send, Loader2, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({ component: ChatPage });

function ChatPage() {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const transport = useRef(
    new DefaultChatTransport({
      api: "/api/ai",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: { mode: "chat", messages },
      }),
    }),
  ).current;

  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
    onError: (e) => toast.error(e?.message ?? "Chat error"),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus();
  }, [isLoading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <AppShell
      title="AI Chatbot"
      description="A general-purpose workplace copilot. Ask anything."
    >
      <Card className="flex flex-col h-[70vh] overflow-hidden p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <span className="text-sm font-medium">Conversation</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMessages([])}
            disabled={messages.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
              Start the conversation — try "Summarize the pros and cons of OKRs."
            </div>
          )}
          {messages.map((m: UIMessage) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={isUser ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    isUser
                      ? "max-w-[80%] rounded-lg bg-primary px-4 py-2.5 text-primary-foreground"
                      : "max-w-[85%] text-sm"
                  }
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap text-sm">{text}</p>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {status === "submitted" && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2 items-end bg-card">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Message your AI assistant…"
            rows={2}
            className="resize-none"
            autoFocus
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </Card>
    </AppShell>
  );
}