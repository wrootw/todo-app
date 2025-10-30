import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client"
import { BrowserRouter,Route,Routes,Navigate } from "react-router-dom";
import  Login  from "./pages/login";
import  Register  from "./pages/regiter";
import { useAuthStore } from "./stores/auth";
import "./index.css";
import TasksPage from "./pages/tasks";



function PrivateRouter({children}:{children: ReactNode }){
  const token= useAuthStore((s => s.token)) || localStorage.getItem("token");
  return token? children : <Navigate to="/login" replace />
}

function HomeGate() {
  const token = useAuthStore(s => s.token) || localStorage.getItem("token");
  return <Navigate to={token ? "/tasks" : "/login"} replace />;
}


createRoot(document.getElementById("root")!).render(
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeGate />} />        
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
 
);

