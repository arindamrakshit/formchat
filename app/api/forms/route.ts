import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await query(
      `select f.*, (select count(*) from responses r where r.form_id = f.id)::int as response_count
       from forms f order by f.created_at desc`
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST() {
  const starter = [{ id: randomBytes(4).toString("hex"), type: "text", label: "What's your name?", required: true }];
  const [f] = await query(
    "insert into forms (slug, title, questions) values ($1, 'Untitled form', $2) returning *",
    [randomBytes(5).toString("hex"), JSON.stringify(starter)]
  );
  return NextResponse.json(f, { status: 201 });
}
