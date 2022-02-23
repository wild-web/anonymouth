import { Server } from "socket.io";

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);

    io.on("connection", (socket) => {
      socket.on("join", (room) => {
        socket.join(room);
        socket.emit('joined', room);
      });
      socket.on("disconnecting", () => {
        console.log(socket.rooms); // the Set contains at least the socket ID
      });

      socket.on("disconnect", () => {
        // socket.rooms.size === 0
      });

      socket.on("message", ({ room, username, data }) => {
        console.log("emitting to room", room, { username, data });
        io.to(room).emit("message", { username, data })
      })
    });
    res.socket.server.io = io;
  }

  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default ioHandler;
