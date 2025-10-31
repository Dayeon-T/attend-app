import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  
  
  
  
  
  
  console.error("[Supabase] Missing env:", {
    VITE_SUPABASE_URL: !!SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY,
  });
  throw new Error(
    "Supabase env not found. Ensure .env at project root with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart dev server."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
