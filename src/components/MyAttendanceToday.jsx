import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { todayKST } from "../utills/dateKTS";

// Show current user's attendance/homework status for today's session of a class
export default function MyAttendanceToday({ classId, user }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [present, setPresent] = useState(false);
  const [homework, setHomework] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!classId || !user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const today = todayKST();
      // find today's session for this class
      const { data: sess } = await supabase
        .from("sessions")
        .select("*")
        .eq("class_id", classId)
        .eq("date", today)
        .maybeSingle();
      if (!mounted) return;
      setSession(sess ?? null);
      if (!sess) {
        setPresent(false);
        setHomework(false);
        setLoading(false);
        return;
      }

      const [{ data: att }, { data: hw }] = await Promise.all([
        supabase
          .from("attendance_presence")
          .select("id")
          .eq("session_id", sess.id)
          .eq("student_id", user.id)
          .maybeSingle(),
        supabase
          .from("homework_presence")
          .select("id")
          .eq("session_id", sess.id)
          .eq("student_id", user.id)
          .maybeSingle(),
      ]);

      if (!mounted) return;
      setPresent(!!att);
      setHomework(!!hw);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [classId, user]);

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      {loading ? (
        <span className="text-gray-500">내 출석 여부 확인 중…</span>
      ) : session ? (
        <>
          <span className={`px-2 py-0.5 rounded text-white ${present ? "bg-primary" : "bg-gray-400"}`}>
            출석: {present ? "완료" : "미체크"}
          </span>
          <span className={`px-2 py-0.5 rounded text-white ${homework ? "bg-primary" : "bg-gray-400"}`}>
            과제: {homework ? "완료" : "미체크"}
          </span>
        </>
      ) : (
        <span className="text-gray-500">오늘 세션이 아직 없습니다.</span>
      )}
    </div>
  );
}
