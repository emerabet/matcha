const db = require('./connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config');
const cookie = require('cookie-parser');
const errors = require('../graphql/errors');
var uniqid = require('uniqid');

exports.login = async (req, res) => {
    console.log("Connected");
    try {
        let sql = 'SELECT `register_token` FROM `user` WHERE `login` = ?';
        sql = mysql.format(sql, [req.body.login]);
        
        const ret = await db.conn.queryAsync(sql);
        
        console.log("RET", ret[0]);
        if (!ret[0] || ret[0] === undefined || ret[0].register_token !== "validated")
            res.status(403).send({ auth: false, token: null });

        sql =   `SELECT user.user_id, user.password, user.login, user.email, user.last_name, user.first_name, 
                            user.share_location, user.last_visit, profil.gender, profil.orientation, profil.bio, profil.birthdate, 
                            YEAR(NOW()) - YEAR(profil.birthdate) as age, profil.popularity, address.latitude, address.longitude
                    FROM user 
                    LEFT JOIN profil on user.user_id = profil.user_id 
                    LEFT JOIN address on user.user_id = address.user_id
                    WHERE login= ?`;
        sql = mysql.format(sql, req.body.login);
        
        const rows = await db.conn.queryAsync(sql);
        if (bcrypt.compareSync(req.body.password, rows[0].password)) {
            const csrf_token = uniqid();
            const token = jwt.sign({ user_id: rows[0].user_id, csrf_token: csrf_token}, config.SECRET_KEY, { expiresIn: 3600 });
            const user = {
                user_id: rows[0].user_id,
                login: rows[0].login,
                lastName: rows[0].last_name,
                firstName: rows[0].first_name,
                email: rows[0].email,
                last_visit: rows[0].last_visit,
                share_location: rows[0].share_location,
                gender: rows[0].gender,
                orientation: rows[0].orientation,
                bio: rows[0].bio,
                birthdate: rows[0].birthdate,
                popularity: rows[0].popularity,
                latitude: rows[0].latitude,
                longitude: rows[0].longitude
            };
            await res.clearCookie();
            res.header('Pragma', 'no-cache');
            await res.cookie('sessionid', token, { httpOnly: true/*, sameSite: "strict"*/ })
            .status(200).send({ auth: true, csrf_token: csrf_token, user: user });
        } else {
            res.status(403).send({ auth: false, token: null });
        }
    } catch (err) {
        console.log(err);
        res.status(403).send({ auth: false, token: null });
    }   
}

exports.checkToken = async (req, res) => {
    const token = req.cookies['sessionid'];
    console.log("GOT TOKEN", token);

    try {
        const decoded = await jwt.verify(token, config.SECRET_KEY);
        if (decoded.err)
        {    
            console.log("CANNOT DECODE");
            res.status(403).send({ message: "Authentification failed" });
        }
        else {
            console.log("CAN DECODE");
            res.status(200).send({ message: "Authentification success" });
        }
    } catch (err) {
        console.log("TOKEN EXPIRED");
        res.status(403).send({ message: "Authentification failed" });
    }
}

exports.logout = async (req, res) => {
    console.log("LOGGING OUT CLEAR COOKIES");
    res.clearCookie("sessionid").status(200).send();
}