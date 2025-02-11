import { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { ChatsConfigContext } from "@/config/ChatsConfig";
const SERVER_URL = "http://localhost:3000/api/";

const useLogin = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const contextChat = useContext(ChatsConfigContext);
  const {setUser}=contextChat; 
  const loginUser = async (credentials) => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${SERVER_URL}users/login`, credentials);
      const { token, user } = response.data;
      
      localStorage.setItem("token", token); // 🔹 Store token
      setUserInfo(user);
      setUser(user);
      return response.data;
    } catch (err) {
      setError("Invalid login credentials");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { userInfo, loading, error, loginUser };
};

export default useLogin;
