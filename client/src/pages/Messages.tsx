import { useEffect,useState,useContext } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import DefaultLayout from "@/layouts/default";
import { ChatsConfigContext } from "@/config/ChatsConfig";
import useGetUserList from "@/hooks/useGetUsers";
import useSendMessage from "@/hooks/useSendMessage";
import useUpdateMessages from "@/hooks/useUpdateMessages";

///message TESTING
export const Messages = () => {
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const { users } = useGetUserList();
  const { loading, error, sendAndUpdateMessages } = useSendMessage();
  const { updatedMessages } = useUpdateMessages();
  const chatContext = useContext(ChatsConfigContext);
  const { userChats } = chatContext;

  useEffect(() => {
    // Update messages periodically
    const interval = setInterval(() => {
      updatedMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) return;

    await sendAndUpdateMessages(selectedUser, message);
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
      <div>
        {/* Users List */}
        <Card>
          <CardHeader>Users</CardHeader>
          <Divider/>
          <CardBody>
            <div>
              {users?.map((user) => (
                <Button 
                key={user._id}
                color={selectedUser === user._id ? "primary" : "default"}
                variant={selectedUser === user._id ? "solid" : "light"}
                onClick={()=>setSelectedUser(user._id)}
                >
                  {user.username}
                </Button> 
              ))}
            </div>
          </CardBody>
        </Card>
        {/* Chat Area */}
        <Card>
          <CardHeader>
            {users?.find((user) => user._id === selectedUser)?.username || "Select a user"}
          </CardHeader>
          <Divider/>
          <CardBody>
            {/* Messages Display */}
            <div>
              {selectedUser && (
                <>
                  {userChats.received
                    .filter((message) => message.sender === selectedUser)
                    .map((message) => (
                      <div key = {message._id}>
                        {message.messageContent}
                      </div>
                    ))}
                </>
              )}
            </div>
            {/* Message Input */}
            <div>
              <Input
                value={message}
                onChange={(e)=>setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message here..."
                disabled={!selectedUser}
              />
              <Button
                isLoading={loading}
                onClick={handleSendMessage}
                disabled={!selectedUser || !message.trim()}
              >
                Send
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
      {/* // <ul>
      //   {users.map((user) => (
      //     <li key={user._id}>
      //       <p>{user.username}</p>
      //       <p>{user._id}</p>
      //       <Input name="message" value={message} onChange={handleInputChange}/>
      //       <Button onPress={handleSubmit}>Send Message</Button>
      //     </li>
      //   ))}
      // </ul>
      // <Button onPress={updatedMessages}>Update</Button>
      //   <ul>
      //      {received.map((message)=>(
      //       <li key={message._id}>
      //           <p>{message.recipient}</p>
      //           <p>{message.sender}</p>
      //           <p>{JSON.stringify(message.timestamp)}</p>
      //       </li>
      //      ))} 
      //   </ul>
      //   <ul>
      //      {sent.map((message)=>(
      //       <li key={message._id}>
      //           <p>{message.recipient}</p>
      //           <p>{message.sender}</p>
      //           <p>{JSON.stringify(message.timestamp)}</p>
      //       </li>
      //      ))} 
      //   </ul> */}
      {error && <p>{error}</p>}
    </DefaultLayout>
  );
};
