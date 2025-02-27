import { useEffect, useState, useContext } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import DefaultLayout from "@/layouts/default";
import { UserConfigContext } from "@/config/UserConfig";
import useGetUserList from "@/hooks/useGetUsers";
import useSendMessage from "@/hooks/useSendMessage";
import useUpdateMessages from "@/hooks/useUpdateChats";

///message TESTING
export const Messages = () => {
  const [selectedUserId, setSelectedUserId] = useState("")
  const [message, setMessage] = useState("");
  const { users } = useGetUserList();
  const { loading, error, sendMessageAndUpdate } = useSendMessage();
 

  const handleSendMessage = async () => {
    if (!selectedUserId || !message.trim()) return;
    await sendMessageAndUpdate(selectedUserId, message);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <DefaultLayout>
      <div className="flex h-[calc(100vh-200px)] gap-4">
      
        <Card className="w-1/4">
          <CardHeader>Users</CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-2">
              {users?.map((user) => (
                <Button
                  key={user._id}
                  color={selectedUserId === user.id? "primary" : "default"}
                  variant={selectedUserId === user.id ? "solid" : "light"}
                  onPress={() => setSelectedUserId(user._id)}
                >
                  {user.username}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>
       
        <Card className="flex-1 h-full">
          <CardHeader>
            {users?.find((user) => user.id === selectedUser)?.username ||
              "Select a user"}
          </CardHeader>
          <Divider />
          <CardBody className="flex flex-col h-full">
           
            <div className="flex-1 flex flex-col gap-2">
              {selectedUser && (
                <>
                  {userChats.received
                    .filter((message) => message.sender === selectedUser)
                    .map((message) => (
                      <div key={message._id}>{message.messageContent}</div>
                    ))}
                </>
              )}
            </div>
           
            <div>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                disabled={!selectedUser}
              />
              <Button
                isLoading={loading}
                onPress={handleSendMessage}
                disabled={!selectedUser || !message.trim()}
              >
                Send
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
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
      {error && <p>{error}</p>}
    </DefaultLayout>
  );
};
