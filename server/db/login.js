const db = require('./connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config');

exports.login = async (req, res) => {
    console.log("Connected");
    console.log("login", req.body.login);
    console.log("password", req.body.password);
    try {
        let sql =   `SELECT user.user_id, user.password, user.login, user.email, user.last_name, user.first_name, 
                            user.share_location, user.last_visit, profil.gender, profil.orientation, profil.bio, profil.birthdate, 
                            YEAR(NOW()) - YEAR(profil.birthdate) as age, profil.popularity 
                    FROM user 
                    LEFT JOIN profil on user.user_id = profil.user_id 
                    WHERE login= ?`;
        sql = mysql.format(sql, req.body.login);
        
        const rows = await db.conn.queryAsync(sql);
        
        console.log("row", rows);
        console.log(rows[0].password);

        console.log("compare", bcrypt.compareSync(req.body.password, rows[0].password));
        if (bcrypt.compareSync(req.body.password, rows[0].password)) {
            const token = jwt.sign({ user_id: rows[0].user_id }, config.SECRET_KEY, { expiresIn: 86400 });
            const user = {
                login: rows[0].login,
                lastName: rows[0].last_name,
                firstName: rows[0].first_name,
                gender: rows[0].gender,
                orientation: rows[0].orientation
            }
            res.status(200).send({ auth: true, token: token, user: user });
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