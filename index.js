const http = require("http") ;
const express = require("express") ;
const cors = require("cors") ;
const socketIO = require("socket.io") ;

const app=express() ;
const port = process.env.PORT || 5000;

const members = [ { } ] ;  

app.use ( cors() );

app.get ( "/", ( req , res ) => { res.send ("Funn-Chat-App is Running") } )

const server = http.createServer( app ) ;

const io=socketIO( server)  ;

io.on ( "connection", ( socket ) => {

    console.log("New Joining");

    socket.on('join',({Data})=>{

        members[ socket.id ] = Data ;

          socket.broadcast.emit ( 'MemberJoined' , { user:"Admin" , message:` ${members[ socket.id ]} has joined`});

          socket.emit('Enter' , {user:"Admin", message:`You join the chat-Room ,${members[ socket.id ]}`})
    })

    socket.on('send',({message,id}) => {  io.emit('sendMessage', {user:members[id] , message , id }) } )

    socket.on('disconnect',() => {  socket.broadcast.emit('Left',{user:"Admin",message:`${members[ socket.id ]}  has left the Chat-Room`}) } )
});

server.listen( port , () => {  console.log(`My App Running ${port}`) } )