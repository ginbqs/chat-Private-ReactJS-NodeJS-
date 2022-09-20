const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const socket = require('socket.io')

const userRoutes = require('./routes/userRoute') 
const messageRoutes = require('./routes/messageRoute') 


const app = express()
require('dotenv').config()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    console.log(req)
    res.send('asu world')
})
app.use("/api/auth",userRoutes)
app.use("/api/messages",messageRoutes)


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connection Success")
}).catch(err => {
    console.log(err.message)
})
console.log(process.env.MONGO_URL)

const server = app.listen(process.env.PORT,() => {
    console.log(`Server Started on Port localhost:${process.env.PORT}`)
})


const io = socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials:true
    }
})

global.onlineUsers = new Map();

io.on("connection",(socket) => {
    global.chatSocket = socket;
    socket.on("add-users",(userId) => {
        onlineUsers.set(userId,socket.id)
    })
    socket.on("send-msg",(data) => {
        const sendUserSocket = onlineUsers.get(data.to)
        console.log(data)
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-recieve",{msg:data.message,sender:data.from})
        }
    })
})