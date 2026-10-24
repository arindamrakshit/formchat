"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChatForm from "@/components/ChatForm";
import type { FormRow, QType, Question } from "@/lib/types";

const LABELS: Record<QType, string> = { text: "Text", email: "Email", choice: "Multiple choice", yesno: "Yes / No" };
const uid = () => Math.random().toString(36).slice(2, 10);

export default function Builder() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormRow | null>(null);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch(`/api/forms/${id}`).then((r) => r.json()).then(setForm).catch(() => setMsg("Could not load form")); }, [id]);
  if (!form) return <p className="p-6 text-sm text-gray-500">{msg || "Loading…"}</p>;

  const up = (p: Partial<FormRow>) => setForm((f) => (f ? { ...f, ...p } : f));
  const setQ = (i: number, p: Partial<Question>) => up({ questions: form.questions.map((q, k) => (k === i ? { ...q, ...p } : q)) });
  const move = (i: number, d: number) => {
    const a = [...form.questions], j = i + d; if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]]; up({ questions: a });
  };
  const add = (type: QType) => up({ questions: [...form.questions, { id: uid(), type, label: "", required: false, options: type === "choice" ? ["Option 1", "Option 2"] : undefined }] });

  async function save(published = form!.published) {
    const f = form!;
    if (!f.title.trim()) return setMsg("Give your form a title.");
    if (!f.questions.length) return setMsg("Add at least one question.");
    for (const q of f.questions) {
      if (!q.label.trim()) return setMsg("Every question needs text.");
      if (q.type === "choice" && (q.options ?? []).filter((o) => o.trim()).length < 2) return setMsg("Multiple choice needs at least 2 options.");
    }
    setSaving(true);
    const r = await fetch(`/api/forms/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, published }) });
    const d = await r.json(); setSaving(false);
    if (!r.ok) return setMsg(d.error || "Save failed");
    setForm({ ...f, published: d.published }); setMsg(published !== f.published ? (published ? "Published ✓" : "Unpublished") : "Saved ✓");
  }

  const origin = typeof window !== "undefined" ? location.origin : "";
  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link href="/dashboard" className="text-sm text-indigo-600">← Dashboard</Link>
        <div className="flex items-center gap-2">
          {msg && <span className="text-sm text-gray-600">{msg}</span>}
          <button className="btn-ghost" disabled={saving} onClick={() => save()}>Save</button>
          <button className="btn-primary" disabled={saving} onClick={() => save(!form.published)}>{form.published ? "Unpublish" : "Publish"}</button>
        </div>
      </div>
      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <input className="input text-xl font-semibold" value={form.title} maxLength={120} onChange={(e) => up({ title: e.target.value })} aria-label="Form title" />
          {form.questions.map((q, i) => (
            <div key={q.id} className="space-y-2 rounded-xl border p-3">
              <div className="flex gap-2">
                <input className="input" placeholder="Question text" value={q.label} onChange={(e) => setQ(i, { label: e.target.value })} />
                <select className="input w-40" value={q.type} onChange={(e) => { const t = e.target.value as QType; setQ(i, { type: t, options: t === "choice" ? q.options ?? ["Option 1", "Option 2"] : undefined }); }}>
                  {Object.entries(LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              {q.type === "choice" && <textarea className="input text-sm" rows={3} placeholder="One option per line" value={(q.options ?? []).join("\n")} onChange={(e) => setQ(i, { options: e.target.value.split("\n") })} />}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2"><input type="checkbox" checked={q.required} onChange={(e) => setQ(i, { required: e.target.checked })} />Required</label>
                <div className="flex gap-1">
                  <button className="btn-ghost px-2 py-1" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                  <button className="btn-ghost px-2 py-1" onClick={() => move(i, 1)} disabled={i === form.questions.length - 1} aria-label="Move down">↓</button>
                  <button className="btn-ghost px-2 py-1 text-red-600" onClick={() => up({ questions: form.questions.filter((_, k) => k !== i) })}>Delete</button>
                </div>
              </div>
            </div>))}
          <div className="flex flex-wrap gap-2">{(Object.keys(LABELS) as QType[]).map((t) => <button key={t} className="btn-ghost" onClick={() => add(t)}>+ {LABELS[t]}</button>)}</div>

          <div className="space-y-2 rounded-xl border p-3">
            <p className="font-semibold">Widget appearance</p>
            <label className="block text-sm">Welcome message<input className="input mt-1" value={form.welcome} maxLength={300} onChange={(e) => up({ welcome: e.target.value })} /></label>
            <label className="block text-sm">Completion message<input className="input mt-1" value={form.completion} maxLength={300} onChange={(e) => up({ completion: e.target.value })} /></label>
            <label className="flex items-center gap-2 text-sm">Brand color<input type="color" value={form.color} onChange={(e) => up({ color: e.target.value })} /></label>
          </div>

          {form.published ? (
            <div className="space-y-2 rounded-xl border bg-green-50 p-3 text-sm">
              <p className="font-semibold">Published 🎉 (save changes to update the live form)</p>
              <p>Public link: <a className="break-all text-indigo-600 underline" href={`/f/${form.slug}`} target="_blank">{origin}/f/{form.slug}</a></p>
              <p>Embed on any website:</p>
              <code className="block break-all rounded bg-white p-2 text-xs">{`<script src="${origin}/widget.js" data-form="${form.slug}" async></script>`}</code>
            </div>
          ) : <p className="text-sm text-gray-500">Draft: not visible publicly until you publish.</p>}
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <p className="mb-2 text-sm font-semibold">Preview <span className="font-normal text-gray-500">(responses aren&apos;t saved)</span></p>
          <div className="h-[520px] overflow-hidden rounded-2xl border shadow-lg">
            <ChatForm key={JSON.stringify([form.questions, form.welcome, form.completion, form.color, form.title])} form={form} onSubmit={async () => {}} />
          </div>
        </div>
      </div>
    </main>
  );
}
