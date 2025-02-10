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
