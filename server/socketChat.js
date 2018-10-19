const chat = require('./graphql/resolvers/chat');
const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = {
    newMessage : (io, socket, connectedUsers, parseCookies) => {
        socket.on('newMessage', async ({chat_id, to, message, messageId, login}) => {
            const header = socket.handshake.headers.cookie || socket.request.headers.cookie;
		    const cookies = parseCookies(header);
            try {
                const token = await jwt.verify(cookies.get('sessionid'), config.SECRET_KEY);
                if (token.err) {
                    throw new Error('Decode failed on login');
                }
                const from = token.user_id;
                const user = connectedUsers.get(token.user_id);
                const contact = user.friends.get(to);
                io.to(contact.socketId).emit('newMessage', {chat_id: chat_id, user_id_sender: from, login: login, message: message, message_id: messageId, date: `${Date.now()}`});
            } catch (err) {
                console.log('Error socket on new message: ', err);
            }



        })
    },

    isTyping : (io, socket, connectedUsers, parseCookies) => {
        socket.on('isTyping', async ({contact_id, chat_id}) => {
            console.log("IS TYPING", contact_id, chat_id);
            const header = socket.handshake.headers.cookie || socket.request.headers.cookie;
		    const cookies = parseCookies(header);
            try {
                const token = await jwt.verify(cookies.get('sessionid'), config.SECRET_KEY);
                if (token.err) {
                    throw new Error('Decode failed on login');
                }
                const from = token.user_id;
                const user = connectedUsers.get(token.user_id);
                const contact = user.friends.get(contact_id);
                console.log("IS TYPING EMITING TO");
                io.to(contact.socketId).emit('isTyping', from);
            } catch (err) {
                console.log('Error socket on new message: ', err);
            }
        })
    }
}