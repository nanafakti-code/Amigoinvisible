import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("participants")
    .select("id,full_name,email,favorites,avoid_list,image_urls,created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "No se pudieron cargar participantes" }, { status: 500 });
  }

  return NextResponse.json({ participants: data });
}

export async function DELETE(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
  }

  const id = body?.id;
  if (!id) return NextResponse.json({ error: "Falta id del participante" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("participants").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "No se pudo eliminar el participante" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
