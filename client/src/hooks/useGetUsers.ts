import {useEffect, useState} from "react";
import { retrieveAllUsers } from "@/services/services";


const useGetUserList = ()=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [users,setUsers] = useState([])
  useEffect(()=>{
    const getAllUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await retrieveAllUsers()
        setUsers(response.users);
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false);
      }

    }
    getAllUsers();

  },[])  
    return {loading, error,users};
}
    

export default useGetUserList