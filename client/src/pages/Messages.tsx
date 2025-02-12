import { ChatsConfigContext } from "@/config/ChatsConfig";
import useGetUserList from "@/hooks/useGetUsers";
import useSendMessage from "@/hooks/useSendMessage";
import useUpdateMessages from "@/hooks/useUpdateMessages";
import DefaultLayout from "@/layouts/default";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState,useContext } from "react";
///message TESTING 
export const Messages = () => {
    const context = useContext(ChatsConfigContext);
    const {userChats} = context;
    const {received,sent,user} = userChats;
  const { loading, error, users } = useGetUserList();
  const {sendAndUpdateMessages } = useSendMessage();
  const {updatedMessages} = useUpdateMessages()
    const [message,setMessage]=useState("")
    const handleInputChange = (event)=>{
        setMessage(event.target.value);
    }
    const handleSubmit = (event)=>{
        event.preventDefault();
        sendAndUpdateMessages(user._id,message)
    }
  return (
    <DefaultLayout>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <p>{user.username}</p>
            <p>{user._id}</p>
            <Input name="message" value={message} onChange={handleInputChange}/>
            <Button onPress={handleSubmit}>Send Message</Button>
          </li>
        ))}
      </ul>
      <Button onPress={updatedMessages}>Update</Button>
        <ul>
           {received.map((message)=>(
            <li key={message._id}>
                <p>{message.recipient}</p>
                <p>{message.sender}</p>
                <p>{JSON.stringify(message.timestamp)}</p>
            </li>
           ))} 
        </ul>
        <ul>
           {sent.map((message)=>(
            <li key={message._id}>
                <p>{message.recipient}</p>
                <p>{message.sender}</p>
                <p>{JSON.stringify(message.timestamp)}</p>
            </li>
           ))} 
        </ul>
    </DefaultLayout>
  );
};
