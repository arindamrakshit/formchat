import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isId } from "@/lib/validate";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  if (!isId(params.id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const rows = await query("select id, answers, created_at from responses where form_id = $1 order by created_at desc limit 1000", [params.id]);
  return NextResponse.json(rows);
}
