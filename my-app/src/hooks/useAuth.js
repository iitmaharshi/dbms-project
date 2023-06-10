import { useContext } from "react";
import authContext from "../context/authProvider";

export const useAuth = ()=>{
    return useContext(authContext);
}
