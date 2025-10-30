import Logo from "../Logo";

export default function HeaderBar({ title, showBack = false, onBack, showLogout = false, onLogout }) {
  return (
    <>
    <header className="flex items-center justify-between py-3 px-4">
      
      <div className="flex items-center gap-2">
        {showBack && (
          <button onClick={onBack} className="px-3 py-1 rounded bg-primary text-white">
            ← 뒤로
          </button>
        )}
      </div>
      {showLogout && (
        
        <button onClick={onLogout} className="px-3 py-1 rounded  text-primary/70 text-xs hover:text-white/50 ">
          로그아웃
        </button>
      )}
    </header></>
  );
}
