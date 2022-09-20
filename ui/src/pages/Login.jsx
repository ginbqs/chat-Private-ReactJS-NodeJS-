import React,{useState,useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import { toast } from 'react-toastify';
import axios from 'axios';

import Logo from '../assets/logo.svg'
import { loginRoute } from '../utils/APIRoutes';

function Login() {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: "",
        password: "",
        disButton:false
    })
    const toastOption = {
        position:"bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "drak"
    }

    useEffect(() =>{
      if(localStorage.getItem('chatAppUser')){
        // navigate('/')
      }
    },[])

    const handleSubmit = async(event) => {
        event.preventDefault();
        if(handleValidation()){
            setValues({...values,disButton:true})
            const {password, username} = values
            const {data} = await axios.post(loginRoute,{
                username,
                password
            })

            if(data.status == false){
                setValues({...values,disButton:false})
                toast.error(data.msg, toastOption)
            }
            if(data.status){
              console.log(data)
                localStorage.setItem('chatAppUser',JSON.stringify(data.user))
                setValues({...values,disButton:false})
                toast.success(data.msg, toastOption)
                navigate("/")
            }
        }
    }
    const handleValidation = () => {
        const {password, username} = values
        if(password=="" ){
            toast.error("Password is required.",toastOption)
            return false;
        }else if(username.length < 3){
            toast.error("Username should be gratter than 3.",toastOption)
            return false;
        }else if(username.length >=8){
            toast.error("Username should be equal or greater than 8 characters.",toastOption)
            return false;
        }
        return true;
    }
    const handleChange = (event) => {
        event.preventDefault();
        setValues({...values,[event.target.name]:event.target.value})
    }
    

    return (
        <>
            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="Logo"  />
                        <h1>Snappy</h1>
                    </div>
                    <input type="text" className="" placeholder="Username" name="username" onChange={(event) => handleChange(event)} />
                    <input type="password" className="" placeholder="Password" name="password" onChange={(event) => handleChange(event)} />
                    <button type="submit" className="" disabled={values.disButton}>Login</button>
                    <span>dont have account? <Link to="/register">Register</Link></span>
                </form>
            </FormContainer>
        </>
    );
}

const FormContainer = styled.div`
    height:100vh;
    width:100vw;
    display:flex;
    flex-direction:column;
    justify-content:center;
    gap:1rem;
    align-items:center;
    background-color:#131324;
    .brand{
        display: flex;
        align-items:center;
        gap:1rem;
        justify-content:center;
        img{
            height:5rem;
        }
        h1{
            color:white;
            text-transform:uppercase;
        }
    }
    form{
        display:flex;
        flex-direction:column;
        gap:2rem;
        background-color:#00000076;
        border-radius:2rem;
        padding:3rem 5rem;
        input{
            background-color:transparent;
            padding: 1rem;
            border: 0.1rem solid #4e0eff;
            border-radius:0.4rem;
            color:white;
            width:100%;
            font-size:1rem;
            &:focus{
                border: 0.1rem solid #997af0;
                outline: none; 
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
        span{
            color:white;
            text-transform:uppercase;
            a{
                color: #4e0eff;
                text-decoration:none;
                font-weight:bold;
            }
        }
    }
`;
export default Login;
