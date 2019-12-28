const http = require('http');
const express = require('express');
const socketio = require('socket.io');
// cross origin resource sharing policy, if we don't have it, some of our sockets will be ignored
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const PORT = process.env.port || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);


io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    //here we are calling the helper function and pass in the parameters
    const { error, user } = addUser({ id: socket.id, name, room });

    //if there is an error, send error back to the client callback function which requested it
    if(error) return callback(error);

    // a built-in socket.io method
    // room is stored in the user object
    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    // socket.broadcast() sends message to everyone in room but sender
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    // so that the callback at the frontend gets called every time
    // if no error, no error will be passed
    callback();
  });

  // event handler for 'sendMessage'
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
