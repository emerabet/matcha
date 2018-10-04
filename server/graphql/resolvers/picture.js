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
            if (type === 'side_picture' || type === 'empty_picture')
                priority = 0;
            else
                priority = 1;
                /*let sql = "SELECT COUNT(`picture_id`) as nb FROM `picture` WHERE `user_id` = ? AND `priority` = 0;";
                sql = mysql.format(sql, user_id);
                let result = await db.conn.queryAsync(sql);
                console.log("INSERTED", result[0].nb);
                if (result[0].nb < 4) {*/
                    console.log("PRIORITYYYY", priority);
                    console.log("PICTURE ID", picture_id);
                if (picture_id !== 0)
                    module.exports.deletePicture({token: token, picture_id: picture_id});
                    sql = "INSERT INTO `picture` (`picture_id`, `user_id`, `src`, `priority`) VALUES (NULL,?,?,?)";
                    sql = mysql.format(sql, [user_id, url, priority]);
                    result = await db.conn.queryAsync(sql); 
                    console.log("RES LAST INSERT", result);
                /*}*/
                return result;
        } catch (err) {
            console.log("ERR", err);
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    getPicture: async ({token, user_id2 = 0}) => {
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const user_id = user_id2 === 0 ? decoded.user_id: user_id2;

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