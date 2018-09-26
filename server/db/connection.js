const config = require('../config');
const mysql = require('mysql');
const Bluebird = require('bluebird');

exports.conn = Bluebird.promisifyAll(mysql.createConnection({
	host: "localhost",
	user: config.DB_USER,
	password: config.DB_PWD,
	database: "db_matcha"
}));