const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let users = {};
let colors = {};

io.on('connection', function(socket) {
    // Assign a random color to the user
    colors[socket.id] = getRandomColor();
    console.log('a user connected');

    // When a new user connects, store their username and socket ID
    socket.on('new user', (username) => {
        users[socket.id] = username;
        console.log('Username:', username);
    });

    socket.on('message', (message) => {
        console.log('Received message:', message.text);
        // Include the username and the current time with the message
        const messageToSend = {
            user: users[socket.id],
            text: message.text,
            color: colors[socket.id],
            time: new Date().toLocaleTimeString() // Add the current time as a string in AM/PM format
        };
        console.log('Emitting message:', messageToSend);
        io.emit('message', messageToSend);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        // Remove the user from the users object when they disconnect
        delete users[socket.id];
    });
});

function getRandomColor() {
    var letters = 'ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
    }
    return color;
}

//index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});