function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

export const env = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  SUPABASE_BUCKET: process.env.SUPABASE_BUCKET ?? "shirt-images",
  ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY ?? "",
  SMTP_EMAIL: process.env.SMTP_EMAIL ?? "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD ?? "",
  DRAW_DEADLINE: process.env.DRAW_DEADLINE,
  NEXT_PUBLIC_DRAW_DEADLINE: process.env.NEXT_PUBLIC_DRAW_DEADLINE,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Amigo Invisible Futbol",
  NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  required,
};
