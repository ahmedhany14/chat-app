import express from "express"
import path from "path"
import dotenv from "dotenv"
import http from "http"
import { Server } from "socket.io"
import { addUser, removeUser, getUser, getUsersInRoom } from './users'

dotenv.config({ path: 'conf.env' });

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

function generateMessage(username: string, text: string) {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

function generateLocationMessage(username: string, url: string) {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

io.on('connection', (socket) => {
    socket.on('sendMessage', (message, next) => {
        const user = getUser(socket.id);
        if (!user) return next('User not found!');

        io.to(user.room).emit('message', generateMessage(user.username, message));
        next();
    });

    socket.on('sendLocation', (coords, next) => {
        const user = getUser(socket.id);
        if (!user) return next('User not found!');

        io.to(user.room).emit('location', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
        next();
    });

    socket.on('join', ({ username, room }, next) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) return next(error);
        if (!user?.room || !user?.username) return next('Username and room are required!');

        socket.join(user.room);
        socket.emit('message', generateMessage("Admin", 'Welcome to the chat app!')) // send message to the client after connection
        socket.broadcast.to(user.room).emit('message',
            generateMessage(user.username, `${user?.username} has joined!`)
        ); // send message to all clients except the client that connected

        // return all users in the room
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        next();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message',
                generateMessage('Admin', `${user.username} has left!`)
            );
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });

        }
    });
    //socket: send message to the client that connected in the browser with console.log
    //io: send message to all clients that connected in the browser with console.log
});
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
    console.log('http://localhost:3000')
})

export default io