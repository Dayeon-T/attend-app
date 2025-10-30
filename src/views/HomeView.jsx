import ClassCreateForm from "../ClassCreateForm";
import ClassList from "../ClassList";
import JoinClassForm from "../JoinClassForm";
import MyClasses from "../MyClasses";

export default function HomeView({ isAdmin, onSelectClass }) {
  return (
    <section className="space-y-6 px-4">
      {isAdmin && (
        <div className="rounded bg-[#282828] text-white p-4">
          <h2 className="font-semibold mb-3">수업 생성</h2>
          <ClassCreateForm onCreated={() => {}} />
        </div>
      )}

      {!isAdmin && (
        <div className="rounded bg-[#282828] text-white p-4">
          <h2 className="font-semibold mb-3">내 수업</h2>
          <MyClasses onSelect={onSelectClass} />
        </div>
      )}

      {isAdmin && (
        <div className="rounded bg-[#282828] text-white pt-4 px-4 pb-1">
          <h2 className="font-semibold mb-3">전체 수업</h2>
          <ClassList onSelect={onSelectClass} />
        </div>
      )}

      <div className="rounded bg-[#282828] text-white p-4">
        <h2 className="font-semibold mb-3">참가 코드로 수업 등록</h2>
        <JoinClassForm onJoined={onSelectClass} />
      </div>
    </section>
  );
}
