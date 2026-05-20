import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export type Field = {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
};

export function AiGenerator({
  title,
  description,
  fields,
  buildPrompt,
  system,
  cta = "Generate",
  children,
}: {
  title: string;
  description: string;
  fields: Field[];
  buildPrompt: (values: Record<string, string>) => string;
  system: string;
  cta?: string;
  children?: ReactNode;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    for (const f of fields) {
      if (f.required && !values[f.name]?.trim()) {
        toast.error(`${f.label} is required`);
        return;
      }
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "generate",
          system,
          prompt: buildPrompt(values),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Generation failed");
        return;
      }
      setOutput(data.text ?? "");
    } catch (e: any) {
      toast.error(e?.message ?? "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <label className="text-sm font-medium">
                {f.label}
                {f.required && <span className="text-destructive"> *</span>}
              </label>
              <Textarea
                rows={f.rows ?? 3}
                placeholder={f.placeholder}
                value={values[f.name] ?? ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [f.name]: e.target.value }))
                }
              />
            </div>
          ))}
          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="mr-2 h-4 w-4" /> {cta}</>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2">
          <div>
            <CardTitle>Output</CardTitle>
            <CardDescription>Editable — refine before sharing.</CardDescription>
          </div>
          {output && (
            <Button size="sm" variant="outline" onClick={copyOutput}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {output ? (
            <>
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                rows={14}
                className="font-mono text-sm"
              />
              <div className="mt-4 rounded-md border bg-muted/30 p-4 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{output}</ReactMarkdown>
              </div>
            </>
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              {loading ? "Working on it…" : "Your AI output will appear here."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}