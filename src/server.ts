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
    console.log('New WebSocket connection')
    socket.emit(
        'ahmed',
        `a7a ya ahmed enta mesh faheem ay 7aga, ${count}`
    );
});
server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
    console.log('http://localhost:3000')
})

export default io