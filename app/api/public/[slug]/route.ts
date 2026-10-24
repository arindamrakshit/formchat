import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { validate } from "@/lib/validate";
import type { Question } from "@/lib/types";

export const dynamic = "force-dynamic";
const CORS = { "Access-Control-Allow-Origin": "*" }; // lets widget.js check the form on any site

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const [f] = await query("select title, questions, welcome, completion, color from forms where slug=$1 and published", [params.slug]);
  return f ? NextResponse.json(f, { headers: CORS }) : NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  const [f] = await query("select id, questions from forms where slug=$1 and published", [params.slug]);
  if (!f) return NextResponse.json({ error: "Form not found or unpublished" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const input = body?.answers;
  if (!input || typeof input !== "object") return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const clean: Record<string, string> = {};
  for (const q of f.questions as Question[]) {
    const e = validate(q, input[q.id]);
    if (e) return NextResponse.json({ error: `${q.label}: ${e}` }, { status: 422 });
    const v = typeof input[q.id] === "string" ? input[q.id].trim() : "";
    if (v) clean[q.id] = v;
  }
  await query("insert into responses (form_id, answers) values ($1, $2)", [f.id, JSON.stringify(clean)]);
  return NextResponse.json({ ok: true }, { status: 201 });
}
