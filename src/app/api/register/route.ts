import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isValidImageType, registrationSchema, sanitizeInput } from "@/lib/validation";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

async function uploadOptionalImage(file: File | null): Promise<string> {
  if (!file || file.size === 0) return "";
  if (!isValidImageType(file.type)) {
    throw new Error("Formato de imagen no permitido. Usa JPG, PNG o WEBP.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Cada imagen debe pesar menos de 4MB.");
  }
  return uploadImageToCloudinary(file);
}

export async function POST(req: NextRequest) {
  try {
    const deadline = env.DRAW_DEADLINE ? new Date(env.DRAW_DEADLINE) : null;
    if (deadline && new Date() > deadline) {
      return NextResponse.json({ error: "La fecha limite ha terminado." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const formData = await req.formData();

    const fullName = sanitizeInput(String(formData.get("fullName") ?? ""));
    const email = sanitizeInput(String(formData.get("email") ?? "")).toLowerCase();
    const avoidList = sanitizeInput(String(formData.get("avoidList") ?? ""));

    const parsed = registrationSchema.safeParse({ fullName, email, avoidList });
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos invalidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const { data: exists } = await supabase.from("participants").select("id").eq("email", email).maybeSingle();
    if (exists) {
      return NextResponse.json({ error: "Este email ya esta registrado." }, { status: 409 });
    }

    const image1 = formData.get("image1");
    const image2 = formData.get("image2");
    const image3 = formData.get("image3");

    const files = [image1, image2, image3].map((v) => (v instanceof File ? v : null));
    const uploadedUrls = await Promise.all(files.map((file) => uploadOptionalImage(file)));

    const favorites = ["Top 1", "Top 2", "Top 3"];

    const { error: insertError } = await supabase.from("participants").insert({
      full_name: fullName,
      email,
      favorites,
      avoid_list: avoidList,
      image_urls: uploadedUrls,
    });

    if (insertError) {
      return NextResponse.json({ error: `No se pudo guardar el participante: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Registro completado." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error interno del servidor.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
