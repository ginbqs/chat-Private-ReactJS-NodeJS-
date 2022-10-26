import React, { useState, useEffect, useRef,useCallback } from 'react';
import styled from 'styled-components'
import axios from 'axios'
import {v4 as uuid4} from 'uuid'

import { getAllMessageRoute, sendMessageRoute } from '../utils/APIRoutes'
import ChatInput from './ChatInput';
import Logout from './Logout';
import Message from './Message';


export default function ChatContainer({ currentChat, currentUser, socket }) {
    const [messages, setMessages] = useState([])
    const [arrivalMessage, setArrivalMessage] = useState(null)
    const scrollRef = useRef();


    const handleSendMsg = async (msg) => {
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg
        })
        await socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: msg,
        })
        const msgs = [...messages]
        msgs.push({ fromSelf: true, message: msg,sender: currentUser._id})
        setMessages(msgs)
    }
    useEffect(() => {
        async function getAllMessage() {
            const response = await axios.post(getAllMessageRoute, {
                from: currentUser?._id,
                to: currentChat?._id
            })
            setMessages(response.data)
        }
        if(currentUser && currentChat){
            getAllMessage()
        }
    }, [currentChat])
    const handleInviteAccepted = useCallback((data) => {
        if(data.sender==currentChat._id){
            setArrivalMessage({ fromSelf: false, message: data.msg, sender: data.sender })
        }
    }, [currentChat]);
    useEffect(() => {
        if (socket.current && currentChat) {
        
            socket.current.on('msg-recieve', handleInviteAccepted);
            return () => {
            // before the component is destroyed
            // unbind all event handlers used in this component
            socket.current.off("msg-recieve", handleInviteAccepted);
            };
        }
    }, [currentChat,socket])
    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
    }, [arrivalMessage])

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])
    return (
        <>
            {
                currentChat && (
                    <Container>
                        <div className="chat-header">
                            <div className="user-details">
                                <div className="avatar">
                                    <img src='/sercretuser.png' alt="avatar" />
                                </div>
                                <div className="username">
                                    <h3>{currentChat?.username}</h3>
                                </div>
                            </div>
                            <Logout />
                        </div>
                        {/* <Message /> */}
                        <div className="chat-messages">{
                            messages.map((msg) => {
                                return (
                                    <div ref={scrollRef} key={uuid4()}>
                                        <div className={`message ${msg.fromSelf ? 'sended' : 'recieved'}`}>
                                            <div className="content">
                                                <p>
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }</div>
                        <ChatInput handleSendMsg={handleSendMsg} />
                    </Container>
                )
            }
        </>
    )
}

const Container = styled.div`
display: grid;
grid-template-rows: 10% 80% 10%;
gap: 0.1rem;
overflow: hidden;
@media screen and (min-width: 720px) and (max-width: 1080px) {
grid-template-rows: 15% 70% 15%;
}
.chat-header{
    display:flex;
    justify-content: space-between;
    align-items:center;
    padding:0 2rem;
    .user-details{
        display:flex;
        align-items:center;
        gap:1rem;
        .avatar{
            img{
                height:3rem;
            }
        }
        .username{
            h3{
                color:white;
            }
        }
    }
}
.chat-messages{
    padding:1rem 2rem;
    display:flex;
    flex-direction:column;
    gap:1rem;
    overflow:auto;
    &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
          background-color: #ffffff39;
          width: 0.1rem;
          border-radius: 1rem;
        }
    }
    .message{
        display:flex;
        align-items: center;
        .content{
            max-width:40%;
            overflow-wrap: break-word;
            padding:1rem;
            font-size:1.1rem;
            border-radius:1rem;
            color:#d1d1d1;
        }
    }
    .sended{
        justify-content:flex-end;
        .content{
            background-color:#4f04ff21;
        }
    }
    .recieved{
        justify-content:flex-start;
        .content{
            background-color:#9900ff20;
        }
    }
}
`