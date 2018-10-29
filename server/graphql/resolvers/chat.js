const mysql = require('mysql');
const db = require('../../db/connection');
const errors = require('../errors');
const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
    getContacts: async ({}, context) => {
        const token = context.token;
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const user_id = decoded.user_id;
            let sql = "SELECT chat.chat_id, `message_id`, `user_id_sender`, `message`, `date`, `read_date`, CASE WHEN user_id1 = ? THEN user_id2 ELSE user_id1 END AS contact_id, CASE WHEN user_id1 = ? THEN us2.login ELSE us.login END AS contact_login, CASE WHEN user_id1 = ? THEN p2.src ELSE p1.src END AS contact_src FROM `chat` LEFT JOIN `message` ON message.chat_id = chat.chat_id LEFT JOIN `user` us ON us.user_id = user_id1 && user_id1 != ? LEFT JOIN `user` us2 ON us2.user_id = user_id2 && user_id2 != ? LEFT JOIN `picture` p1 ON p1.user_id = user_id1 && user_id1 != ? &&p1.priority = 1 LEFT JOIN `picture` p2 ON p2.user_id = user_id2 && user_id2 != ? && p1.priority = 1 WHERE`user_id1` = ? OR `user_id2` = ? ORDER BY chat.chat_id, `date` DESC";
            sql = mysql.format(sql, [user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id, user_id]);

            const result = await db.conn.queryAsync(sql);
            let last_chat_id = 0; 
            let group_by = [];
            await result.forEach(res => {
                if (res.chat_id !== last_chat_id) {
                    last_chat_id = res.chat_id;
                    group_by.push(res);
                }
            })
            await group_by.sort((a, b) => (a.date < b.date) ? 1 : (a.date > b.date) ? -1 : 0)
            return group_by;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    getMessages: async ({chat_id}, context) => {
        const token = context.token;
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            let sql = "SELECT message_id, user_id_sender, message, date, login  FROM `message` LEFT JOIN user ON user.user_id = message.user_id_sender WHERE chat_id = ? ORDER BY date ASC";
            sql = mysql.format(sql, [chat_id]);
            const result = await db.conn.queryAsync(sql); 
            return result;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    addMessage: async ({chat_id, message}, context) => {
        const token = context.token;
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const user_id = decoded.user_id;
            let sql = "INSERT INTO `message` (`message_id`, `user_id_sender`, `chat_id`, `message`, `date`) VALUES (NULL, ?, ?, ?, CURRENT_TIMESTAMP)";
            sql = mysql.format(sql, [user_id, chat_id, message]);
            const result = await db.conn.queryAsync(sql); 
            return result.insertId;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    getAllMessagesFromUser: async ({}, context) => {

        const token = context.token;
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const user_id = decoded.user_id;
            let sql = "SELECT chat.chat_id, `message_id`, `user_id_sender`, user.login, `message`, `date`, `read_date` FROM `chat` LEFT JOIN `message` ON message.chat_id = chat.chat_id LEFT JOIN `user` ON message.user_id_sender = user.user_id WHERE `user_id1` = ? OR `user_id2` = ? ORDER BY chat.chat_id, `date`";
            sql = mysql.format(sql, [user_id, user_id]);
    
            const result = await db.conn.queryAsync(sql); 

            let current_chat_id = 0;
            let current_chat = {}
            let all_chats = [];
            await result.forEach((msg) => {
                if (current_chat_id !== msg.chat_id) {
                    if (current_chat_id !== 0)
                        all_chats.push(current_chat);
                    current_chat_id = msg.chat_id;
                    current_chat = {};
                    current_chat.chat_id = msg.chat_id;
                    current_chat.messages = [];
                }
                current_chat.messages.push(msg);
            })
            if (current_chat_id !== 0)
                all_chats.push(current_chat);
            return all_chats;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    readChat: async ({chat_id}, context) => {
        const token = context.token;
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const user_id = decoded.user_id;
            let sql = "UPDATE `message` SET `read_date` = CURRENT_TIMESTAMP WHERE `user_id_sender` != ? AND `chat_id` = ?";
            sql = mysql.format(sql, [user_id, chat_id]);
            await db.conn.queryAsync(sql); 
            return true;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    }
}