import express, { Request, Response } from "express"
import path from "path"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import e from "express"

dotenv.config({
    path: 'conf.env'
});

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

let count = 0;
io.on('connection', (socket) => {
    // send message to the client after connection
    socket.emit('message', 'Welcome to the chat app!')

    // send message to all clients except the client that connected

    socket.on('sendMessage', (message) => {
        io.emit('message', message);
    });

    socket.broadcast.emit('message', 'A new user has joined!'); // send message to all clients except the client that connected

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!'); // send message to all clients except the client that connected
    });

    /*
    socket.on('increment', () => {
        count++;
        //socket.emit('ahmed', `a7a ya ahmed enta mesh faheem ay 7aga, ${count}`);
        io.emit('ahmed', `a7a ya ahmed enta mesh faheem ay 7aga, ${count}`);
        //socket: send message to the client that connected in the browser with console.log
        //io: send message to all clients that connected in the browser with console.log
    });
    */

});
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
    console.log('http://localhost:3000')
})

export default io