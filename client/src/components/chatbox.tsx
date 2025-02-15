import { deleteMessage, seeChatLog, sendMessage } from "@/services/services";
import { Button, Card, CardBody, CardHeader, Form, Input } from "@heroui/react";
import { useEffect, useState } from "react";

const Chatbox = (props: any) => {
    const {chatId} = props;
    const [messages, setMessages] = useState<any []>([]);
    const [newMsg, setNewMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // ! replace with your actual authenticated user data
    const currentUser = {_id: 'currentUserId', username: 'currentUser'};

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const data = await seeChatLog(chatId);
            setMessages(data.messages);
        } catch (err: any) {
            setError('failed to fetch messages');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (chatId) {
            fetchMessages();
        }
    }, [chatId]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMsg.trim()) return;
        try {
            await sendMessage(currentUser._id, chatId, newMsg);
            setNewMsg('');
            fetchMessages();
        } catch (err: any) {
            setError('failed to send message');
        }
    }

    const handleDelete = async (messageId: string) => {
        if (window.confirm('Are you sure you want to delete this message?'))
        try {
            await deleteMessage(chatId, messageId); //@manzo include deletemessage from services
            fetchMessages();
        } catch (err: any) {
            setError('Failed to delete message');
        }
    }

    return (
        <Card>
            <CardHeader>
                <h2>Chat</h2>
            </CardHeader>
            <CardBody>
                {loading && <p>Loading messages...</p>}
                {error && <p className='text-red-500'>P{error}</p>}
                <div style={{maxHeight: '300px', overflowY: 'auto'}} className="mb-4">
                    {messages.map((msg) => (
                        <div key={msg._id} className="p-2 border-b">
                            <p>{msg.messageContent}</p>
                            <p className="text-xs text-gray-500">
                                {msg.sender === currentUser._id ? 'You' : msg.sender} -{' '}
                                {new Date(msg.timestamp).toLocaleString()}
                            </p>
                            {msg.sender === currentUser._id && (
                                <Button onPress={() => handleDelete(msg._id)} variant="flat" color="danger" size="sm">Delete</Button>
                            )}
                        </div>    
                    ))}
                </div>
                <Form onSubmit={handleSend} className="flex items-center">
                    <Input name="message" value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Type a message!" className="flex-grow mr-2" />
                    <Button type="submit">Send</Button>
                </Form>
            </CardBody>
        </Card>
    )
}

export default Chatbox;