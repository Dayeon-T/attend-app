import { useState } from "react"
import { supabase } from "./lib/supabase"
import { set } from "react-hook-form"

export default function ClassCreateForm({onCreated}) {

    const [title, setTitle] = useState("")

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!title.trim()) return

        const{data,error} = await supabase
            .from("classes")
            .insert([{title}])
            .select()
            .single()

        if(error) return alert(`수업 생성 실패: ${error.message}`)
        setTitle("")
        onCreated?.(data)

        alert("수업이 생성되었습니다.")
        }

        return(
    <form onSubmit={onSubmit} className="flex justify-between items-center">
        <input
        placeholder="스터디명"
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        required
        className=" w-5/6 rounded-md border border-[#282828] bg-[#393939] px-3 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none " />
        <button className="bg-primary rounded px-3 py-2 text-white">추가</button>
    </form>
        )


}