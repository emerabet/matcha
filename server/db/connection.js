const config = require('../config');
const mysql = require('mysql');

exports.conn = mysql.createConnection({
	host: "localhost",
	user: config.DB_USER,
	password: config.DB_PWD,
	database: "db_matcha"
});