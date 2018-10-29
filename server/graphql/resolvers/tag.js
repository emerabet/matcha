const mysql = require('mysql');
const db = require('../../db/connection');
const errors = require('../errors');

module.exports = {
    getTags: async () => {
        try {
            let sql = "SELECT DISTINCT tag FROM interest ORDER BY tag;";
            const result = await db.conn.queryAsync(sql);
            return result;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    getAllTags: async () => {
        try {
            let sql = "SELECT interest.user_id as owner_id, tag FROM interest ORDER BY user_id;";
            const result = await db.conn.queryAsync(sql);
            return result;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    getTagByUser: async ({id}) => {
        try {
            let sql = "SELECT tag FROM interest WHERE interest.user_id = ? ORDER BY tag;";
            sql = mysql.format(sql, [id]);
            const result = await db.conn.queryAsync(sql);
            return result;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    }
}