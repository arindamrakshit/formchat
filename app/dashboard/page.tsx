"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormRow } from "@/lib/types";

export default function Dashboard() {
  const router = useRouter();
  const [forms, setForms] = useState<FormRow[] | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    try { const r = await fetch("/api/forms"); if (!r.ok) throw new Error(); setForms(await r.json()); setErr(""); }
    catch { setErr("Could not load forms. Check DATABASE_URL."); }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function create() { const r = await fetch("/api/forms", { method: "POST" }); if (r.ok) router.push(`/dashboard/forms/${(await r.json()).id}`); }
  async function toggle(f: FormRow) {
    const r = await fetch(`/api/forms/${f.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !f.published }) });
    if (!r.ok) alert((await r.json()).error);
    load();
  }
  async function remove(f: FormRow) { if (confirm(`Delete "${f.title}" and all its responses?`)) { await fetch(`/api/forms/${f.id}`, { method: "DELETE" }); load(); } }
  const copy = (f: FormRow) => navigator.clipboard.writeText(`${location.origin}/f/${f.slug}`).then(() => alert("Public link copied"));

  const total = forms?.reduce((n, f) => n + (f.response_count ?? 0), 0) ?? 0;
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex items-center justify-between"><Link href="/" className="font-bold text-indigo-600">FormChat</Link><button onClick={create} className="btn-primary">+ New form</button></div>
      <h1 className="mt-6 text-2xl font-bold">Dashboard</h1>
      {err && <p className="mt-4 rounded bg-red-50 p-3 text-sm text-red-700">{err}</p>}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[["Forms", forms?.length ?? "–"], ["Published", forms?.filter((f) => f.published).length ?? "–"], ["Responses", forms ? total : "–"]].map(([l, v]) => (
          <div key={l} className="rounded-xl border p-4"><p className="text-xs text-gray-500">{l}</p><p className="text-2xl font-bold">{v}</p></div>))}
      </div>
      <div className="mt-6 space-y-3">
        {forms?.length === 0 && <p className="rounded-xl border border-dashed p-8 text-center text-gray-500">No forms yet. Create your first one!</p>}
        {forms?.map((f) => (
          <div key={f.id} className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{f.title}</p>
              <p className="mt-1 text-xs text-gray-500">
                <span className={`mr-2 rounded-full px-2 py-0.5 ${f.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>{f.published ? "Published" : "Draft"}</span>
                {f.questions.length} questions · {f.response_count ?? 0} responses
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link className="btn-ghost" href={`/dashboard/forms/${f.id}`}>Edit</Link>
              <Link className="btn-ghost" href={`/dashboard/forms/${f.id}/responses`}>Responses</Link>
              {f.published && <button className="btn-ghost" onClick={() => copy(f)}>Copy link</button>}
              <button className="btn-ghost" onClick={() => toggle(f)}>{f.published ? "Unpublish" : "Publish"}</button>
              <button className="btn-ghost text-red-600" onClick={() => remove(f)}>Delete</button>
            </div>
          </div>))}
      </div>
    </main>
  );
}
