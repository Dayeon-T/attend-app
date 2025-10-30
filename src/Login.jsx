import { useState } from "react"
import { supabase } from "./lib/supabase"

export default function Login() {

    const [email, setEmail] = useState("")
    const [pw, setPw] = useState("")
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password: pw,
        })

        setLoading(false)
        if (error) return alert(`failed to login: ${error.message}`)
       
        console.log("session", data.session)
    }

  return (
    <div>
        
                <form onSubmit={onSubmit} className="space-y-3">
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={e=>setEmail(e.target.value)}
                            placeholder="이메일을 입력하세요"
                            required
                            className="block w-full rounded-md border border-[#282828] bg-[#282828] px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none "
                        />
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={pw}
                            onChange={e=>setPw(e.target.value)}
                            placeholder="비밀번호를 입력하세요"
                            required
                            className="block w-full rounded-md border border-[#282828] bg-[#282828] px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none "
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50 active:scale-[.99] transition ease-in-out"
                        >
                            {loading ? "로딩중..." : "로그인"}
                        </button>
                </form>

    </div>
  )
}