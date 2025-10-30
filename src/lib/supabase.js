import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // 친절한 가드: 어떤 값이 비었는지 콘솔에 명확히 표시
  // Vite는 프로젝트 루트의 .env 파일만 자동 로드합니다.
  // 파일 위치: C:/Users/user/Desktop/PJ/attend-app/.env
  // 예시:
  // VITE_SUPABASE_URL=https://xxxx.supabase.co
  // VITE_SUPABASE_ANON_KEY=eyJ...
  console.error("[Supabase] Missing env:", {
    VITE_SUPABASE_URL: !!SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: !!SUPABASE_ANON_KEY,
  });
  throw new Error(
    "Supabase env not found. Ensure .env at project root with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart dev server."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
