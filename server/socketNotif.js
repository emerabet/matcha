const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = {

    visited: (io, socket, connectedUsers, parseCookies) => {
        socket.on('visit', async (id) => {
            const header = socket.handshake.headers.cookie || socket.request.headers.cookie;
            const cookies = parseCookies(header);
            try {
                const t = cookies.get('sessionid');
			    if (t === undefined)
                    return ;
                
                const token = await jwt.verify(cookies.get('sessionid'), config.SECRET_KEY);
                if (token.err) {
                    return ;
                }

                const online = connectedUsers.get(id);
                if (online !== undefined) {
                    const user = connectedUsers.get(token.user_id);
                    io.to(`${online.socketId}`).emit('visited', `${user.username} just visited your profil`);
                }
            } catch (err) {
                console.log('Error socket on visited: ');
            }
        });
    },

    liked: (io, socket, connectedUsers, parseCookies) => {
        socket.on('liked', async (id) => {
            const header = socket.handshake.headers.cookie || socket.request.headers.cookie;
            const cookies = parseCookies(header);
            try {
                const t = cookies.get('sessionid');
			    if (t === undefined)
                    return ;

                const token = await jwt.verify(cookies.get('sessionid'), config.SECRET_KEY);
                if (token.err) {
                    return ;
                }

                const online = connectedUsers.get(id);
                if (online !== undefined) {
                    const user = connectedUsers.get(token.user_id);
                    io.to(`${online.socketId}`).emit('liked', `${user.username} liked your profil`);
                }
            } catch (err) {
                console.log('Error socket on liked: ');
            }
        });
    },

    unliked: (io, socket, connectedUsers, parseCookies) => {
        socket.on('unliked', async (id) => {
            const header = socket.handshake.headers.cookie || socket.request.headers.cookie;
            const cookies = parseCookies(header);

            try {
                const t = cookies.get('sessionid');
			    if (t === undefined)
                    return ;
                    
                const token = await jwt.verify(cookies.get('sessionid'), config.SECRET_KEY);
                if (token.err) {
                    return ;
                }

                const online = connectedUsers.get(id);
                if (online !== undefined) {
                    const user = connectedUsers.get(token.user_id);
                    io.to(`${online.socketId}`).emit('unliked', `${user.username} unliked your profil`);
                }
            } catch (err) {
                console.log('Error socket on unliked: ');
            }
        });
    }

};