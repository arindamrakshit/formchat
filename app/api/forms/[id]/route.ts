import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { cleanQuestions, isId } from "@/lib/validate";

export const dynamic = "force-dynamic";
type Ctx = { params: { id: string } };
const err = (m: string, s: number) => NextResponse.json({ error: m }, { status: s });

export async function GET(_: Request, { params }: Ctx) {
  if (!isId(params.id)) return err("Not found", 404);
  const [f] = await query("select * from forms where id = $1", [params.id]);
  return f ? NextResponse.json(f) : err("Not found", 404);
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!isId(params.id)) return err("Not found", 404);
  const b = await req.json().catch(() => null);
  if (!b) return err("Invalid JSON", 400);
  const title = String(b.title ?? "").trim().slice(0, 120);
  const questions = cleanQuestions(b.questions);
  if (!title) return err("Title is required", 400);
  if (!questions) return err("Add at least one valid question (choice questions need 2+ options)", 400);
  const color = /^#[0-9a-f]{6}$/i.test(String(b.color)) ? b.color : "#4f46e5";
  const [f] = await query(
    `update forms set title=$2, questions=$3, welcome=$4, completion=$5, color=$6, published=$7, updated_at=now()
     where id=$1 returning *`,
    [params.id, title, JSON.stringify(questions), String(b.welcome ?? "").slice(0, 300), String(b.completion ?? "").slice(0, 300), color, !!b.published]
  );
  return f ? NextResponse.json(f) : err("Not found", 404);
}

export async function PATCH(req: Request, { params }: Ctx) {
  if (!isId(params.id)) return err("Not found", 404);
  const b = await req.json().catch(() => null);
  if (!b || typeof b.published !== "boolean") return err("published must be a boolean", 400);
  const [cur] = await query("select questions from forms where id=$1", [params.id]);
  if (!cur) return err("Not found", 404);
  if (b.published && !cleanQuestions(cur.questions)) return err("Fix the form's questions before publishing", 400);
  const [f] = await query("update forms set published=$2, updated_at=now() where id=$1 returning *", [params.id, b.published]);
  return NextResponse.json(f);
}

export async function DELETE(_: Request, { params }: Ctx) {
  if (!isId(params.id)) return err("Not found", 404);
  await query("delete from forms where id = $1", [params.id]);
  return NextResponse.json({ ok: true });
}
