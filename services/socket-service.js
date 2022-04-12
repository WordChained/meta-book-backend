const socketIo = require("socket.io");
const logger = require('./logger-service');

const socketService = (server, session) => {
    const io = socketIo(server, {
        cors: {
            origin: ["http://localhost:3000", 'http://127.0.0.1:3000', 'https://git.heroku.com/metabook-wordchained-frontend', "http://localhost:3030"],
            credentials: true,
        }
    });
    io.use((socket, next) => {
        session(socket.request, {}, next)
    })
    io.on('connect', (socket) => {
        console.log('New socket connected', socket.id);
        socket.on('setUserId', (userId) => {
            socket.userId = userId
            socket.join(userId)//joining a "room" by the id of the user
        })
        socket.on('disconnect', () => {
            console.log('socket disconnected');
        })
        socket.on('notification', (notification) => {
            io.to(notification.to).emit('notification-added')
        })
    })
}

module.exports = {
    socketService
}