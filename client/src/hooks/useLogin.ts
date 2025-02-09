import {login } from "@/services/services";
import { useState } from "react";

const useLogin = () =>{
const [userInfo,setUserInfo] = useState(null);
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

const loginUser = async (credentials)=>{
    try{
        setLoading(true);
        const response = await login(credentials);
        setUserInfo(response);
        setLoading(false);
    }
    catch(err){
        console.error(err);
        setError(err.message)
    }
}

return {userInfo,error,loading,loginUser}
}
export default useLogin;