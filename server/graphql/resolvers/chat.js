const mysql = require('mysql');
const db = require('../../db/connection');
const errors = require('../errors');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const fs = require('fs');

module.exports = {
    getContacts: async ({context}) => {
        console.log("CONTEXT", context);
        console.log("TOKEN", context.token);
        /*try {
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
                    console.log("PRIORITYYYY", priority);
                    console.log("PICTURE ID", picture_id);
                if (Number.parseInt(picture_id, 10) !== 0)
                    module.exports.deletePicture({picture_id: picture_id, picture_src: delete_url}, {token: token});
                    sql = "INSERT INTO `picture` (`picture_id`, `user_id`, `src`, `priority`) VALUES (NULL,?,?,?)";
                    sql = mysql.format(sql, [user_id, url, priority]);
                    result = await db.conn.queryAsync(sql); 
                    console.log("RES LAST INSERT", result);
                return result;
        } catch (err) {
            console.log("ERR", err);
            throw (errors.errorTypes.BAD_REQUEST);
        }*/
    }
}