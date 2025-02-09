import axios from "axios";
const SERVER_URL = "http://localhost:3000/api/"

export const createUser = async(userInfo)=>{
    const response = await axios.post(`${SERVER_URL}newuser`,{userInfo});
    return response.data;
}

export const login = async(credentials)=>{
    const response = await axios.post(`${SERVER_URL}login`,{credentials})
    return response.data;
}

export const fetchUserData = async(userID)=>{
 const response = await axios.get(`${SERVER_URL}user/${userID}`)
 return response.data;
}