const mysql = require('mysql');
const db = require('../../db/connection');
const errors = require('../errors');
const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
    addPicture: async ({token, picture_id, url, type}) => {
        console.log("TOKEN", token);
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const user_id = decoded.user_id;
            let sql = "";
            let result = "";
            let priority = 0;
            if (type === 'regular')
                priority = 0;
            else
                priority = 1;
                /*let sql = "SELECT COUNT(`picture_id`) as nb FROM `picture` WHERE `user_id` = ? AND `priority` = 0;";
                sql = mysql.format(sql, user_id);
                let result = await db.conn.queryAsync(sql);
                console.log("INSERTED", result[0].nb);
                if (result[0].nb < 4) {*/
                    console.log("PRIORITY", priority);
                if (picture_id !== 0)
                    module.exports.deletePicture({token: token, picture_id: picture_id});
                    sql = "INSERT INTO `picture` (`picture_id`, `user_id`, `src`, `priority`) VALUES (NULL,?,?,?)";
                    sql = mysql.format(sql, [user_id, url, priority]);
                    result = await db.conn.queryAsync(sql); 
                /*}*/
                return result;
        } catch (err) {
            console.log("ERR", err);
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    getPicture: async ({token}) => {
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const user_id = decoded.user_id;

            let sql = "SELECT `picture_id`, `user_id`, `src`, `priority` FROM `picture` WHERE `user_id` = ?;";
            sql = mysql.format(sql, user_id);
            const result = await db.conn.queryAsync(sql);
            console.log("PICTURES", result);
            return result;            
        } catch (err) {
            console.log("ERR", err);
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    deletePicture: async ({token, picture_id}) => {
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const user_id = decoded.user_id;
            let sql = "DELETE FROM `picture` WHERE `user_id` = ? AND `picture_id` = ?";
            sql = mysql.format(sql, [user_id, picture_id]);
            const result = await db.conn.queryAsync(sql);
            console.log("deleted", result);
            console.log("deleting");
        } catch (err) {
            console.log("ERR", err);
            throw (errors.errorTypes.BAD_REQUEST);
        }
    }
}