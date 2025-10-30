import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

// List per-date attendance/homework status for the current user in a class
export default function MyAttendanceByDates({ classId, user, limit = 60 }) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]); // [{id, date, present, homework}]
  const userId = user?.id;

  useEffect(() => {
    let active = true;
    (async () => {
      if (!classId || !userId) {
        setRows([]);
        setLoading(false);
        return;
      }
      setLoading(true);

      // 1) sessions by class
      const { data: sessions, error: sErr } = await supabase
        .from("sessions")
        .select("id,date")
        .eq("class_id", classId)
        .order("date", { ascending: false })
        .limit(limit);

      if (!active) return;
      if (sErr) {
        console.error("fetch sessions error", sErr);
        setRows([]);
        setLoading(false);
        return;
      }

      const ids = (sessions ?? []).map((s) => s.id);
      if (ids.length === 0) {
        setRows([]);
        setLoading(false);
        return;
      }

      // 2) presence for this user across these sessions
      const [attRes, hwRes] = await Promise.all([
        supabase
          .from("attendance_presence")
          .select("session_id")
          .eq("student_id", userId)
          .in("session_id", ids),
        supabase
          .from("homework_presence")
          .select("session_id")
          .eq("student_id", userId)
          .in("session_id", ids),
      ]);

      if (!active) return;
      const attSet = new Set((attRes.data ?? []).map((r) => r.session_id));
      const hwSet = new Set((hwRes.data ?? []).map((r) => r.session_id));

      const mapped = (sessions ?? []).map((s) => ({
        id: s.id,
        date: s.date,
        present: attSet.has(s.id),
        homework: hwSet.has(s.id),
      }));

      setRows(mapped);
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, [classId, userId, limit]);

  if (!userId) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-md font-semibold">내 출석 히스토리</h3>

      {/* 로딩 중 스켈레톤 */}
      {loading ? (
        <ul className="divide-y divide-gray-700 rounded border border-gray-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between p-2">
              <span className="h-3 w-24 bg-[#393939] rounded animate-pulse" />
              <div className="flex items-center gap-2">
                <div className="h-5 w-12 bg-[#393939] rounded animate-pulse" />
                <div className="h-5 w-12 bg-[#393939] rounded animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      ) : rows.length === 0 ? (
        <div className="text-sm text-gray-500">세션이 아직 없습니다.</div>
      ) : (
        <ul className="divide-y divide-gray-200 rounded border">
          {rows.map((r) => (
            <li key={r.id} className="flex items-center justify-between p-2">
              <span className="font-mono text-sm">{r.date}</span>
              <div className="flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded text-white ${r.present ? "bg-primary" : "bg-gray-400"}`}>
                  출석 {r.present ? "O" : "X"}
                </span>
                <span className={`px-2 py-0.5 rounded text-white ${r.homework ? "bg-primary" : "bg-gray-400"}`}>
                  과제 {r.homework ? "O" : "X"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
