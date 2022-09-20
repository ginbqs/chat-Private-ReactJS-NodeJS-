import React,{ useState, useEffect, useRef,} from 'react';
import styled from 'styled-components'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {io} from 'socket.io-client'


import { allUsersRoute,host } from '../utils/APIRoutes';
import Contact from '../component/Contact'
import Welcome from '../component/Welcome';
import ChatContainer from '../component/ChatContainer';

function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentUser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  const [isLoaded, setIsLoaded] = useState(false)

  const navigate = useNavigate()

  useEffect(() =>{
    async function fetchUser() {
      if(!localStorage.getItem('chatAppUser')){
        navigate('/login')
      }else{
        setCurrentUser(await JSON.parse(localStorage.getItem('chatAppUser')))
        setIsLoaded(true)
      }
    }
    fetchUser();
  },[])
  useEffect(() =>{
    if(currentUser){
      socket.current = io(host)
      socket.current.emit("add-users",currentUser._id)
    }
  },[currentUser])
  useEffect(() => {
    async function fetchAllUsers() {
      if(currentUser){
        if(currentUser.isAvatarImageSet){
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`)
          setContacts(data.data.users)
        }
        // else{
        //   navigate('/setavatar')
        // }
      }

    }
    fetchAllUsers();
  },[currentUser])
  const handleChatChange = (chat) => {
    console.log('current chat')
    console.log(chat)
    setCurrentChat(chat)
  }

  return (
    <Container>
      <div className="container">
        <Contact contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        {
          isLoaded && currentChat==undefined ? 
          <Welcome currentUser={currentUser} /> :
          <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
        }
      </div>
    </Container>
  );
}

const Container = styled.div`
  height:100vh;
  width:100vw;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:1rem;
  align-items:center;
  background-color:#131324;
  .container{
    height:85vh;
    width:85vw;
    background-color: #00000076;
    display:grid;
    color:white;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`

export default Chat;
