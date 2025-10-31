
import { useEffect, useState, forwardRef } from "react";
import { supabase } from "./lib/supabase";
import { todayKST } from "./utills/dateKTS";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AttendanceWithHomework({ classId, isAdmin = false }) {
  const [sessionId, setSessionId] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(todayKST());
  const [opBusy, setOpBusy] = useState(false);
  

  
  const formatKST = (d) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit" }).format(d);

  
  const parseYMD = (s) => {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d); 
  };

  const load = async (targetDate) => {
    setLoading(true);
    
    const { data: sess } = await supabase
      .from("sessions")
      .select("*")
      .eq("class_id", classId)
      .eq("date", targetDate)
      .maybeSingle();

    const session = sess ?? null;
    const sid = session?.id ?? null;
    setSessionId(sid);

    
    if (!sid) {
      setRows([]);
      setLoading(false);
      return;
    }

    
    const { data: enrolls, error: enrollErr } = await supabase
      .from("enrollments")
      .select("student_id")
      .eq("class_id", classId);

    if (enrollErr) {
      console.error("enrollments load error", enrollErr);
      setRows([]);
      setLoading(false);
      return;
    }

    const studentIds = (enrolls ?? []).map((e) => e.student_id);
    if (studentIds.length === 0) {
      setRows([]);
      setLoading(false);
      return;
    }

    
    const { data: list } = await supabase
      .from("profiles")
      .select(`
        id,
        name,
        student_no,
        attendance_presence (id, session_id),
        homework_presence (id, session_id)
      `)
      .in("id", studentIds);

    const mapped = (list ?? []).map((s) => ({
      id: s.id,
      name: s.name,
      student_no: s.student_no,
      present: (s.attendance_presence ?? []).some((ap) => ap.session_id === sid),
      homework: (s.homework_presence ?? []).some((hp) => hp.session_id === sid),
    }));
    setRows(mapped.sort((a, b) => (a.name || "").localeCompare(b.name || "", "ko")));
    setLoading(false);
  };

  useEffect(() => {
    load(selectedDate);
    
  }, [classId, isAdmin, selectedDate]);

  const createSession = async () => {
    if (!isAdmin) return;
    const targetDate = selectedDate;
    setOpBusy(true);
    const { data, error } = await supabase
      .from("sessions")
      .upsert([{ class_id: classId, date: targetDate }], { onConflict: "class_id,date" })
      .select()
      .single();
    if (error) {
      alert("세션 생성 실패: " + error.message);
      setOpBusy(false);
      return;
    }
    setSessionId(data?.id ?? null);
    await load(targetDate);
    setOpBusy(false);
  };

  
  const deleteSession = async () => {
    if (!isAdmin || !sessionId) return;
    const ok = window.confirm(`${selectedDate} 수업을 삭제하시겠어요?\n해당 수업의 출석/과제 기록도 함께 삭제됩니다.`);
    if (!ok) return;
    try {
      setOpBusy(true);
      
      await supabase.from("attendance_presence").delete().eq("session_id", sessionId);
      await supabase.from("homework_presence").delete().eq("session_id", sessionId);
      const { error } = await supabase.from("sessions").delete().eq("id", sessionId);
      if (error) {
        alert("세션 삭제 실패: " + error.message);
        setOpBusy(false);
        return;
      }
      setSessionId(null);
      setRows([]);
      setOpBusy(false);
    } catch (e) {
      console.error(e);
      alert("세션 삭제 중 오류가 발생했습니다.");
      setOpBusy(false);
    }
  };

  const toggle = async (table, studentId, goingTrue) => {
    if (!isAdmin || !sessionId) return; 
    if (goingTrue) {
      await supabase.from(table).insert([{ session_id: sessionId, student_id: studentId }]);
    } else {
      await supabase.from(table).delete().eq("session_id", sessionId).eq("student_id", studentId);
    }
  };

  const toggleAttendance = (id, val) => {
    if (!isAdmin) return;
    toggle("attendance_presence", id, val);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, present: val } : r)));
  };

  const toggleHomework = (id, val) => {
    if (!isAdmin) return;
    toggle("homework_presence", id, val);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, homework: val } : r)));
  };

  return (
    <div className="space-y-4">
      {}
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm text-white">날짜</label>

        {}
        {(() => {
          const DateButton = forwardRef(({ value, onClick }, ref) => (
            <button
              type="button"
              onClick={onClick}
              ref={ref}
              className="px-3 py-1 rounded bg-[#393939] text-white text-sm border border-[#282828] hover:border-primary transition-colors"
            >
              {value}
            </button>
          ));
          DateButton.displayName = "DateButton";

          return (
            <DatePicker
              selected={parseYMD(selectedDate)}
              onChange={(d) => d && setSelectedDate(formatKST(d))}
              dateFormat="yyyy-MM-dd"
              customInput={<DateButton />}
              calendarClassName="datepicker-dark"
              popperClassName="datepicker-popper-dark"
              showPopperArrow={false}
              popperPlacement="bottom-end"
            />
          );
        })()}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedDate(todayKST())}
            className="px-2 py-1 rounded bg-primary text-white text-xs"
          >
            오늘
          </button>

          {isAdmin && !sessionId && (
            <button
              type="button"
              onClick={createSession}
              disabled={opBusy}
              className="px-2 py-1 rounded bg-primary/70 hover:bg-primary text-white text-xs transition-colors disabled:opacity-50"
            >
              {opBusy ? "생성 중..." : "수업 생성"}
            </button>
          )}
          {isAdmin && sessionId && (
            <button
              type="button"
              onClick={deleteSession}
              disabled={opBusy}
              className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white text-xs transition-colors disabled:opacity-50"
            >
              {opBusy ? "삭제 중..." : "수업 삭제"}
            </button>
          )}
        </div>
      </div>

      {}
      {loading ? (
        <ul className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex items-center justify-between rounded px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-3 w-12 bg-[#393939] rounded animate-pulse" />
                <span className="h-3 w-24 bg-[#393939] rounded animate-pulse" />
              </div>
              <div className="flex gap-2 shrink-0">
                <div className="h-6 w-10 rounded bg-[#393939] animate-pulse" />
                <div className="h-6 w-10 rounded bg-[#393939] animate-pulse" />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <>
          {!sessionId ? (
            <div className="text-xs text-gray-400">이 날짜의 수업이 없습니다.</div>
          ) : (
            <ul className="space-y-2">
            {rows.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between border rounded px-3 py-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {r.student_no ? (
                    <span className="text-xs text-gray-400 truncate">{r.student_no}</span>
                  ) : null}
                  <span className="font-semibold truncate text-white text-xs">{r.name}</span>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleAttendance(r.id, !r.present)}
                    disabled={!isAdmin || !sessionId}
                    className={`px-2 py-1 rounded text-white text-xs ${
                      r.present ? "bg-primary" : "bg-gray-400"
                    } ${!isAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    출석
                  </button>
                  <button
                    onClick={() => toggleHomework(r.id, !r.homework)}
                    disabled={!isAdmin || !sessionId}
                    className={`px-2 py-1 rounded text-white text-xs ${
                      r.homework ? "bg-primary" : "bg-gray-400"
                    } ${!isAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    과제
                  </button>
                </div>
              </li>
            ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
