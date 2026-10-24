"use client";
import { useEffect, useRef, useState } from "react";
import type { PublicForm } from "@/lib/types";
import { validate } from "@/lib/validate";

type Msg = { from: "bot" | "user"; text: string };

/** Chat-style form: one question at a time, text input or answer buttons, validation, welcome + completion messages. */
export default function ChatForm({ form, onSubmit }: { form: PublicForm; onSubmit: (a: Record<string, string>) => Promise<void> }) {
  const qs = form.questions;
  const [msgs, setMsgs] = useState<Msg[]>(() => [{ from: "bot", text: form.welcome }, ...(qs[0] ? [{ from: "bot" as const, text: qs[0].label }] : [])]);
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const answers = useRef<Record<string, string>>({});
  const end = useRef<HTMLDivElement>(null);
  const q = qs[i];

  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, err]);

  async function answer(raw: string) {
    if (!q || busy || done) return;
    const e = validate(q, raw);
    if (e) return setErr(e);
    setErr("");
    const text = raw.trim();
    if (text) answers.current[q.id] = text;
    const next: Msg[] = [...msgs, { from: "user", text: text || "(skipped)" }];
    setVal("");
    if (i + 1 < qs.length) {
      setMsgs([...next, { from: "bot", text: qs[i + 1].label }]);
      setI(i + 1);
      return;
    }
    setBusy(true);
    try {
      await onSubmit(answers.current);
      setMsgs([...next, { from: "bot", text: form.completion }]);
      setDone(true);
    } catch {
      setErr("Could not submit your answers. Please try again.");
    } finally { setBusy(false); }
  }

  const btn = "rounded-full border px-4 py-2 text-sm font-medium transition hover:text-white";
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="px-4 py-3 text-base font-semibold text-white" style={{ background: form.color }}>{form.title}</div>
      <div className="flex-1 space-y-2 overflow-y-auto bg-gray-50 p-4" aria-live="polite">
        {msgs.map((m, k) => (
          <div key={k} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-sm ${m.from === "user" ? "text-white" : "border bg-white text-gray-800"}`}
              style={m.from === "user" ? { background: form.color } : undefined}>{m.text}</div>
          </div>
        ))}
        <div ref={end} />
      </div>
      {!done && q && (
        <div className="border-t bg-white p-3">
          {err && <p className="mb-2 text-xs text-red-600" role="alert">{err}</p>}
          {q.type === "choice" || q.type === "yesno" ? (
            <div className="flex flex-wrap gap-2">
              {(q.type === "yesno" ? ["Yes", "No"] : q.options ?? []).map((o) => (
                <button key={o} disabled={busy} onClick={() => answer(o)} className={btn}
                  style={{ borderColor: form.color, color: form.color }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = form.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "")}>{o}</button>
              ))}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); answer(val); }} className="flex gap-2">
              <input className="input" type={q.type === "email" ? "email" : "text"} value={val} autoFocus maxLength={2000}
                onChange={(e) => setVal(e.target.value)} placeholder={q.type === "email" ? "you@example.com" : "Type your answer…"} aria-label={q.label} />
              <button type="submit" disabled={busy} className="btn text-white" style={{ background: form.color }}>Send</button>
            </form>
          )}
          {!q.required && <button className="mt-2 text-xs text-gray-500 underline" disabled={busy} onClick={() => answer("")}>Skip</button>}
          {busy && <p className="mt-2 text-xs text-gray-500">Submitting…</p>}
        </div>
      )}
    </div>
  );
}
