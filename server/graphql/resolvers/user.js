const mysql = require('mysql');
const db = require('../../db/connection');
var jwt = require('jsonwebtoken');

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
       // if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
        console.log("token", token);
        const decoded = await jwt.verify(token, "config.secret");
        // if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            //res.status(200).send(decoded);
            console.log("decoded", decoded);
            console.log("uuser to get from db", decoded.login);
            let sql = "SELECT * from `user` WHERE `login` = ?;"; 
            sql = mysql.format(sql, decoded.login);
            const result = await db.conn.queryAsync(sql);
            console.log("ID", result[0]);
            return result[0];
        
    }
}