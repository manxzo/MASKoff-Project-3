import axios from "axios";

const SERVER_URL = "http://localhost:3000/api/";

// Helper function to get token from localStorage
const getAuthToken = () => localStorage.getItem("token");

// Create User (Signup)
export const createUser = async (userInfo) => {
  const response = await axios.post(`${SERVER_URL}newuser`, userInfo);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Login User
export const login = async (username, password) => {
  const response = await axios.post(`${SERVER_URL}users/login`, {
    username: username,
    password: password,
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

// Fetch User Data if userId matches token
export const fetchUserData = async (userID) => {
  const token = getAuthToken();

  const response = await axios.get(`${SERVER_URL}user/${userID}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// Logout User
export const logout = () => {
  localStorage.removeItem("token"); // Remove token from localStorage
};

//Find all users and userIds
export const retrieveAllUsers = async () => {
  const response = await axios.get(`${SERVER_URL}users`);
  return response.data;
};

//Send a Friend Request
export const sendFriendReq = async (targetUserId) => {
  const token = getAuthToken();
  const response = await axios.post(`${SERVER_URL}friends/request`, {
    headers: { Authorization: `Bearer ${token}` },
    targetUserId: targetUserId,
  });
  return response.data;
};
//Retrieve Friend Requests for logged in user
export const retrieveFriendReq = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}friends/request`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
//Accept Friend Request
export const acceptFriendReq = async (requesterId) => {
  const token = getAuthToken();
  const response = await axios.post(`${SERVER_URL}friends/accept`, {
    headers: { Authorization: `Bearer ${token}` },
    requesterId: requesterId,
  });
  return response.data;
};
//Retrieve Friend List for logged in user
export const retrieveFriendList = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}friends`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Start Chat between Logged in User and Second Participant
export const startChat = async (participantId) => {
  const token = getAuthToken();
  const response = await axios.post(`${SERVER_URL}chat/create`, {
    headers: { Authorization: `Bearer ${token}` },
    participantId: participantId,
  });
  return response.data;
};

// Find all Chats belonging to Logged in User --> Messages still Encrypted
export const retrieveChats = async () => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Find all messages in the Chat if logged in user is Participant --> Messages Decrypted
export const retrieveChatMessages = async (chatId) => {
  const token = getAuthToken();
  const response = await axios.get(`${SERVER_URL}chat/messages/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
//Sends a message to the chatId if user is a participant
export const sendMessage = async (chatId, message) => {
  const token = getAuthToken();
  const response = await axios.post(`${SERVER_URL}chat/send`, {
    headers: { Authorization: `Bearer ${token}` },
    chatId: chatId,
    message: message,
  });
  return response.data;
};
// Delete message if user is a sender
export const deleteMessage = async (chatId, messageId) => {
  const token = getAuthToken();
  const response = await axios.delete(
    `${SERVER_URL}chat/message/${chatId}/${messageId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

export const createPost = async (postData) => {
  const response = await axios.post(`${SERVER_URL}posts`, postData);
  return response.data;
};

export const getPosts = async () => {
  const response = await axios.get(`${SERVER_URL}posts`);
  return response.data;
};

export const getPost = async (postId) => {
  const response = await axios.get(`${SERVER_URL}posts/${postId}`);
  return response.data;
};

export const updatePost = async (postId, postData) => {
  const response = await axios.put(`${SERVER_URL}posts/${postId}`);
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await axios.delete(`${SERVER_URL}posts/${postId}`);
  return response.data;
};
