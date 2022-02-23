import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "../components/message.js";

const Room = () => {
  const [connection, setConnection] = useState({
    emit: () => undefined,
  });
  const [actualMessage, setActualMessage] = useState("");
  const [previousMessages, setPreviousMessages] = useState([]);
  const [actualSocket, setActualSocket] = useState();
  const router = useRouter();
  const { room } = router.query;

  const handleChangeMessage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActualMessage(event.target.value);
  };

  const sendMesage = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("sending message", actualMessage);

    actualSocket.emit("message", {
      room,
      data: actualMessage,
      username: "User 1",
    });

    setActualMessage("");
  };

  useEffect(() => {
    if (!room) return;
    console.log("use effect", room);
    fetch("/api/socket").finally(() => {
      const socket = io();
      setActualSocket(socket);

      socket.on("connect", () => {
        socket.emit("join", room);
      });

      socket.on("joined", (room) => {
        console.log("I just joined the room ", room);
        // setConnection(() => socket)
        // setTimeout(() => {
        //   sendMesage('ta mère')
        // }, 1000)
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });

      socket.on("message", ({ data, username }) => {
        console.log("Message recevied from ", username, data);
        setPreviousMessages(() => previousMessages.push({ username, data }));
      });
    });
  }, [room]);

  console.log(previousMessages);

  return (
    <div className="w-screen h-screen">
      <p>Room: {room}</p>
      {previousMessages.map((message, index) => (
        <p key={index}>{message}</p>
      ))}

      <div className="flex fixed bottom-0 left-0 m-5">
        <input
          type="text"
          placeholder="Type here"
          value={actualMessage}
          className="input input-bordered input-primary w-full max-w-xs"
          onChange={handleChangeMessage}
        />
        <button className="btn btn-active btn-primary" onClick={sendMesage}>
          Button
        </button>
      </div>
    </div>
  );
};

export default Room;
