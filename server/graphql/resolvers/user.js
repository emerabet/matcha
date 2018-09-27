const mysql = require('mysql');
const db = require('../../db/connection');

module.exports = {
    addUser: async ({ user }) => {
        console.log("user to add in db", user);
        let sql = "INSERT INTO `user` (`user_id`, `login`, `email`, `last_name`, `first_name`, `password`, `register_token`, `reset_token`, `last_visit`, `creation_date`, `role`) VALUES (NULL, ?, ?, ?, ?, ?, 'sadas', 'asdad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '1');"; 
        sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, user.password]);
        const result = await db.conn.queryAsync(sql);
        console.log("ID", result.insertId);
        return result.insertId;
    },


    getUser: async ({ id }) => {
        console.log("uuser to get from db", id);
        let sql = "SELECT * from `user` WHERE `user_id` = ?;"; 
        sql = mysql.format(sql, id);
        const result = await db.conn.queryAsync(sql);
        console.log("ID", result);
        return result[0];
    }
}