import type { QType, Question } from "./types";

export const isId = (s: string) => /^[0-9a-f-]{36}$/i.test(s);

/** Shared by the chat UI (client) and the submit API (server). Returns an error message or null. */
export function validate(q: Question, v: unknown): string | null {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) return q.required ? "This question is required." : null;
  if (s.length > 2000) return "That answer is too long.";
  if (q.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return "Please enter a valid email address.";
  if (q.type === "yesno" && !["Yes", "No"].includes(s)) return "Please choose Yes or No.";
  if (q.type === "choice" && !q.options?.includes(s)) return "Please choose one of the options.";
  return null;
}

/** Sanitizes questions coming from the builder. Returns null if invalid. */
export function cleanQuestions(raw: unknown): Question[] | null {
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > 50) return null;
  const out: Question[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") return null;
    const { id, type, label, required, options } = r as Record<string, unknown>;
    const lbl = String(label ?? "").trim().slice(0, 300);
    if (!id || !lbl || !["text", "email", "choice", "yesno"].includes(String(type))) return null;
    const q: Question = { id: String(id).slice(0, 40), type: type as QType, label: lbl, required: !!required };
    if (type === "choice") {
      const o = Array.isArray(options) ? options.map((x) => String(x).trim().slice(0, 100)).filter(Boolean) : [];
      if (o.length < 2) return null;
      q.options = o;
    }
    out.push(q);
  }
  return out;
}
