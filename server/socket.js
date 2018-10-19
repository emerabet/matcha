const jwt = require('jsonwebtoken');
const config = require('./config');
const socketChat = require('./socketChat');
const socketNotif = require('./socketNotif');

const queryContact = require('./graphql/resolvers/chat');

const parseCookies = (cookies) => {
	let c = cookies.split(";")
	let result = new Map();

	c.forEach(async element => {
		let cc = element.split("=");
		result.set(cc[0].trim(), cc[1].trim());
	});

	return result;
}

const mySocket = async (io, socket, connectedUsers) => {
	console.log("CONNECTED TO THE SOCKET");


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

			console.log("ID", token.user_id, userName);

			const context = {
				token: cookies.get('sessionid')
			}
			const contacts = await queryContact.getContacts({}, context);
			

			console.log("--------------------------");
			console.log(contacts);
			
			// On crée une room au nom de l'id de l'user sur la socket
			socket.join(token.user_id);

			const user = {
				username: userName,
				socketId: socket.id,
				friends: new Map()
			}

			addContactToRooms(user, token.user_id, contacts);
			connectedUsers.set(token.user_id, user);
			console.log("LIST OF CONNECTED USERS", connectedUsers);
			console.log("FRIENDS", connectedUsers.get(token.user_id).friends);

		} catch (err) {
			console.log('Error socket on login: ', err);
		}
		console.log('********************** END CONNECT *********************************');
	});

	/*
	/* **************************** Disconnect Event ****************************
	*/
	socket.on('disconnect', async () => {
		console.log("SOCKET DISCONNECT");
		const header = socket.handshake.headers.cookie || socket.request.headers.cookie;
		const cookies = parseCookies(header);
		console.log("Header: ", header);

		const token = await jwt.verify(cookies.get('sessionid'), config.SECRET_KEY);
		if (token.err) {
			throw new Error('Decode failed on login');
		}

		connectedUsers.delete(token.user_id);

		console.log("LIST OF CONNECTED USERS", connectedUsers);
		console.log('********************** END DISCONNECT *********************************');
	});

	socketChat.newMessage(socket, connectedUsers, parseCookies);
	socketNotif.visited(io, socket, connectedUsers, parseCookies);
	socketNotif.liked(io, socket, connectedUsers, parseCookies);
	socketNotif.unliked(io, socket, connectedUsers, parseCookies);
};

module.exports = mySocket;