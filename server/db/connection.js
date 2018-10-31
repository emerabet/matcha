const config = require('../config');
const mysql = require('mysql');
const Bluebird = require('bluebird');

exports.conn = Bluebird.promisifyAll(mysql.createConnection({
	host: config.DB_IP,
	user: config.DB_USER,
	password: config.DB_PWD,
	database: config.DB_NAME,
	port: config.DB_PORT,
	multipleStatements: true
}));