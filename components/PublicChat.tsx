"use client";
import { useEffect, useState } from "react";
import ChatForm from "./ChatForm";
import type { PublicForm } from "@/lib/types";

/** Loads a published form by slug and renders it: full page (/f/slug) or edge-to-edge for the iframe (/embed/slug). */
export default function PublicChat({ slug, embed }: { slug: string; embed?: boolean }) {
  const [form, setForm] = useState<PublicForm | null>(null);
  const [state, setState] = useState<"loading" | "missing" | "ok">("loading");

  useEffect(() => {
    fetch(`/api/public/${slug}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((f) => { setForm(f); setState("ok"); })
      .catch(() => setState("missing"));
  }, [slug]);

  const submit = async (answers: Record<string, string>) => {
    const r = await fetch(`/api/public/${slug}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
    if (!r.ok) throw new Error("submit failed");
  };

  if (state === "loading") return <p className="p-6 text-center text-sm text-gray-500">Loading…</p>;
  if (state === "missing" || !form) return <p className="p-6 text-center text-sm text-gray-500">This form is unavailable.</p>;
  const chat = <ChatForm form={form} onSubmit={submit} />;
  if (embed) return <div className="h-[100dvh]">{chat}</div>;
  return (
    <main className="flex min-h-[100dvh] justify-center bg-gray-100 sm:p-6">
      <div className="h-[100dvh] w-full max-w-lg overflow-hidden bg-white shadow-xl sm:h-[680px] sm:rounded-2xl">{chat}</div>
    </main>
  );
}
