const app = require('express')();
const { Server } = require("socket.io");
const cors = require("cors");
const server = require('http').createServer(app);

app.use(cors());

const port = 4000;

app.get('/', function (req, res) {
    res.json({
        msg: ""
    });
});

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
    },
});

let chatRoom = ''; 
let users = [];
let messages = [];


io.on('connection', (socket) => {
    console.log(`User Connected ${ socket.id }`);
    socket.join('room');
    socket.on('newuser', data => {
        console.log(data);
        if(users.filter(user => user.username == data.username).length == 0) {
            users.push({
                username: data.username,
                socket: socket,
            });
            console.log(users);
            socket.emit('message', {
                username: 'Admin',
                chat: 'Welcome to Chatroom!'
            });
        } else {
            socket.emit('error', {
                error: 'Username Already In Use!'
            });
        };  
    });

    socket.on('message', message => {
        messages.push(message);
        console.log(message);
        socket.to('room').emit('message', message);
    });

});

server.listen(port, function () {
    console.log(`Listening on port ${port}`);
});