const testConnection = (socket) => {
console.log('Connexion socket: '/*, socket*/);
};

let connected_users = [];


const mySocket = (socket, addConnectedUser) => {
	console.log('socket init');
	socket.on('login', (data) => {
		console.log("LOGIN", data)
		connected_users.push(data);
		addConnectedUser(data);
		console.log("LIST OF CONNECTED USERS", data);
	});
	testConnection(socket);
};

module.exports = mySocket;