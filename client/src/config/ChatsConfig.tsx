import React, { createContext, useState, ReactNode } from "react";
//Add new schema here
interface User {
    username:string,
    _id:string
}
interface Message {
  _id: string;
  sender: string;
  recipient: string;
  messageContent: string;
  timestamp: Date;
}
interface UserChats {
  user: User;
  received: Message[];
  sent: Message[];
}


//Update ConfigType here in this format -->  functionName:(argument:argumentType)=>returnType;
interface ChatsConfigType {
  userChats: UserChats;
  setUserChats: React.Dispatch<React.SetStateAction<UserChats>>;
  setUser:(user:User)=>void;
  updateMessages: (messages: Message[]) => void;
}
//Dont touch
export const ChatsConfigContext = createContext<ChatsConfigType | undefined>(
  undefined
);
//Update your new declared function below
export const ChatsConfigProvider = ({ children }: { children: ReactNode }) => {
  const [userChats, setUserChats] = useState<UserChats>({
    user: {username:"",_id:""},
    received: [],
    sent: [],
  });
  const setUser = (user:User)=>{
    setUserChats((prev)=>({...prev,user:user}));
  }
  const updateMessages = (messages: Message[]) => {
    const recieved = messages.filter(
      (message) => message.recipient === userChats.user._id
    );
    const sent = messages.filter(
      (message) => message.sender === userChats.user._id
    );

    setUserChats((prev) => ({ ...prev, recieved: recieved, sent: sent }));
  };
//Update new function or config here

  return (
    <ChatsConfigContext.Provider
      value={{ userChats, setUserChats,setUser, updateMessages }}//update the name of your function here
    >
      {children}
    </ChatsConfigContext.Provider>
  );
};
/*When u want use global variable anywhere else :
import { useContext } from "react";
import { ChatsConfigContext } from "@/config/ChatsConfig";

inside the function or component u want to use:

const chatContext = useContext(ChatsConfigContext);
const {your function or object} = chatContext;

*/