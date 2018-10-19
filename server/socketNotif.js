const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = {

    visited: (io, socket, connectedUsers, parseCookies) => {

        socket.on('visit', async (id) => {

            const header = socket.handshake.headers.cookie || socket.request.headers.cookie;
            const cookies = parseCookies(header);
            console.log("Header: ", header);

            try {
                const token = await jwt.verify(cookies.get('sessionid'), config.SECRET_KEY);
                if (token.err) {
                    throw new Error('Decode failed on login');
                }

                console.log(socket.id + ' visited the profil: ' + id);
                console.log(connectedUsers);
        
                const online = connectedUsers.get(id);
                if (online !== undefined) {
                    console.log('transmettre la notif à: ' + online.socketId);
                    io.to(`${online.socketId}`).emit('visited', `${socket.id} visited you profil`);
                }
            } catch (err) {
                console.log('Error socket on visited: ', err);
            }
        });

    }

};