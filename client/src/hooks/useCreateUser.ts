import { createUser } from "@/services/services";
import { useState } from "react";

const useCreateUser = () =>{
const [user,setUser] = useState(null);
const [loading,setLoading] = useState(false);
const [error,setError] = useState("");

const createNewUser = async (userInfo)=>{
    try{
        setLoading(true);
        const response = await createUser(userInfo);
        setUser(response);
        setLoading(false);
    }
    catch(err){
        console.error(err);
        setError(err.message)
    }
}

return {user,error,loading,createNewUser}
}
export default useCreateUser;