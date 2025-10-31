import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import HeaderBar from './components/HeaderBar'
import AuthView from './views/AuthView'
import HomeView from './views/HomeView'
import ClassDetailView from './views/ClassDetailView'
import Logo from './Logo'
import { Toaster } from "react-hot-toast";

export default function App() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('auth') 
  const [selectedClass, setSelectedClass] = useState(null)
  const [authTab, setAuthTab] = useState('login') 
  const [isAdmin, setIsAdmin] = useState(false) 

  useEffect(() => {
    let mounted = true
    const load = async (sessionUser) => {
      if (!sessionUser) {
        setIsAdmin(false)
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', sessionUser.id)
        .maybeSingle()
      if (mounted) setIsAdmin(!!profile?.is_admin)
    }

    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      const u = data.session?.user ?? null
      setUser(u)
      setPage(u ? 'home' : 'auth')
      await load(u)
    }
    init()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return
      const u = session?.user ?? null
      setUser(u)
      setPage(u ? 'home' : 'auth')
      if (!u) setSelectedClass(null)
      load(u)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
  }

  const openClass = (cls) => {
    setSelectedClass(cls)
    setPage('class')
  }

  const goHome = () => {
    setSelectedClass(null)
    setPage('home')
  }

  const title = page === 'auth' ? <Logo/> : page === 'home' ? '' : (selectedClass?.title || '');

  return (
    <>
      {/* 전역 토스트 */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          // 기본(성공/정보 등)
          duration: 3000,
          style: { background: "#1794f6", color: "#fff", fontSize: "12px" },
          success: { icon: null },

          // error일 때만 별도 스타일 적용
          error: {
            duration: 4000,
            icon: null, // X 아이콘 숨김
            style: {
              background: "rgba(220,38,38,0.90)", // red-600 /90
              color: "#fff",
            },
            // 또는 className 사용 가능:
            // className: "bg-red-600/90 text-white border border-red-400 shadow-lg",
          },
        }}
      />
    
    <div className="min-h-screen w-full flex justify-center bg-[#171717]">
      
      <main className="w-[393px] p-4 bg-[#171717]">
        <Logo />
        <HeaderBar
          title={title}
          showBack={page !== 'home' && page !== 'auth'}
          onBack={goHome}
          showLogout={!!user}
          onLogout={logout}
        />

        {}
        {page === 'auth' && (
          <AuthView authTab={authTab} setAuthTab={setAuthTab} />
        )}

        {}
        {page === 'home' && user && (
          <HomeView isAdmin={isAdmin} onSelectClass={openClass} />
        )}

        {}
        {page === 'class' && user && selectedClass && (
          <ClassDetailView selectedClass={selectedClass} isAdmin={isAdmin} user={user} />
        )}
      </main>
    </div>
    </>
  )
}
