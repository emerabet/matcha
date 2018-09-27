const db = require('./connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

exports.login = async (req, res) => {
    console.log("Connected");
    console.log("login", req.body.login);
    console.log("password", req.body.password);
    try {
        let sql = `SELECT password FROM user WHERE login= ?`; 
        sql = mysql.format(sql, req.body.login);
        
        const rows = await db.conn.queryAsync(sql);
        
        console.log("row", rows);
        console.log(rows[0].password);

        console.log("compare", bcrypt.compareSync(req.body.password, rows[0].password));
        if (bcrypt.compareSync(req.body.password, rows[0].password)) {
        const token = jwt.sign({ login: req.body.login }, "config.secret", { expiresIn: 86400 });
            res.status(200).send({ auth: true, token: token });
        } else {
            res.status(403).send({ auth: false, token: null });
        }
        //res.status(200).send(rows);
    } catch (err) {
        console.log(err);
        res.status(403).send({ auth: false, token: null });
    }
   
    //console.log("token", token);
    //res.status(200).send({ auth: true, token: token });
    
}