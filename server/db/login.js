const db = require('./connection');

exports.login = (req, res) => {
	console.log("Connected");
	db.conn.query('SELECT * FROM user', (err,rows) => {
		if(err) throw err;

		console.log('Data received from Db:\n');
        console.log(rows);
        res.status(200).send(rows);
	});
}