import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import io from "socket.io-client";
import Message from "../components/message.js";

const Room = () => {
  const [actualMessage, setActualMessage] = useState("");
  const [previousMessages, setPreviousMessages] = useState([]);
  const [socket, setSocket] = useState();
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

    socket.emit("message", {
      room,
      data: actualMessage,
      username: "User 1",
    });

    setActualMessage("");
  };

  //connect socket
  useEffect(() => {
    if (!room) return;
    setSocket(io());
  }, [room]);

  const updateMessages = ({ data, username }) => {
    const message = { data, username };
    setPreviousMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      socket.emit("join", room);
    });

    socket.on("joined", (room) => {
      console.log("I just joined the room ", room);
    });
  }, [socket, room]);

  useEffect(() => {
    if (!socket) return;
    socket.on("message", updateMessages);
  }, [socket]);

  return (
    <div className="w-screen h-screen">
      <p>Room: {room}</p>
      {previousMessages &&
        previousMessages.map((message, index) => (
          <p key={index}>{message.data}</p>
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
