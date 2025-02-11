import axios from 'axios';

const SERVER_URL = "http://localhost:3000/api/";

// Helper function to get token from localStorage
const getAuthToken = () => localStorage.getItem('token');

// 🔹 Create User (Signup)
export const createUser = async (userInfo) => {
    const response = await axios.post(`${SERVER_URL}newuser`, userInfo);
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store token
    }

    return response.data;
};

// 🔹 Login User
export const login = async (credentials) => {
    const response = await axios.post(`${SERVER_URL}users/login`, credentials);
    
    if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store token
    }

    return response.data;
};

// 🔹 Fetch User Data (Protected Route)
export const fetchUserData = async (userID) => {
    const token = getAuthToken();

    const response = await axios.get(`${SERVER_URL}user/${userID}`, {
        headers: { Authorization: `Bearer ${token}` } // Attach JWT token
    });

    return response.data;
};

// 🔹 Logout User
export const logout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
};

export const retrieveAllUsers = async ()=>{
    const response = await axios.get(`${SERVER_URL}users`);
    return response.data;
}

export const startChat = async (participants)=>{

    const response = await axios.post(`${SERVER_URL}chat/create`,{
        user1:participants.user1,
        user2:participants.user2
    })
 return response.data;
}
export const findChats = async(userId)=>{
    const response = await axios.get(`${SERVER_URL}chat/${userId}`);
    return response.data;
}

export const sendMessage = async(sender,recipient,message)=>{
const response = await axios.post(`${SERVER_URL}chat/send`,{
sender:sender,
recipient:recipient,
message:message
})
return response.data;
}

export const seeChatLog = async(chatId)=>{
    const response = await axios.get(`${SERVER_URL}chat/messages/${chatId}`);
    return response.data;
}