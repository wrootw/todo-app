import { useState } from "react";
import { useAuthStore } from "../stores/auth.js"
import { api } from "../lib/api.js";
import { useNavigate, Link } from "react-router-dom"


export default function Login(){
    const navigate= useNavigate();
    const login= useAuthStore((s) => s.login);
    const [email, setEmail]= useState("");
    const [password, setPassword]= useState("");
    const [err, setErr]= useState("");

    async function onSubmit(e: React.FormEvent){
        e.preventDefault();
        setErr("");
        try {1
            const { data }= await api.post("/auth/login", { email, password });
            login({token: data.token, user: data.user});
            navigate("/tasks");
        } catch(e:any) {
            setErr(e?.response?.data?.message || "登陆失败");
        }
    }
    
    
    return (
        <div style={{ maxWidth: 360, margin: "80px auto" }}>
        <h1>登录</h1>
        <form onSubmit={onSubmit}>
            <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            style={{ display: "block", width: "100%", marginBottom: 12 }}
            />
            <input
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            style={{ display: "block", width: "100%", marginBottom: 12 }}
            />
            {err && <p style={{ color: "red" }}>{err}</p>}
            <button type="submit">登录</button>
        </form>
        <p style={{ marginTop: 12 }}>
            还没有账号？<Link to="/register">去注册</Link>
        </p>
        </div>
    );
}

