import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client"
import { BrowserRouter,Route,Routes,Navigate } from "react-router-dom";
import  Login  from "./pages/login";
import  Register  from "./pages/regiter";
import { useAuthStore } from "./stores/auth";
import "./index.css";



function PrivateRouter({children}:{children: ReactNode }){
  const token= useAuthStore((e => e.token)) || localStorage.getItem("token");
  return token? children : <Navigate to="/login" replace />
}

function TasksPage(){
  return <div style={{padding:24}}>TasksPage 页面显示</div>
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/tasks" replace />} />        
          <Route 
            path="/tasks" 
            element={
              <PrivateRouter>
                <TasksPage />
              </PrivateRouter>
            } />      
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

