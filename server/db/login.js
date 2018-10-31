const db = require('./connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../config');
const uniqid = require('uniqid');
const axios = require('axios');

exports.login = async (req, res) => {
    try {
        let sql = 'SELECT `register_token` FROM `user` WHERE `login` = ?';
        sql = mysql.format(sql, [req.body.login]);
        
        const ret = await db.conn.queryAsync(sql);
        if (!ret[0] || ret[0] === undefined || ret[0].register_token !== "validated") {
            res.status(403).send({ auth: false, token: null });
            return ;
        }
        sql = 'UPDATE `user`  SET `last_visit` = CURRENT_TIMESTAMP WHERE `login` = ?';
        sql = mysql.format(sql, [req.body.login]);
        await db.conn.queryAsync(sql);
        
        sql =   `SELECT CONCAT(address.zipcode, ' ', address.city, ' ', address.country) as address, user.role, user.user_id, user.password, user.login, user.email, user.last_name, user.first_name, 
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
            const token = jwt.sign({ user_id: rows[0].user_id, csrf_token: csrf_token, role: rows[0].role}, config.SECRET_KEY, { expiresIn: 5400 });
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
                longitude: rows[0].longitude,
                address: rows[0].address,
                role: rows[0].role
            };

            await res.clearCookie();
            res.header('Pragma', 'no-cache');
            await res.cookie('sessionid', token, { httpOnly: true })
            .status(200).send({ auth: true, csrf_token: csrf_token, user: user });
            return ;
        } else {
            res.status(403).send({ auth: false, token: null });
            return ;
        }
    } catch (err) {
        res.status(403).send({ auth: false, token: null });
        return ;
    }   
}

exports.checkToken = async (req, res) => {
    const token = req.cookies['sessionid'];

    try {
        const decoded = await jwt.verify(token, config.SECRET_KEY);
        if (decoded.err)
        {    
            res.status(403).send({ message: "Authentification failed" });
        }
        else {
            res.status(200).send({ message: "Authentification success" });
        }
    } catch (err) {
        res.status(403).send({ message: "Authentification failed" });
    }
}

exports.logout = async (req, res) => {
    res.clearCookie("sessionid").status(200).send({ auth: false, token: null });
}

exports.locate = async (req, res) => {
    try {
        const add = await axios.get(`http://api.ipstack.com/${req.body.ip}?access_key=${config.IPSTACK_KEY}`);
        res.status(200).send({ latitude: add.data.latitude, longitude: add.data.longitude });
    } catch (err) {
        res.status(406).send({});
    }
}
