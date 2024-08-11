const express = require('express');
const app = express();
const io = require('socket.io')(8085);
const cors = require('cors');

app.use(
    cors({
        origin: "*",
        allowedHeaders: ['Authorization', 'Content-Type'],
        exposedHeaders: ['Authorization']
    })
);

const users = {};

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] });
  });
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});

