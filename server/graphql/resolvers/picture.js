const mysql = require('mysql');
const db = require('../../db/connection');
const errors = require('../errors');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const fs = require('fs');

module.exports = {
    addPicture: async ({token, picture_id, url, type, delete_url = 0}) => {
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
                if (Number.parseInt(picture_id, 10) !== 0)
                    module.exports.deletePicture({picture_id: picture_id, picture_src: delete_url}, {token: token});
                    sql = "INSERT INTO `picture` (`picture_id`, `user_id`, `src`, `priority`) VALUES (NULL,?,?,?)";
                    sql = mysql.format(sql, [user_id, url, priority]);
                    result = await db.conn.queryAsync(sql); 
                return result;
        } catch (err) {
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
            return result;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    deletePicture: async ({picture_id, picture_src}, context) => {
        const token = context.token;
        try {
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const user_id = decoded.user_id;
            
            
            let sql = "DELETE FROM `picture` WHERE `user_id` = ? AND `picture_id` = ?";
            sql = mysql.format(sql, [user_id, picture_id]);
            const r = await db.conn.queryAsync(sql);
            console.log(r)
            if (r && r.affectedRows === 1){
                console.log("trying to remove", `${appRoot}/build${picture_src}`);
            if (await fs.existsSync(`${appRoot}/build${picture_src}`)){
                await fs.unlink(`${appRoot}/build${picture_src}`, (err) => {
                    if (err) throw err;
                  });
            }
            }
            return module.exports.getPicture({token: token});
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    }
}