import { useRouter } from 'next/router'
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from '../components/message.js'


const Room = () => {
  const [connection, setConnection] = useState({
    emit: () => undefined
  })
  const router = useRouter()
  const { room } = router.query

  const sendMesage = (data) => {
    console.log('sending message', data)
    connection.emit("message", {
      room,
      data,
      username: "User 1",
    });
  }

  useEffect(() => {
    if (!room) return
    console.log('use effect', room)
    fetch("/api/socket").finally(() => {
      const socket = io();

      socket.on("connect", () => {
        socket.emit("join", room);
      });

      socket.on("joined", (room) => {
        console.log("I just joined the room ", room);
        // setConnection(() => socket)
        // setTimeout(() => {
        //   sendMesage('ta mère')
        // }, 1000)
        socket.emit("message", {
          room,
          data: 'hey hey hey',
          username: "User 1",
        });
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });

      socket.on("message", ({ data, username }) => {
        console.log("Message recevied from ", username, data)
      });

    });
  }, [room]); 

  const messageProv = [
    {from:"mouloude", data:"bonsoir Paris"},
    {from:"edouard", data:"bonsoir Paris"},
    {from:"josé", data:"bonsoir Paris"},
    {from:"mouloude", data:"bonsoir Paris"},
    {from:"mouloude", data:"bonsoir Paris"}
  ]

  return <div className='w-screen h-screen'>
          <p>Room: {room}</p>
          {messageProv.map((message)=>{
            <div></div>
          })}
          <div className="flex fixed bottom-0 left-0 m-5">
            <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full max-w-xs"/>
            <button className="btn btn-active btn-primary">Button</button>
          </div>
        </div>
}

export default Room


