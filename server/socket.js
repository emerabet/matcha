const testConnection = (socket) => {
	console.log('Connexion socket: ', socket);
};


const initSocket = (socket) => {
	testConnection(socket);
};

module.exports = initSocket;