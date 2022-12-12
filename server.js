const dotenv = require('dotenv');
const app=require("./app");
const http=require("http");
const worklab = require('./config/Modules/Models/worklab');

dotenv.config()

const PORT =  4000;
app.set("PORT",PORT)
const server=http.createServer(app)
const io = require('socket.io')(server , {cors:{ origin : "*"}})
server.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}...`))



let onlineUsers =[]

const addNewUser = (clientId , socketId)=>{
    if(!onlineUsers.some((user)=>user.clientId === clientId)) {
        onlineUsers.push({clientId , socketId})
    }
}

 const removeUser = (socketId)=>{ onlineUsers = onlineUsers.filter(user=>{return user.socketId!==socketId }) }


 const getUser = (clientId)=>{ return onlineUsers.find(user=>user.clientId === clientId)} 

 io.on('connection' , (socket)=>{
    
    io.emit('aa' , 'another user is connected')
    socket.on('newUser', (clientId)=>{
        console.log('a user connected')
        addNewUser(clientId ,socket.id)
        console.log(onlineUsers)
    })


    socket.on('disconnect',_=>{
        removeUser(socket.id)
        // console.log(onlineUsers)
        // console.log('user left')
      
    })


    socket.on('join',(obj)=>{
        console.log(obj.id);
       worklab.findOne({_id : obj.id} , {auther : 1}).then(res=>{
        console.log(res);
        const recever = getUser(res.auther)
        console.log(res.auther);
        if(recever)
        io.to(recever.socketId).emit('accept' , {participantName :obj.name , participantId : obj.userId , worklabId : res._id})
       })
        // for(let rec of obj.collab){
            
        //     const recever = getUser(rec)
        //     // console.log(recever)
        //     if(recever)
        // io.to(recever.socketId).emit('getArticleUpdated' , {title :obj.title , section : obj.section})
        // }
    })

    socket.on('accept',(obj)=>{
        const recever = getUser(obj.id)
        if(recever)
        io.to(recever.socketId).emit('accepted' , {msg : obj.message , worklabId : obj.worklabId});
     
        // for(let rec of obj.collab){
            
        //     const recever = getUser(rec)
        //     // console.log(recever)
        //     if(recever)
        // io.to(recever.socketId).emit('getArticleUpdated' , {title :obj.title , section : obj.section})
        // }
    })
 })