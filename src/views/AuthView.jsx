import Login from "../Login";
import SignIn from "../SignIn";

export default function AuthView({ authTab, setAuthTab }) {
  return (
    <section className="space-y-3">
      {}
      <div className="px-4">
        <div className="relative">
          <div className="flex gap-2">
            <button
              onClick={() => setAuthTab("login")}
              className={`flex-1 py-2 ${
                authTab === "login" ? "text-primary" : "text-gray-400"
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setAuthTab("signup")}
              className={`flex-1 py-2 ${
                authTab === "signup" ? "text-primary" : "text-gray-400"
              }`}
            >
              회원가입
            </button>
          </div>

          {}
          <div className="absolute left-0 right-0 bottom-0 h-[1px] bg-gray-600/40" />

          {}
          <div
            className={`absolute bottom-0 left-0 h-[2px] w-1/2 bg-primary transition-transform duration-300 ease-out ${
              authTab === "signup" ? "translate-x-full" : "translate-x-0"
            }`}
          />
        </div>
      </div>

      {}
      <div className="p-4 relative overflow-hidden ">
        <div
          className={`transition-all duration-300 ease-out ${
            authTab === "login"
              ? "opacity-100 translate-x-0 relative"
              : "opacity-0 -translate-x-2 pointer-events-none absolute inset-4"
          }`}
          aria-hidden={authTab !== "login"}
        >
          <Login />
        </div>
        <div
          className={`transition-all duration-300 ease-out ${
            authTab === "signup"
              ? "opacity-100 translate-x-0 relative"
              : "opacity-0 translate-x-2 pointer-events-none absolute inset-4"
          }`}
          aria-hidden={authTab !== "signup"}
        >
          <SignIn />
        </div>
      </div>
    </section>
  );
}
