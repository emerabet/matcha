const mysql = require('mysql');
const db = require('../../db/connection');
const jwt = require('jsonwebtoken');
const errors = require('../errors');
const bcrypt = require('bcrypt');
const config = require('../../config');

module.exports = {
    addUser: async ({ user }) => {
        console.log("user to add in db", user);
        var hash = bcrypt.hashSync(user.password, 10);
        let sql = "INSERT INTO `user` (`user_id`, `login`, `email`, `last_name`, `first_name`, `password`, `register_token`, `reset_token`, `last_visit`, `creation_date`, `role`, `share_location`) VALUES (NULL, ?, ?, ?, ?, ?, 'sadas', 'asdad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '1', '0');"; 
        try {
            sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, hash]);
            const result = await db.conn.queryAsync(sql);
            console.log("ID", result.insertId);
            return result.insertId;
        } catch (err) {
            console.log("ERR", err);
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },


    getUser: async ({ token }) => {
        try {
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            console.log("token", token);
            const decoded = await jwt.verify(token, "config.secret");
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
                console.log("decoded", decoded);
                console.log("uuser to get from db", decoded.id);
                let sql = "SELECT user.user_id, user.login, user.email, user.last_name, user.first_name, user.share_location, user.last_visit, profil.gender, profil.orientation, profil.bio, profil.birthdate, profil.popularity from `user` LEFT JOIN `profil` on user.user_id = profil.user_id WHERE user.user_id = ?;"; 
                sql = mysql.format(sql, decoded.user_id);
                const result = await db.conn.queryAsync(sql);
                console.log("ID", result[0]);
                return result[0];
        } catch (err) {
            throw err.message;
        }
    },

    getUsers: async () => {
        try {
            console.log("in get users");
            let sql = "SELECT user.user_id, user.login, user.email, user.last_name, user.first_name, user.share_location, user.last_visit, profil.gender, profil.orientation, profil.bio, profil.birthdate, profil.popularity from `user` LEFT JOIN `profil` on user.user_id = profil.user_id;"; 
            const result = await db.conn.queryAsync(sql);
                console.log("ID", result);
                return result;
        } catch (err) {
            throw err.message;
        }
    },

    updateUser: async ({ token, user, profile }) => {
        console.log("user to update in db", user);
        try {
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            console.log("token", token);
            const decoded = await jwt.verify(token, "config.secret");
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
                console.log("decoded", decoded);
                console.log("USER", user);
                console.log("PROFILE", profile);
                let sql = 'UPDATE `user` SET `login` = ?, `email` = ?, `last_name` = ?, `first_name` = ?, `password` = ?, `share_location` = ? WHERE `user_id` = ?;'; 
                sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, user.password, 1, decoded.user_id]);
                console.log("SQL", sql);
                let result = await db.conn.queryAsync(sql);
                console.log("ID", result[0]);
                sql = 'INSERT INTO `profil` (`user_id`, `gender`, `orientation`, `bio`, `popularity`, `birthdate`) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE `user_id` = ?, `gender` = ?, `orientation` = ?, `bio` = ?, `popularity` = ?, `birthdate` = ?;';
                sql = mysql.format(sql, [decoded.user_id, profile.gender, profile.orientation, profile.bio, profile.popularity, profile.birthdate, decoded.user_id, profile.gender, profile.orientation, profile.bio, profile.popularity, profile.birthdate]);
                console.log("SQL", sql);
                result = await db.conn.queryAsync(sql);
                console.log("ID", result[0]);
                return "Update done";
        } catch (err) {
            throw err.message;
        }
        
    }
}