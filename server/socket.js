const jwt = require('jsonwebtoken');
const config = require('./config');

const parseCookies = (cookies) => {
	let c = cookies.split(";")
	let result = new Map();

	c.forEach(element => {
		let cc = element.split("=");
		result.set(cc[0], cc[1]);
	});
	return result;
}

const mySocket = async (socket, connectedUsers) => {
	socket.on('login', async (data) => {
		const c = parseCookies(socket.request.headers.cookie);
		const token = c.get('sessionid');
    try {
        const decoded = await jwt.verify(token, config.SECRET_KEY);
        if (decoded.err)
            return ;
        else {
			connectedUsers.push(data);
			console.log("LIST OF CONNECTED USERS", connectedUsers);
        }
    } catch (err) {
        return ;
    }
	});
};

module.exports = mySocket;