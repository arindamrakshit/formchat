"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { FormRow, ResponseRow } from "@/lib/types";

export default function Responses() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<FormRow | null>(null);
  const [rows, setRows] = useState<ResponseRow[] | null>(null);

  useEffect(() => {
    fetch(`/api/forms/${id}`).then((r) => r.json()).then(setForm);
    fetch(`/api/forms/${id}/responses`).then((r) => r.json()).then(setRows);
  }, [id]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      <Link href="/dashboard" className="text-sm text-indigo-600">← Dashboard</Link>
      <h1 className="mt-3 text-2xl font-bold">{form?.title ?? "…"} <span className="text-base font-normal text-gray-500">· {rows?.length ?? 0} responses</span></h1>
      {rows?.length === 0 && <p className="mt-6 rounded-xl border border-dashed p-8 text-center text-gray-500">No submissions yet.</p>}
      <div className="mt-4 space-y-3">
        {rows?.map((r) => (
          <article key={r.id} className="rounded-xl border p-4">
            <p className="text-xs text-gray-500">{new Date(r.created_at).toLocaleString()}</p>
            <dl className="mt-2 space-y-2">
              {form?.questions.map((q) => (
                <div key={q.id}><dt className="text-xs font-medium text-gray-500">{q.label}</dt><dd className="break-words text-sm">{r.answers[q.id] ?? <span className="text-gray-400">—</span>}</dd></div>))}
            </dl>
          </article>))}
      </div>
    </main>
  );
}
