import React,{useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import { toast } from 'react-toastify';
import axios from 'axios';
import {Buffer} from 'buffer';

import loader from '../assets/loader.gif'
import { setAvatarRoute } from '../utils/APIRoutes';

function SetAvatar() {
    const api = "https://api.multiavatar.com/45678945"
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOption = {
        position:"bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "drak"
    }
    useEffect(() =>{
        if(localStorage.getItem('chatAppUser')){
          navigate('/')
        }
      },[])
    const setProfilePicture = async(event) => {
        event.preventDefault();
        if(selectedAvatar == undefined){
            toast.error("Please select an avatar",toastOption)
        }else{
            const user = await JSON.parse(localStorage.getItem("chatAppUser"))
            const {data} = await axios.post(`${setAvatarRoute}/${user._id}`,{
                image: avatars[selectedAvatar]
            })
            if(data.isSet){
                user.isAvatarImageSet = true;
                user.avatarImage = data.image;
                localStorage.setItem("chatAppUser",JSON.stringify(user))
                navigate("/")
            }else{
                toast.error("Error Setting avatar. please try again",toastOption)
            }
        }
    }

    useEffect(() =>{
        async function fetchMyImage() {
            const data = []
            for(let i=0;i<4;i++){
                const image = await axios.get(`${api}/${Math.random()*1000}`)
                const buffer = new Buffer(image.data)
                data.push(buffer.toString("base64"))
            }
            setAvatars(data)
            setIsLoading(false)
        }
        fetchMyImage();
    },[])

    return (
        <>
            {
                isLoading ? <Container>
                    <img src={loader} alt="loader" className="loader" />
                </Container> : (

                <Container>
                <div className="title">
                    <h1>Pick an avatar as your profile picture</h1>
                </div>
                <form onSubmit={(event) => setProfilePicture(event)}>
                <div className="avatar">
                    {
                        avatars.map((avatar,index) =>{
                            return (
                                <div className={`avatar ${selectedAvatar == index ? "selected" : ""}`} key={index}>
                                    <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" 
                                        onClick={() => setSelectedAvatar(index)}
                                    />
                                </div>
                            )
                        })
                    }
                </div>
                </form>
                <button type="submit" className="" >SET AS PROFILE PICTURE</button>
                </Container>
                )
            }
        </>
    );
}

const Container = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    gap: 3rem;
    background-color:#131324;
    height:100vh;
    width:100vw;
    .loader{
        max-inline-size: 100%;
    }

    .title{
        h1{
            color:white;
        }
    }

    .avatars{
        display:flex;
        gap:2rem;
        .avatar{
            border:0.4rem solid transparent;
            padding: 0.4rem;
            border-radius:5rem;
            display:flex;
            justify-content:center;
            align-items:center;
            transition:0.5s ease-in-out;
            img{
                height:6rem
            }
        }
        .selected{
            border:0.4rem solid #4e0eff
        }
    }
    button{
        background-color:#997af0;
        color: white;
        padding: 1rem 2rem;
        border:none;
        font-weight:bold;
        cursor:pointer;
        boder-radius:0.4rem
        font-size:1rem;
        text-transform:uppercase;
        transition:0.5s ease-in-out;
        &:hover{
            background-color:#4e0eff;
        }
    }
`;
  
export default SetAvatar;
  