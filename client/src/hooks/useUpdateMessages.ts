import { useContext ,useState} from "react";
import { ChatsConfigContext } from "@/config/ChatsConfig";
import { findChats } from "@/services/services";
const useUpdateMessages = ()=>{

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const contextChat = useContext(ChatsConfigContext);
    const {updateMessages,userChats:{user}}=contextChat; 

    const updatedMessages = async () => {
      setLoading(true);
      setError("");
      if(user._id){
      try {
        const response = await findChats(user._id)
        const { chats } = response.data;
        updateMessages(chats)
        return response.data;
      } catch (err) {
        setError(err);
        return null;
      } finally {
        setLoading(false);
      }
    }else{
        setLoading(false);
        setError("Login First!")
        return null;
    }
}
    return {loading, error,updatedMessages };
}

export default useUpdateMessages;