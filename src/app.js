import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4003;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.static('src/ui'));

let load1 = false;
let value1 = 0
let value2 = 1
let value3 = 0
let value4 = 1
io.on('connection', socket => {
    console.log('New Connection');

    io.to(socket.id).emit('load1', load1);

    socket.on('disconnect', () => {
        console.log('Disconnected');
    });

    socket.on('load1', () => {
        socket.broadcast.emit('load1', value1, value2, value3, value4);
    });

    // socket.on('buttonState', value => {
    //     console.log('buttonState:', value);
    //     buttonState = value;
    //     socket.broadcast.emit('buttonState', value);
    // });
});

httpServer.listen(PORT, () => {
    console.log('Running on : ', httpServer.address());
});
