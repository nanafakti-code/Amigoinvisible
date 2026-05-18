import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { makeDerangement } from "@/lib/draw";
import { sendDrawEmail } from "@/lib/mailer";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Participant } from "@/types/participant";

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  const supabase = getSupabaseAdmin();
  const { data: participants, error } = await supabase
    .from("participants")
    .select("id,full_name,email,favorites,avoid_list,image_urls,created_at");

  if (error || !participants) {
    return NextResponse.json({ error: "No se pudieron cargar participantes." }, { status: 500 });
  }

  if (participants.length < 2) {
    return NextResponse.json({ error: "Necesitas al menos 2 participantes." }, { status: 400 });
  }

  const list = participants as Participant[];
  const receivers = makeDerangement(list);

  const payload = list.map((giver, index) => ({
    giver_id: giver.id,
    receiver_id: receivers[index].id,
  }));

  const { error: wipeError } = await supabase.from("draw_results").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (wipeError) {
    return NextResponse.json({ error: "No se pudo limpiar sorteo anterior." }, { status: 500 });
  }

  const { error: insertError } = await supabase.from("draw_results").insert(payload);
  if (insertError) {
    return NextResponse.json({ error: "No se pudo guardar el sorteo." }, { status: 500 });
  }

  await Promise.all(list.map((giver, index) => sendDrawEmail(giver, receivers[index])));

  return NextResponse.json({ ok: true, assignments: payload.length });
}
