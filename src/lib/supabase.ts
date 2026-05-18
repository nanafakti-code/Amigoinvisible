import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export function getSupabaseAdmin() {
  return createClient(env.required("NEXT_PUBLIC_SUPABASE_URL"), env.required("SUPABASE_SERVICE_ROLE_KEY"));
}

export function getSupabasePublic() {
  return createClient(env.required("NEXT_PUBLIC_SUPABASE_URL"), env.required("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
}
