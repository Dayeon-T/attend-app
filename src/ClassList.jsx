import {useEffect, useState} from 'react'
import { supabase } from './lib/supabase'

export default function ClassList({onSelect}) {
    const [classes, setClasses] = useState([])

    const load = async () => {
        const {data,error} = await supabase
            .from("classes")
            .select("*")
            .order("id",{ascending:false})

        if(!error) setClasses(data ?? [])
    }

    useEffect(()=>{ load() },[])

    return(
        <div className='border-t-2 border-primary text-[13px]'>
        <ul className='divide-y divide-dashed divide-primary mt-3'>
            {classes.map((c)=>(
                <li key={c.id} className='pb-5 pt-3 flex justify-between items-center'>
                    <div className=''>{c.title}</div>
                    <button
                    className="text-sm text-primary/50 px-2 py-1 rounded hover:text-primary transition-colors duration-200 ease-out "
                    onClick={()=>onSelect?.(c)}
                    >
                        출석체크

                    </button>
                </li>
            ))}
        </ul>
        </div>)}