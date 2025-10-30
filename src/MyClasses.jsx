// src/components/MyClasses.jsx
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function MyClasses({ onSelect }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes?.user;
      if (!user) return;

      const { data } = await supabase
        .from("enrollments")
        .select("class_id, classes ( id, title,join_code )")
        .eq("student_id", user.id);

      setList((data ?? []).map((r) => r.classes));
    })();
  }, []);

  return (
    <div className='border-t-2 border-primary text-[13px]'>
    <ul className="divide-y divide-dashed divide-primary mt-3">
      {list.map((c) => (
        <li key={c.id} className='pb-5 pt-3 flex justify-between items-center'>
          <span>{c.title}</span>
          <button className="text-blue-600" onClick={() => onSelect?.(c)}>
            선택
          </button>
        </li>
      ))}
    </ul></div>
  );
}
