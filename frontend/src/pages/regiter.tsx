import { useState } from "react";
import { api } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";


export default function Register(){
    const navigate= useNavigate();
    const [mes, setMes]= useState("");
    const [password, setPassword]= useState("");
    const [email, setEmail]= useState("");
    const [err, setErr]= useState("");

    async function onSubmit(e: React.FormEvent){
        e.preventDefault();
        setErr(""); setMes("");
        try{
            await api.post("/auth/register", {password, email});
            setMes("注册成功");
            setTimeout(() => {
               navigate("/Login"); 
            }, 800);
        } catch(e: any){
            setErr(e?.response?.data?.message || "注册失败");
            console.error(e)
        }
    }

    return(
        <div style= {{width:360, margin: "80px auto"}}>
            <h1>开始注册</h1>
            <form onSubmit={onSubmit}>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="email" required style={{display:"block", width:"100%", marginBottom:12}} />
                <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="password" required style={{display:"blcok", width:"100%", marginBlock:12}} />
                {mes && <p style={{color:"green"}}>{mes}</p>}
                {err && <p style={{color:"red"}}>{err}</p>}
                <button type="submit">注册</button>
            </form>
            <p  style={{marginTop:12}}>
                已有账号？<Link to="/Login">去登陆</Link>
            </p>
        </div>
    );
}

