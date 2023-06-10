import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import secureLocalStorage from "react-secure-storage";

export const RequireAuth = () =>{
    const { auth } = useAuth();
    // console.log(localStorage.getItem('auth'+localStorage.getItem('id')));
    return secureLocalStorage.getItem('isAuth') ? <Outlet/> : <Navigate to="/" />
}