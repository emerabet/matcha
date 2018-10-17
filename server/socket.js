const testConnection = (socket) => {
	console.log('Connexion socket: ', socket);
};


const mySocket = (socket) => {
    console.log('socket init');
	testConnection(socket);
};

module.exports = mySocket;