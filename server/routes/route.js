const db = require('../db/login');
var jwt = require('jsonwebtoken');

exports.setRoutes = (app) => {

    app.get('/', (req, res) => res.send('Hello World!'));

    app.post('/connect', db.login);

    app.get('/check', (req, res) => {
        console.log("check get");

        var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, "config.secret", function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
    res.status(200).send(decoded);
  });


//        res.status(200).send();
    });
}