import ClassJoinCode from "../ClassJoinCode";
import AttendanceWithHomework from "../AttendanceWithHomework";
// import MyAttendanceToday from "../components/MyAttendanceToday"; // 제거
import MyAttendanceByDates from "../components/MyAttendanceByDates";

export default function ClassDetailView({ selectedClass, isAdmin, user }) {
  if (!selectedClass) return null;
  return (
    <section className="space-y-4 p-4">
      <div className="rounded bg-[#282828] p-4 space-y-3 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{selectedClass.title}</h2>
          <span className="text-sm text-gray-500">ID: {selectedClass.id}</span>
        </div>
        {/* 내 오늘 출석/과제 상태 제거 */}
        {/* 내 날짜별 출석/과제 히스토리 (관리자에게는 숨김) */}
        {!isAdmin && (
          <MyAttendanceByDates classId={selectedClass.id} user={user} />
        )}
        {isAdmin && (
          <ClassJoinCode
            classId={selectedClass.id}
            initCode={selectedClass.join_code}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {isAdmin ? (
        <div className="rounded bg-[#282828] p-4">
          <AttendanceWithHomework classId={selectedClass.id} isAdmin={isAdmin} />
        </div>
      ) : (
        <div className="rounded px-4 text-xs text-primary/50 flex justify-center">
        <p>출석 및 과제제출 여부가 잘못 기재되어있을 경우 관리자에게 문의하세요</p>
        </div>
      )}
    </section>
  );
}
