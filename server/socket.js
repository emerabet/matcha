const jwt = require('jsonwebtoken');
const config = require('./config');

const parseCookies = async (cookies) => {
	let c = cookies.split(";")
	let result = new Map();

	await c.forEach(async element => {
		let cc = await element.split("=");
		await result.set(cc[0].trim(), cc[1].trim());
	});
	return result;
}

const mySocket = async (socket, connectedUsers) => {
	console.log("CONNECTED TO THE SOCKET");
	socket.on('login', async (user_id, user_name) => {
	//	console.log("CCCCC", socket);
		const c = await parseCookies(socket.handshake.headers.cookie);
		const cc = await parseCookies(socket.request.headers.cookie);

		console.log("REQUEST", cc);
		console.log("HANDSHAKE", c);

		//	const token = await c.get('sessionid');
	//	console.log("TOKEN SOCKET", token, c, c.get('sessionid'));
	//	try {
	//		const decoded = await jwt.verify(token, config.SECRET_KEY);
	//		if (decoded.err)
	//			return ;
	//		else {
				console.log("ID", user_id, user_name);
				connectedUsers.set(user_id, user_name);
				console.log("LIST OF CONNECTED USERS", connectedUsers);
	//		}
	//	} catch (err) { return ; }
	});

	socket.on('disconnect', () => console.log("SOCKET DISCONNECT"));
};

module.exports = mySocket;