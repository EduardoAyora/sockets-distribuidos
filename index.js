const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const app = express();
app.use(cors({
  origin: '*'
}));
const server = http.createServer(app);
const io = new Server(server, {cors: {
  origin: "*",
  methods: ["GET", "POST"]
}});

const messagesDB = []

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('load all', messagesDB);
  socket.on('chat message', (msg) => {
    messagesDB.push(msg)
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});