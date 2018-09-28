const mysql = require('mysql');
const db = require('../../db/connection');
const jwt = require('jsonwebtoken');
const errors = require('../errors');

module.exports = {
    addUser: async ({ user }) => {
        console.log("user to add in db", user);
        let sql = "INSERT INTO `user` (`user_id`, `login`, `email`, `last_name`, `first_name`, `password`, `register_token`, `reset_token`, `last_visit`, `creation_date`, `role`) VALUES (NULL, ?, ?, ?, ?, ?, 'sadas', 'asdad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '1');"; 
        sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, user.password]);
        const result = await db.conn.queryAsync(sql);
        console.log("ID", result.insertId);
        return result.insertId;
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
                console.log("uuser to get from db", decoded.login);
                let sql = "SELECT * from `user` WHERE `user_id` = ?;"; 
                sql = mysql.format(sql, decoded.user_id);
                const result = await db.conn.queryAsync(sql);
                console.log("ID", result[0]);
                return result[0];
        } catch (err) {
            throw err.message;
        }
    }
}