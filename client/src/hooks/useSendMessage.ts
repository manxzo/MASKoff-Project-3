import { useContext ,useState} from "react";
import { ChatsConfigContext } from "@/config/ChatsConfig";
import { findChats, sendMessage } from "@/services/services";


const useSendMessage = ()=>{

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const contextChat = useContext(ChatsConfigContext);
    const {updateMessages,userChats:{user}}=contextChat; 
   
    const sendAndUpdateMessages = async (recipient,message) => {
      setLoading(true);
      setError("");
      if(user._id){
      try {
        const responseSend = await sendMessage(user._id,recipient,message)
        const responseMsgs = await findChats(user._id)
        const { chats } = responseMsgs.data;
        const {message:alert} = responseSend.data;
        
        updateMessages(chats)
      } catch (err) {
        setError("Invalid login credentials");
        return null;
      } finally {
        setLoading(false);
      }
    }else{
        setLoading(false);
        setError("Login First!")
    }
}
    return {loading, error,sendAndUpdateMessages,alert};
}
export default useSendMessage;