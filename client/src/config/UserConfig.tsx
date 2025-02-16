import React, { createContext, useState, ReactNode } from "react";
//Add new schema here

interface Message {
  id: string;
  sender: string;
  recipient: string;
  messageContent: string;
  timestamp: Date;
}
interface Chat{
  id:string;
  participants:string[];
  messages:Message[];
  createdAt:Date;
  updatedAt:Date;
  }
  interface Friend {
    id:string;
    username:string;
  }
  interface User {
    username:string;
    id:string;
    friends:Friend[];
    friendRequests:Friend[];
    chats:Chat[];
  }

//Update ConfigType here in this format -->  functionName:(argument:argumentType)=>returnType;
interface UserConfigType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  updateChats:(chats:Chat[])=>void;
}
//Dont touch
export const UserConfigContext = createContext<UserConfigType | undefined>(
  undefined
);
//Update your new declared function below
export const UserConfigProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
  username:"",
  id:"",
  friends:[],
  friendRequests:[],
  chats:[]  
  })

 const updateChats = (newChats:Chat[])=>{
  setUser((prev)=>({...prev,chats:newChats}))
 }

//Update new function or config here

  return (
    <UserConfigContext.Provider
      value={{ user, setUser,updateChats }}//update the name of your function here
    >
      {children}
    </UserConfigContext.Provider>
  );
};
/*When u want use global variable anywhere else :
import { useContext } from "react";
import { ChatsConfigContext } from "@/config/ChatsConfig";

inside the function or component u want to use:

const chatContext = useContext(ChatsConfigContext);
const {your function or object} = chatContext;

*/