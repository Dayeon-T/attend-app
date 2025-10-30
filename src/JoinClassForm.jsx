import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function JoinClassForm({ onJoined }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);

    // 1) 로그인 사용자
    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;
    if (!user) {
      setLoading(false);
      return alert("로그인이 필요합니다.");
    }

    // 2) 코드로 클래스 찾기
    const { data: cls, error: cErr } = await supabase
      .from("classes")
      .select("id, title, join_code")
      .eq("join_code", code.trim().toUpperCase())
      .single();
    if (cErr || !cls) {
      setLoading(false);
      return alert("코드가 올바르지 않습니다.");
    }

    // 3) 이미 등록되어 있는지 먼저 확인
    const { data: already, error: aErr } = await supabase
      .from("enrollments")
      .select("id")
      .eq("class_id", cls.id)
      .eq("student_id", user.id)
      .maybeSingle();

    if (aErr) {
      setLoading(false);
      return alert("등록 여부 확인 실패: " + aErr.message);
    }

    if (already) {
      setLoading(false);
      alert("이미 등록된 수업입니다.");
      setCode("");
      // 필요 시 바로 해당 수업으로 이동
      onJoined?.(cls);
      return;
    }

    // 4) 수강 등록
    const { error: eErr } = await supabase
      .from("enrollments")
      .upsert([{ class_id: cls.id, student_id: user.id }], {
        onConflict: "class_id,student_id",
      });

    setLoading(false);
    if (eErr) return alert("등록 실패: " + eErr.message);

    alert(`[${cls.title}] 수강 등록 완료!`);
    setCode("");
    onJoined?.(cls);
  };

  return (
    <form onSubmit={onSubmit} className="flex justify-between gap-2 text-[12px]">
      <input
        className="w-5/6 rounded-md border border-[#282828] bg-[#393939] px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none"
        placeholder="참가 코드 입력"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        required
      />
      <button className="bg-primary text-white px-2 rounded" disabled={loading}>
        {loading ? "등록 중..." : "등록"}
      </button>
    </form>
  );
}
