const { exec } = require('child_process');

const ioc = require('socket.io-client');

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const remoteSocket = ioc.connect('http://localhost:3000', { reconnection: true });

const ScreenSharer = require('./screen_sharer/sharer');
const sharer = new ScreenSharer(remoteSocket, 2);

const EventHandler = require('./event_handler/index');
const eventHandler = new EventHandler(remoteSocket);

remoteSocket.on('connect', () => {
    console.log('Connected to server in *:3000');
    sharer.start();
    eventHandler.start();
});

io.on('connection', (socket) => {
    socket.on('REMOTE_MOUSE_MOVE', (coords) => {
        eventHandler.moveMyMouse(coords);
    });

    socket.on('REMOTE_KEYDOWN', (evt) => {
        eventHandler.fireKeyDown(evt.key);
    });

    socket.on('REMOTE_MOUSE_DOWN', (evt) => {
        eventHandler.sendMouseClick(evt.button);
    });
});

server.listen(8080, () => {
    console.log('listening on *:8080');
});

