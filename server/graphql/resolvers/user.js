const mysql = require('mysql');
const db = require('../../db/connection');
const jwt = require('jsonwebtoken');
const errors = require('../errors');
const bcrypt = require('bcrypt');
const config = require('../../config');
const axios = require('axios');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
   
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: config.GOOGLE_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

const geocoder = NodeGeocoder(options);

const queriesTag = require('../resolvers/tag');

/* Incorpore les elements du tableau child dans la propiete de chaque element du tableau parent, lorsque la comparaison parentCmp childCMp est vraie. */
const mergeResults = (parent, child, property, { parentCmp, childCmp }) => {
    parent.forEach(element => {
        element[property] = child.filter((itm) => {
            if (element[parentCmp] === itm[childCmp])
                return true;
        });
    });
}

module.exports = {
    addUser: async ({ user, address }) => {
        console.log("ADDRESS", address);
        console.log("user to add in db", user);
        var hash = bcrypt.hashSync(user.password, 10);
        let sql = "INSERT INTO `user` (`user_id`, `login`, `email`, `last_name`, `first_name`, `password`, `register_token`, `reset_token`, `last_visit`, `creation_date`, `role`, `share_location`) VALUES (NULL, ?, ?, ?, ?, ?, 'sadas', 'asdad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '1', '0');"; 
        try {
            sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, hash]);
            const result = await db.conn.queryAsync(sql);
            console.log("ID", result.insertId);
            
            const add = await axios.get(`http://api.ipstack.com/${address.ip}?access_key=${config.IPSTACK_KEY}`);
            console.log("LOCATION", add.data);
            sql = 'INSERT INTO `address` (`address_id`, `user_id`, `latitude`, `longitude`, `zipcode`, `city`, `country`) VALUES (NULL, ?,?,?,?,?,?) ON DUPLICATE KEY UPDATE `latitude` = ?, `longitude` = ?, `zipcode` = ?, `city` = ?, `country` = ?;';
            sql = mysql.format(sql, [result.insertId, add.data.latitude, add.data.longitude, add.data.zip, add.data.city, add.data.country_name, add.data.latitude, add.data.longitude, add.data.zip, add.data.city, add.data.country_name]);
            console.log("SQL", sql);
            const res = await db.conn.queryAsync(sql);
            console.log("ID", res[0]);
            return result.insertId;
        } catch (err) {
            console.log("ERR", err);
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },


    getUser: async ({ token, extended }) => {
        try {
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            console.log("token", token);
            const decoded = await jwt.verify(token, "config.secret");

            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);

            const userId = decoded.user_id;
            console.log("decoded", decoded);
            console.log("user to get from db", userId);
            let sql = `SELECT user.user_id, user.login, user.email, user.last_name, user.first_name, 
                                user.share_location, user.last_visit, profil.gender, profil.orientation, profil.bio, profil.birthdate, 
                                YEAR(NOW()) - YEAR(profil.birthdate) as age, profil.popularity, address.latitude, address.longitude
                        FROM user 
                        LEFT JOIN profil on user.user_id = profil.user_id 
                        LEFT JOIN address on user.user_id = address.user_id
                        WHERE user.user_id = ?;`; 
            sql = mysql.format(sql, userId);
            console.log(sql);
            const users = await db.conn.queryAsync(sql);

            if (extended === true) {
                const tags = await queriesTag.getTagByUser(userId);
                users[0].tags = tags;
            }

            console.log("ID", users[0]);
            return users[0];
        } catch (err) {
            throw err.message;
        }
    },

    getUsers: async ({ extended }) => {
        try {
            console.log("in get users");
            let sql = `SELECT user.user_id, user.login, user.email, user.last_name, user.first_name, user.share_location, 
                                user.last_visit, profil.gender, profil.orientation, profil.bio, profil.birthdate, 
                                YEAR(NOW()) - YEAR(profil.birthdate) as age, profil.popularity, address.latitude, address.longitude
                        FROM user 
                        LEFT JOIN address on user.user_id = address.user_id
                        LEFT JOIN profil on user.user_id = profil.user_id;`; 
            const users = await db.conn.queryAsync(sql);

            if (extended === true) {
                const tags = await queriesTag.getAllTags();

                mergeResults(users, tags, "tags", { parentCmp: "user_id", childCmp: "owner_id" });
            }




            console.log("ID", users[1].tags);
            return users;
        } catch (err) {
            throw err.message;
        }
    },

    updateUser: async ({ token, user, profile, address }) => {
        console.log("user to update in db", user);
        console.log("address", address);
        try {
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            console.log("token", token);
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
                console.log("decoded", decoded);
                console.log("USER", user);
                console.log("PROFILE", profile);
                let sql = 'SELECT `password` FROM `user` WHERE `user_id` = ?;'; 
                sql = mysql.format(sql, decoded.user_id);
                console.log("SQL", sql);
                let result = await db.conn.queryAsync(sql);
                console.log("ID", result[0]);
                if (!bcrypt.compareSync(user.old_password, result[0].password))
                    throw new Error(errors.errorTypes.UNAUTHORIZED);
                if(user.password !== "") {
                    var hash = bcrypt.hashSync(user.password, 10);
                    console.log("NEW PASSWORD", hash);
                    sql = 'UPDATE `user` SET `login` = ?, `email` = ?, `last_name` = ?, `first_name` = ?, `password` = ?, `share_location` = ? WHERE `user_id` = ?;'; 
                    sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, hash, profile.share_location, decoded.user_id]);
                } else {
                    sql = 'UPDATE `user` SET `login` = ?, `email` = ?, `last_name` = ?, `first_name` = ?, `share_location` = ? WHERE `user_id` = ?;'; 
                    sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, profile.share_location, decoded.user_id]);
                }
                console.log("SQL", sql);
                result = await db.conn.queryAsync(sql);
                console.log("ID", result[0]);
                sql = 'INSERT INTO `profil` (`user_id`, `gender`, `orientation`, `bio`, `popularity`, `birthdate`) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE `user_id` = ?, `gender` = ?, `orientation` = ?, `bio` = ?, `popularity` = ?, `birthdate` = ?;';
                sql = mysql.format(sql, [decoded.user_id, profile.gender, profile.orientation, profile.bio, profile.popularity, profile.birthdate, decoded.user_id, profile.gender, profile.orientation, profile.bio, profile.popularity, profile.birthdate]);
                console.log("SQL", sql);
                result = await db.conn.queryAsync(sql);
                console.log("ID", result[0]);
                
                sql = "";
                for (let i in profile.new_tags) {
                    sql += 'INSERT INTO `interest` (`user_id`, `tag`) VALUES (?,?); ';
                    sql = mysql.format(sql, [decoded.user_id, profile.new_tags[i]]);
                }
                console.log("SQL", sql);
                if (sql !== "") {
                    result = await db.conn.queryAsync(sql);
                    console.log("ID", result[0]);
                }
                sql = "";
                for (let i in profile.delete_tags) {
                    sql += 'DELETE FROM `interest` WHERE `user_id` = ? AND `tag` = ?; ';
                    sql = mysql.format(sql, [decoded.user_id, profile.delete_tags[i]]);
                }
                console.log("SQL", sql);
                if (sql !== "") {
                    result = await db.conn.queryAsync(sql);
                    console.log("ID", result[0]);
                }

                console.log(address);
                console.log("ICI");
                if (address.latitude == 0 || address.longitude == 0) {
                    const add = await axios.get(`http://api.ipstack.com/${address.ip}?access_key=${config.IPSTACK_KEY}`);
                    console.log("LOCATION", add.data);
                    sql = 'INSERT INTO `address` (`address_id`, `user_id`, `latitude`, `longitude`, `zipcode`, `city`, `country`) VALUES (NULL, ?,?,?,?,?,?) ON DUPLICATE KEY UPDATE `latitude` = ?, `longitude` = ?, `zipcode` = ?, `city` = ?, `country` = ?;';
                    sql = mysql.format(sql, [decoded.user_id, add.data.latitude, add.data.longitude, add.data.zip, add.data.city, add.data.country_name, add.data.latitude, add.data.longitude, add.data.zip, add.data.city, add.data.country_name]);
                    console.log("SQL", sql);
                    result = await db.conn.queryAsync(sql);
                    console.log("ID", result[0]);
                } else {
                    geocoder.reverse({lat: address.latitude, lon: address.longitude}, function(err, res) {
                        console.log("GOOGLE", res);
                      });
                }

                return "Update done";
        } catch (err) {
            throw err.message;
        }
        
    },

    getLogin: async ({ login }) => {
        let sql = 'SELECT `user_id` from `user` WHERE `login` = ?';
        sql = mysql.format(sql, login);
        const result = await db.conn.queryAsync(sql);
        if (result[0])
            return true;
        else
            return false;
    },

    getEmail: async ({ email }) => {
        let sql = 'SELECT `user_id` from `user` WHERE `email` = ?';
        sql = mysql.format(sql, email);
        const result = await db.conn.queryAsync(sql);
        if (result[0])
            return true;
        else
            return false;
    }
}