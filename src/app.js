import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 4001;

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

app.use(express.static('src/ui'));
const data = {
    "BUILTIN": false,
    "LED": false,
    "LED1": false,
    "LED2": false,
    "SENSOR": false,
}
const ids = Object.keys(data)
io.on('connection', socket => {
    console.log('New Connection');

    io.to(socket.id).emit('initial', data);
    socket.on(socket.id, (e) => {
        console.log(e);
        socket.broadcast.emit("SENSOR", e)
    })
    socket.on("SENSOR", (e) => {
        console.log(e);
        socket.broadcast.emit("SENSOR", e)
    })
    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
    ids.forEach(id => {
        socket.on(id, value => {
            console.log('buttonState:', value);
            data[id] = value;
            socket.broadcast.emit(id, value);
        });
    })
});

httpServer.listen(PORT, () => {
    console.log('Running on : ', httpServer.address());
});
