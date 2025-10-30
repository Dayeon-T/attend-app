// src/components/ClassJoinCode.jsx
import { useState } from "react";
import { supabase } from "./lib/supabase"; // ⬅️ 컴포넌트 폴더 기준 경로 확인!

const genCode = () => Math.random().toString(36).slice(2, 8).toUpperCase();

export default function ClassJoinCode({ classId, initCode, isAdmin = false }) {
  const [code, setCode] = useState(initCode || "");
  const [loading, setLoading] = useState(false);

  const createOrRotate = async () => {
    if (!isAdmin) return alert("관리자만 코드 생성이 가능합니다.");

    // 0) 방어: classId 유효성
    if (classId == null) return alert("클래스가 선택되지 않았어요.");
    const id = typeof classId === "string" ? Number(classId) : classId;
    if (!Number.isFinite(id)) return alert("유효하지 않은 classId입니다.");

    setLoading(true);

    const newCode = genCode();

    // 1) update 시도 (0행이어도 에러 안 나게)
    const { data, error } = await supabase
      .from("classes")
      .update({ join_code: newCode })
      .eq("id", id)
      .select("id, join_code")
      .maybeSingle(); // <= 0행이면 data=null, error=null

    if (error) {
      setLoading(false);
      return alert("코드 생성 실패: " + error.message);
    }

    if (!data) {
      // 2) 왜 0행인지 확인 (존재 X vs RLS)
      const { data: exists, error: qErr } = await supabase
        .from("classes")
        .select("id")
        .eq("id", id)
        .maybeSingle();

      setLoading(false);

      if (qErr) return alert("조회 오류: " + qErr.message);
      if (!exists) return alert(`해당 클래스가 존재하지 않습니다. (id: ${id})`);
      return alert("업데이트 권한이 없습니다. (RLS/정책 확인 필요)");
    }

    // 성공
    setCode(data.join_code);
    setLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      
      {!isAdmin && <span className="text-sm text-gray-500">관리자 전용</span>}
      {code && <div className="bg-[#393939] rounded px-3 py-1 font-mono w-full">{code}</div>}
      <button
        onClick={createOrRotate}
        disabled={loading || !isAdmin}
        className="px-3 py-1 rounded min-w-[95px] text-center whitespace-nowrap text-sm bg-primary text-white disabled:opacity-60"
      >
        {loading ? "생성 중..." : code ? "코드 재발급" : "코드 생성"}
      </button>
    </div>
  );
}
