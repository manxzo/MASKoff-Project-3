import { useState, useContext, useEffect } from "react";
import { 
  login, 
  retrieveFriendReq, 
  retrieveFriendList, 
  retrieveChats, 
  retrieveChatMessages 
} from "@/services/services";
import { UserConfigContext } from "@/config/UserConfig";

const useLogin = () => {
  const { user, setUser } = useContext(UserConfigContext);
  const [error, setError] = useState("");
  const [loading,setLoading] = useState(false)
  const loginAndUpdateUser = async (username, password) => {
    setLoading(true)
    try {
      const loginResponse = await login(username, password);
      if (loginResponse.token && loginResponse.user) {
        const userId = loginResponse.user.id;

        // Retrieve additional user data concurrently
        const [friendReqResponse, friendListResponse, chatsResponse] = await Promise.all([
          retrieveFriendReq(),
          retrieveFriendList(),
          retrieveChats()
        ]);

        // For each chat, fetch its decrypted messages
        const chats = await Promise.all(
          (chatsResponse.chats || []).map(async (chat) => {
            const chatId = chat._id || chat.id;
            const createdAt = new Date(chat.createdAt) 
            const updatedAt = new Date(chat.updatedAt) 
            const messagesResponse = await retrieveChatMessages(chatId);
            const mappedMessages = messagesResponse.messages.map((message)=>({...message,timestamp:(new Date(message.timestamp))}))
            return { ...chat,createdAt:createdAt,updatedAt:updatedAt, messages: mappedMessages };
          })
        );

        // Build the complete user object
        const updatedUser = {
          username: loginResponse.user.username,
          id: userId,
          friends: friendListResponse.friends || [],
          friendRequests: friendReqResponse.friendRequests || [],
          chats: chats
        };

        // Update the global user config and store the user ID locally
        setUser(updatedUser);
        setLoading(false)
      } else {
        setError("Login failed: Invalid credentials or server error.");
        setLoading(false)
      }
    } catch (err) {
      console.error("Error in loginAndUpdateUser:", err);
      setError(err.message || "Error during login.");
      setLoading(false)
    }
  };
  return { user, error,loading, loginAndUpdateUser };
};

export default useLogin;
