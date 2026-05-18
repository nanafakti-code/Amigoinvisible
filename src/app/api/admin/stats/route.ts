import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const supabase = getSupabaseAdmin();
  const participantsRes = await supabase.from("participants").select("id", { count: "exact", head: true });
  const drawRes = await supabase.from("draw_results").select("id").limit(1);

  if (participantsRes.error || drawRes.error) {
    return NextResponse.json({ error: "Tablas de Supabase no disponibles. Ejecuta supabase/schema.sql" }, { status: 500 });
  }

  return NextResponse.json({
    participantsCount: participantsRes.count ?? 0,
    drawDone: Boolean(drawRes.data && drawRes.data.length > 0),
  });
}
