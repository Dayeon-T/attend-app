import { useState } from "react"
import { supabase } from "./lib/supabase"

export default function SignIn() {

    const [email, setEmail] = useState("")
    const [pw, setPw] = useState("")
    const [name, setName] = useState("")
    const [studentNo, setStudentNo] = useState("")
    const [loading, setLoading] = useState(false)

    // 경고 후 입력값 비우기 헬퍼
    const showAlertAndReset = (message) => {
        alert(message)
        setEmail("")
        setPw("")
        setName("")
        setStudentNo("")
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // GitHub Pages(서브 경로)와 로컬 모두에서 올바른 리다이렉트를 위해 BASE_URL을 사용
        const redirectTo = new URL(import.meta.env.BASE_URL || '/', window.location.origin).toString()

        const {data, error} = await supabase.auth.signUp({
            email,
            password: pw,
            options: {
                emailRedirectTo: redirectTo,
            },
        })

        if (error) {
            // 사용자 이미 존재하는 경우를 친절한 메시지로 처리
            const msg = String(error.message || '').toLowerCase()
            setLoading(false)
            if (error.code === 'user_already_registered' || msg.includes('already registered') || msg.includes('email address is already registered')) {
                showAlertAndReset('이미 가입된 이메일입니다. 로그인 화면에서 로그인해 주세요.')
            } else {
                showAlertAndReset(`회원가입 실패: ${error.message}`)
            }
            return
        }

        const user = data.user
        if(!user){
            // 이메일 확인(Confirm email)이 켜져 있는 경우 user가 즉시 반환되지 않을 수 있음
            setLoading(false)
            showAlertAndReset("회원가입 요청이 접수되었습니다. 이메일에 전송된 확인 메일을 열어 인증을 완료해 주세요.")
            return
        }  

        const { error: profileError } = await supabase
            .from("profiles")
            .insert({id:user.id, name, student_no: studentNo})

        setLoading(false)

        if(profileError){
            
            if (profileError.code === '23505') {
                
                showAlertAndReset('이미 프로필이 존재합니다. 로그인해 주세요.')
            } else if (profileError.code === '23503') {
                
                showAlertAndReset('프로필 생성 중 오류가 발생했습니다. 이메일 인증을 완료했는지 확인 후 다시 시도해 주세요.')
            } else {
                showAlertAndReset(`프로필 생성 실패: ${profileError.message}`)
            }
        } else {
            showAlertAndReset("회원가입 요청이 접수되었습니다. 이메일에 전송된 확인 메일을 열어 인증을 완료해 주세요.")
        }}



    return (
      <div>
          <form onSubmit={onSubmit} className="space-y-3">
            <select
                aria-label="학교 선택"
                value={studentNo}
                onChange={(e)=>setStudentNo(e.target.value)}
                required
                className="block w-full rounded-md border border-[#282828] bg-[#282828] px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none "
            >
                <option value="" disabled>학교 선택</option>
                <option value="미림">미림</option>
                <option value="성일">성일</option>
            </select>
            <input 
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                required
                className="block w-full rounded-md border border-[#282828] bg-[#282828] px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none " />
            <input 
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
                className="block w-full rounded-md border border-[#282828] bg-[#282828] px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none " />
            
            <input 
                type="password"
                placeholder="비밀번호"
                value={pw}
                onChange={(e)=>setPw(e.target.value)}
                required
                className="block w-full rounded-md border border-[#282828] bg-[#282828] px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none " />
            
            
            
            
            
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-primary px-4 py-2 text-white disabled:opacity-50 active:scale-[.99] transition ease-in-out">
                {loading ? "Loading..." : "회원가입"}

            </button>
          </form>
      </div>
    )
  }