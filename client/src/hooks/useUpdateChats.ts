import { useEffect, useContext } from "react";
import { UserConfigContext } from "@/config/UserConfig";
import { retrieveChats, retrieveChatMessages } from "@/services/services";

const useUpdateChats = () => {
  const { updateChats } = useContext(UserConfigContext);

  const updateAllMessages = async () => {
    try {
      const chatsResponse = await retrieveChats();
      const chats = await Promise.all(
        (chatsResponse.chats || []).map(async (chat) => {
          const chatId = chat._id || chat.id;
          const createdAt = new Date(chat.createdAt);
          const updatedAt = new Date(chat.updatedAt);
          const messagesResponse = await retrieveChatMessages(chatId);
          const mappedMessages = messagesResponse.messages.map((message) => ({
            ...message,
            timestamp: new Date(message.timestamp),
          }));
          return {
            ...chat,
            createdAt,
            updatedAt,
            messages: mappedMessages,
          };
        })
      );
      updateChats(chats);
    } catch (error) {
      console.error("Failed to update chats:", error);
    }
  };
const token = localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      console.log("No token found, skipping periodic chat updates.");
      return;
    }
    updateAllMessages();
    const intervalId = setInterval(updateAllMessages, 5000);
    return () => clearInterval(intervalId);
  }, [token]);

  return {updateAllMessages}
};

export default useUpdateChats;
