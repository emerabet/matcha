const mysql = require('mysql');
const db = require('../../db/connection');
const errors = require('../errors');

module.exports = {
    getTags: async () => {
        try {
            let sql = "SELECT DISTINCT tag FROM interest ORDER BY tag;";
            const result = await db.conn.queryAsync(sql);
            console.log(result);
            return result;
        } catch (err) {
            console.log("ERR", err);
            throw (errors.errorTypes.BAD_REQUEST);
        }
    }
}