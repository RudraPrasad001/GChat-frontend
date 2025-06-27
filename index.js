import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "*" }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

app.get("/", (req, res) => {
  res.json({ message: "HELLP" });
});

io.on('connection', (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on('joinRoom', (roomId) => {
  socket.join(roomId);
});


  socket.on('message', ({text,id,server}) => {
    console.log('Received message:', text);
    console.log("from server: ");
    console.log(server.server);
    socket.to(server.server).emit('message',{text,id});
  });

  socket.on('disconnect', () => {
    console.log("Socket disconnected:", socket.id);
  });
});

server.listen(3000, () => console.log("🚀 Server listening on port 3000"));
