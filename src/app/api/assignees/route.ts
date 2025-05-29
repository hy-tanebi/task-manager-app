// src/app/api/assignees/route.ts
import { NextResponse } from "next/server";
import { createClient } from "../../../../utils/supabase/server";

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase.from("Assignee").select("id, name");

  if (error) {
    console.error("❌ Assignee一覧取得エラー:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
