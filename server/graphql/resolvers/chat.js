const mysql = require('mysql');
const db = require('../../db/connection');
const errors = require('../errors');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const fs = require('fs');

module.exports = {
    getContacts: async ({}, context) => {
        console.log("CONTEXT", context);
        console.log("TOKEN", context.token);
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const user_id = decoded.user_id;
            sql = "SELECT chat.chat_id, CASE WHEN user_id1 = ? THEN user_id2 ELSE user_id1 END AS contact_id, CASE WHEN user_id1 = ? THEN us2.login ELSE us.login END AS login, CASE WHEN user_id1 = ? THEN p2.src ELSE p1.src END AS src, CASE WHEN m1.user_id_sender = ? THEN m1.message ELSE m2.message END AS last_message, CASE WHEN m1.user_id_sender = ? THEN m1.date ELSE m2.date END AS last_message_date FROM `chat` LEFT JOIN user us ON user_id1 = us.user_id AND user_id != ? LEFT JOIN user us2 ON user_id2 = us2.user_id AND user_id2 != ? LEFT JOIN picture p1 ON p1.user_id = user_id1 AND user_id1 != ? AND p1.priority = 1 LEFT JOIN picture p2 ON p2.user_id = user_id2 AND user_id2 != ? AND p2.priority = 1 LEFT JOIN message m1 ON m1.user_id_sender = user_id1 AND m1.user_id_sender != ? LEFT JOIN message m2 ON m2.user_id_sender = user_id2 AND m2.user_id_sender != ? WHERE user_id1 = ? OR user_id2 = ? GROUP BY chat.chat_id ORDER BY chat_id, last_message_date DESC";
            sql = mysql.format(sql, [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id,]);
            result = await db.conn.queryAsync(sql); 
            console.log("RES LAST INSERT", result);
            return result;
        } catch (err) {
            console.log("ERR", err);
            throw (errors.errorTypes.BAD_REQUEST);
        }
    }
}