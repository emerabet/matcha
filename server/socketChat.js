const chat = require('./graphql/resolvers/chat');
const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = {
    newMessage : (io, socket, connectedUsers, parseCookies) => {
        socket.on('newMessage', async ({chat_id, to, message, messageId, login}) => {
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
                const from = token.user_id;
                const user = connectedUsers.get(token.user_id);
                if (user === undefined)
                    return ;
                const contact = user.friends.get(to);
                if (contact !== undefined)
                    io.to(contact.socketId).emit('newMessage', {chat_id: chat_id, user_id_sender: from, login: login, message: message, message_id: messageId, date: `${Date.now()}`});
            } catch (err) {
                console.log('Error socket on new message: ');
            }
        })
    },

    isTyping : (io, socket, connectedUsers, parseCookies) => {
        socket.on('isTyping', async ({contact_id, chat_id}) => {

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
                const from = token.user_id;
                const user = connectedUsers.get(token.user_id);
                if (user === undefined)
                    return ;
                const contact = user.friends.get(contact_id);
                if (contact !== undefined)
                    io.to(contact.socketId).emit('isTyping', from);
            } catch (err) {
                console.log('Error socket on new message: ');
            }
        })
    },

    stopTyping : (io, socket, connectedUsers, parseCookies) => {
        socket.on('stopTyping', async ({contact_id, chat_id}) => {

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
                const from = token.user_id;
                const user = connectedUsers.get(token.user_id);
                if (user === undefined)
                    return ;
                const contact = user.friends.get(contact_id);
                if (contact !== undefined)
                    io.to(contact.socketId).emit('stopTyping', from);
            } catch (err) {
                console.log('Error socket on new message: ');
            }
        })
    },

    initiateVideoChat : (io, socket, connectedUsers, parseCookies) => {
        socket.on('initiateVideoChat', async ({to, data}) => {
            console.log("requesting video chat", data)
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

                const from = token.user_id;
                const user = connectedUsers.get(from);
                if (user === undefined)
                    return ;
                const contact = user.friends.get(to);
                if (contact !== undefined) {
                    console.log("shoudl be ok", data);
                    io.to(contact.socketId).emit('initiateVideoChat', {from :from, data: data});
                } else {
                    console.log("contact not in the list");
                }
            } catch (err) {
                console.log('Error socket on new message: ');
            }
        })
    },

    acceptVideoChat : (io, socket, connectedUsers, parseCookies) => {
        socket.on('acceptVideoChat', async ({to, data}) => {
            console.log("accepting video chat");
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
                const from = token.user_id;
                const user = connectedUsers.get(from);
                if (user === undefined)
                    return ;
                const contact = user.friends.get(to);
                if (contact !== undefined)
                    io.to(contact.socketId).emit('acceptVideoChat', {from :from, data: data});
            } catch (err) {
                console.log('Error socket on new message: ');
            }
        })
    }

}