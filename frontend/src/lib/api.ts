import axios from "axios";
import {useAuthStore} from "../stores/auth"


export const api= axios.create({
    baseURL: "/api",
    timeout: 15000
})

api.interceptors.request.use((config) => {
    const token= useAuthStore.getState().token || localStorage.getItem("token");
    if(token) {
        config.headers= config.headers || {};
        config.headers.Authorization= `Bearer ${token}`;        
    };
    return config;
})

api.interceptors.response.use((res) => res, (err) => {
    const status= err?.response.status;
    const token = useAuthStore.getState().token || localStorage.getItem("token");
    console.log("[send token]", token?.slice(0, 24));
    if (status === 401) useAuthStore.getState().logout();
    return Promise.reject(err);
})