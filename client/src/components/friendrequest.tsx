import { Accordion, AccordionItem, Button, Divider } from "@heroui/react";
import { useState } from "react";

const FriendRequest = () => {
    const [requests, setRequests] = useState([
        //simulate data first
        {_id: '999', username: 'Simon', mutualFriends: 3, message: 'I love Manzo'},
        {_id: '998', username: 'Sally', mutualFriends: 2, message: 'Hi friend'}
    ])

    const handleAccept = (id: string) => {
        // API call
        console.log('friend request accepted: ', id);
        setRequests(requests.filter((req) => req._id !== id));
    }

    const handleDecline = (id: string) => {
        // API call
        console.log('friend request declined: ', id);
        setRequests(requests.filter((req) => req._id !== id));
    }

    return (
        <div className="p-4">
            <Accordion>
                {requests.map((request) => (
                    <AccordionItem key={request._id} title={
                        <div>
                            <span className="font-semibold">{request.username}</span>
                            <span>{request.mutualFriends} mutual friend{request.mutualFriends !== 1 ? 's' : ''}</span>
                        </div>
                    }>
                        <div>
                            {request.message && <p>{request.message}</p>}
                            <div>
                                <Button onPress={() => handleAccept(request._id)} variant='flat' color='success'>Accept</Button>
                                <Button onPress={() => handleDecline(request._id)} variant='flat' color='danger'>Decline</Button>
                            </div>
                        </div>
                        <Divider />
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default FriendRequest;