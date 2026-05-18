import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

export function requireAdmin(req: NextRequest): NextResponse | null {
  const adminKey = (req.headers.get("x-admin-key") ?? "").trim();
  const expected = (env.ADMIN_SECRET_KEY ?? "").trim();

  if (!adminKey || !expected || adminKey !== expected) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  return null;
}
