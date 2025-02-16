import useUpdateChats from "./useUpdateChats";
import { sendMessage } from "@/services/services";
import { useState } from "react";
const useSendMessage = () => {
  const {updateAllMessages} = useUpdateChats();
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("") 
  const sendMessageAndUpdate = async (chatId, message) => {
    setLoading(true);
    try {
      await sendMessage(chatId, message);
      await updateAllMessages();
      setLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setError(error);
      setLoading(false);
    }
   
  };

  return { sendMessageAndUpdate,error,loading };
};

export default useSendMessage;
