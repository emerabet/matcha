const db = require('./connection');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

exports.login = (req, res) => {
	console.log("Connected");
    console.log("login", req.body.login);
    console.log("password", req.body.password);
    const hash = bcrypt.hashSync(req.body.password, 10);
    console.log("T", bcrypt.compareSync(req.body.password, hash));
    console.log("F", bcrypt.compareSync("test", hash));
    db.conn.queryAsync("SELECT * FROM user").then(function(rows){   
        console.log(rows);
        //res.status(200).send(rows);
        var token = jwt.sign({ login: req.body.login }, "config.secret", {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
    });
}