const db = require('../db/login');
var jwt = require('jsonwebtoken');

exports.setRoutes = (app) => {

    app.get('/', (req, res) => res.send('Hello World!'));

    app.post('/connect', db.login);
}