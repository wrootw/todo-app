import {create} from "zustand"

type User= { id:string; email:string } | null;
type AuthState= { user:User; token:string | null; login:(p:{token:string;user:User}) => void; 
logout: () => void;}

export const useAuthStore= create<AuthState>((set) => ({
    user:null,
    token: localStorage.getItem("token"),
    login:({ token,user }) => { localStorage.setItem("token",token); set({token,user}) },
    logout:() => { localStorage.removeItem("token"); set({ token:null,user:null }); }
}))

export const userAuthStore = useAuthStore;