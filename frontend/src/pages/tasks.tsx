import { useEffect, useState, useMemo } from "react";
import { api } from "../lib/api";
import { useAuthStore } from "../stores/auth";      
import type { Task,TaskListRes } from "../types/task"

async function fetchTasks(params:{page?:number, limit?:number, q?:string; completed?:boolean | ""}){
     const {page=1, limit=10, q="", completed=""}= params || {};
     const c= typeof completed==="boolean"? String(completed) : "";
     const {data}= await api.get<TaskListRes>("/tasks", {params:{page,limit,q,completed:c}});
     return data;
}

async function createTask(payload:{title:string, description?:string, dueDate?:string | null}){
    const {data}= await api.post<Task>("/tasks", payload);
    return data;
}

async function updateTask(id:string, patch: Partial<Task>) {
    console.log("Updating task with ID:", id, "Payload:", patch); 
    const {data}= await api.patch<Task>(`/tasks/${id}`,patch);
    console.log("Updated task response:", data); 
    return data;
    
}
async function deleteTask(id:string) {
    await api.delete(`/tasks/${id}`);
}


export default function TaskPage() {

    const token = useAuthStore((s) => s.token) || localStorage.getItem("token");
    
    const [items,setItems]= useState<Task[]>([]);
    const [completed, setCompleted]= useState<boolean|"">("");
    const [limit, setLimit]= useState(10);
    const [total, setTotal]= useState(0);
    const [err, setErr]= useState("");
    const [editing, setEditing]= useState<Task | null>(null);
    const [q, setQ]= useState("");
    const [loading, setLoading]= useState(false);
    const [page, setPage]= useState(1);
  

    const pages= useMemo(() => Math.max(1, Math.ceil(total/limit)) , [limit, total] );



    async function  load() {
        setLoading(true); setErr("");
        try{
            const data= await fetchTasks({page, limit, q, completed});
            setItems(data.items);
            setTotal(data.total);            
        }catch(e:any){
            setErr(e.response?.data?.message || "加载失败");
        }finally{
            setLoading(false);
        }
    }
        
    useEffect(() => {
        if (!token) return;      // ✅ 没 token 不请求，避免 401
        load();
        }, [page, q, completed, token]);         

    async function onSave(task: Partial<Task>) {
        try{
            if (editing && editing._id){
                await updateTask(editing._id, task);
            }else{
                await createTask({title: task.title!, description: task.description ?? ""});
            }
            setEditing(null);
            load();
        }catch(e:any){
            alert(e.response?.data?.message || "保存失败");
        }
    }

    async function onToggleCompleted(t: Task) {
        const old = t.completed;
        setItems((list) => list.map(i => i._id === t._id ? { ...i, completed: !old } : i)); // 乐观更新
        try { await updateTask(t._id, { completed: !old });     
        }catch {
             setItems((list) => list.map(i => i._id === t._id ? { ...i, completed: old } : i));              
        }
    } 

    async function onRemove(id:string) {
        if (!confirm("确认删除吗")) return;
        const backup= items;
        setItems(items.filter(i => i._id !== id))
        try{
             await deleteTask(id);
        }catch{
            setItems(backup); alert("删除失败");
        }
    }   

    
    
    return (
        <div style={{maxWidth:800, margin:"20px auto", padding:16}}>
            <h1>Tasks</h1>

            <div style={{display:"flex", gap:8, alignItems:"center", marginBottom:12}}>
                <input value={q || ""} placeholder="搜索词" onChange={(e) => {setPage(1); setQ(e.target.value)}} />
                <select value={String(completed)} onChange={(e)=>{ setPage(1); setCompleted(e.target.value==="true" ? true : e.target.value==="false" ? false : ""); }}>
                    <option value="">全部</option>
                    <option value="true">已完成</option>
                    <option value="false">未完成</option>
                </select>
                <button onClick={()=>setEditing({_id:"" as any, title:"", description:"", completed:false})}>新建</button>
            </div>

            {err && <div style={{color:"red", marginBottom:8}}>{err}</div>}
            {loading? <p>加载中...</p> : (
                <ul style={{listStyle:"none", padding:0}}>
                    {items.map(t =>     
                        <li key={t._id} style={{display:"flex", alignItems:"center", borderBottom:"1px solid #eee", gap:8, padding:"8px 0"}}>
                            <input type="checkbox" checked={t.completed || false} onChange={()=>onToggleCompleted(t)} />
                            <span style={{flex:1, textDecoration:t.completed? "line-through" : "none"}}>{t.title}</span>
                            <button onClick={()=>setEditing(t)}>编辑</button>
                            <button onClick={()=>onRemove(t._id)}>删除</button>
                        </li>
                    )}
                    {items.length===0 && <li>暂无数据</li>}
                </ul>
            )}

            <div style={{display:"flex", gap:8, justifyContent:"center", marginTop:12}}>
                <button disabled={page<=1} onClick={()=>setPage(p=>p-1)}>上一页</button>
                <span>{page} / {pages}</span>
                <button disabled={page>=pages} onClick={()=>setPage(p=>p+1)}>下一页</button>
            </div>

            {editing && <EditorModal task={editing} onClose={()=>setEditing(null)} onSave={onSave} />}
        </div>

        
    )
}

function EditorModal({task, onClose, onSave} : {task:Partial<Task>, onClose:()=>void, onSave:(t:Partial<Task>)=>void}){
    const [title, setTitle]= useState(task.title || "");
    const [description, setDescription]= useState(task.description || "");
    console.log("Saving task:", { title, description });

    return(
        <div style={{position:"fixed", background:"rgba(0,0,0,.3)", display:"grid", inset:0, placeItems:"center"}}>
            <div style={{background:"#fff", minWidth:320, borderRadius:8, padding:16}}>
                <h3>{task._id? "编辑内容":"新建内容"}</h3>            
                <input value={title} placeholder="标题" onChange={e => setTitle(e.target.value)} style={{width:"100%", marginBottom:8}} />
                <textarea value={description} placeholder="描述(可选)" onChange={(e => setDescription(e.target.value))} style={{width:"100%", height:100}} />           
                <div style={{display:"flex", gap:8, justifyContent:"flex-end", marginTop:8}}>
                    <button onClick={onClose}>取消</button>
                    <button disabled={(!title.trim())} onClick={()=>onSave({title,description})}>保存</button>
                </div>
            </div>
        </div>
    )
}