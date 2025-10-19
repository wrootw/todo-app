import axios from "axios";
import {userAuthStore} from "../stores/auth"


export const api= axios.create({
    baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
    timeout: 15000
})

api.interceptors.request.use((config) => {
    const token= userAuthStore.getState().token || localStorage.getItem("token");
    if(token) {
        config.headers= config.headers || {};
        config.headers.Authorization= `Bearer ${token}`;        
    };
    return config;
})

api.interceptors.response.use((r) => r, (e) => {
    if (e?.response?.getState === 401) userAuthStore.getState().logout;
    return Promise.reject(e);
})