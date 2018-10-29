const jwt = require('jsonwebtoken');
const config = require('./config');
const socketChat = require('./socketChat');
const socketNotif = require('./socketNotif');

const queryContact = require('./graphql/resolvers/chat');

const parseCookies = (cookies) => {
	let c = cookies && cookies !== undefined ? cookies.split(";") : [];
	let result = new Map();

	c.forEach(async element => {
		let cc = element.split("=");
		result.set(cc[0].trim(), cc[1].trim());
	});

	return result;
}

const mySocket = async (io, socket, connectedUsers) => {

	const getSocketById = (socketId) => {
		return io.sockets.clients().connected[socketId];
	}

	const addContactToRooms = (user, userId, contacts) => {

		contacts.forEach(contact => {

			const online = connectedUsers.get(contact.contact_id);

			// Contact en ligne
			if (online !== undefined) {

				// On fait rejoindre la socket du contact en ligne la room de l'user
				const onlineSocket = getSocketById(online.socketId);
				onlineSocket.join(userId);

				// Reprociquement on ajoute l'user en cours dans la room du contact en ligne
				const userSocket = getSocketById(user.socketId);
				userSocket.join(contact.contact_id);

				// On ajoute l'user en cours dans la liste des amis du contact en ligne
				online.friends.set(userId, user);

				// On ajoute le contact en ligne dans la liste des amis de l'user en cours
				user.friends.set(contact.contact_id, online);
			}
		});
	}
	
	/*
	/* **************************** Login Event ****************************
	*/
	socket.on('login', async (userName) => {
		const header = socket.handshake.headers.cookie || socket.request.headers.cookie;
		const cookies = parseCookies(header);

		try {
			const token = await jwt.verify(cookies.get('sessionid'), config.SECRET_KEY);
			if (token.err) {
				throw new Error('Decode failed on login');
			}

			const context = {
				token: cookies.get('sessionid')
			}
			const contacts = await queryContact.getContacts({}, context);
			
			// On crée une room au nom de l'id de l'user sur la socket
			socket.join(token.user_id);

			const user = {
				username: userName,
				socketId: socket.id,
				friends: new Map()
			}

			addContactToRooms(user, token.user_id, contacts);
			connectedUsers.set(token.user_id, user);
			let keys =[ ...connectedUsers.keys() ];
			io.emit('onlineChanged', JSON.stringify(keys));
			socket.to(`${token.user_id}`).emit("connected", token.user_id, connectedUsers.get(token.user_id).username);
		} catch (err) {
			console.log('Error socket on login: ', err);
		}
	});

	/*
	/* **************************** Disconnect Event ****************************
	*/
	socket.on('disconnect', async () => {
		const header = socket.handshake.headers.cookie || socket.request.headers.cookie;
		const cookies = parseCookies(header);
		const token = await jwt.verify(cookies.get('sessionid'), config.SECRET_KEY);
		if (token.err) {
			throw new Error('Decode failed on login');
		}

		if (connectedUsers.get(token.user_id) !== undefined) {
			socket.to(`${token.user_id}`).emit("disconnected", token.user_id, connectedUsers.get(token.user_id).username);
			
			connectedUsers.delete(token.user_id);

			let keys =[ ...connectedUsers.keys() ];
			io.emit('onlineChanged', JSON.stringify(keys));
		}
	});

	socketChat.newMessage(io, socket, connectedUsers, parseCookies);
	socketChat.isTyping(io, socket, connectedUsers, parseCookies);
	socketChat.stopTyping(io, socket, connectedUsers, parseCookies);
	socketChat.initiateVideoChat(io, socket, connectedUsers, parseCookies);
	socketChat.acceptVideoChat(io, socket, connectedUsers, parseCookies);
	socketNotif.visited(io, socket, connectedUsers, parseCookies);
	socketNotif.liked(io, socket, connectedUsers, parseCookies);
	socketNotif.unliked(io, socket, connectedUsers, parseCookies);
	
};

module.exports = mySocket;