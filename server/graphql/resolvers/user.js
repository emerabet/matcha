const mysql = require('mysql');
const db = require('../../db/connection');
const jwt = require('jsonwebtoken');
const errors = require('../errors');
const bcrypt = require('bcrypt');
const config = require('../../config');
const axios = require('axios');
const NodeGeocoder = require('node-geocoder');
const nodemailer = require('nodemailer');
const uniqid = require('uniqid');

let smtpConfig = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: config.USER,
        pass: config.PASSWORD
    },
    rejectUnauthorized: false
};

let transporter = nodemailer.createTransport(smtpConfig);

const options = {
    provider: 'google',
   
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: config.GOOGLE_KEY, // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

const geocoder = NodeGeocoder(options);

const queriesTag = require('../resolvers/tag');
const queriesPicture = require('../resolvers/picture');

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
    addUser: async ({ user, address }, context) => {
        const register_token = uniqid();
        const hash = bcrypt.hashSync(user.password, 10);
        let sql = "INSERT INTO `user` (`user_id`, `login`, `email`, `last_name`, `first_name`, `password`, `register_token`, `reset_token`, `last_visit`, `creation_date`, `role`, `share_location`) VALUES (NULL, ?, ?, ?, ?, ?, ?, 'asdad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '1', '0');"; 
        try {
            sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, hash, register_token]);
            const result = await db.conn.queryAsync(sql);
            const add = await axios.get(`http://api.ipstack.com/${address.ip}?access_key=${config.IPSTACK_KEY}`);
            sql = 'INSERT INTO `address` (`address_id`, `user_id`, `latitude`, `longitude`, `zipcode`, `city`, `country`) VALUES (NULL, ?,?,?,?,?,?) ON DUPLICATE KEY UPDATE `latitude` = ?, `longitude` = ?, `zipcode` = ?, `city` = ?, `country` = ?;';
            sql = mysql.format(sql, [result.insertId, add.data.latitude, add.data.longitude, add.data.zip, add.data.city, add.data.country_name, add.data.latitude, add.data.longitude, add.data.zip, add.data.city, add.data.country_name]);
            let res = await db.conn.queryAsync(sql);
            const insertId = result.insertId;
            sql = 'INSERT INTO `profil` (`user_id`, `gender`, `orientation`, `bio`, `popularity`, `birthdate`) VALUES (?, "","both","",0,NULL);';
            sql = mysql.format(sql, [insertId]);
            res = await db.conn.queryAsync(sql);

            var mailData = {
                from: config.USER,
                to: user.email,
                subject: 'Your Matcha\'s account has been successfully created',
                text: `Please click on this link to activate your account: https://${context.hostname}:4000/verif/${register_token}`,
                html: `Please click on this link to activate your account: https://${context.hostname}:4000/verif/${register_token}`
            };

            transporter.sendMail(mailData, function(error, info){
                if(error){
                    console.log('Email not sent');
                }
            });
            return insertId;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    getUser: async ({extended, user_id2 = 0}, context) => {
        const token = context.token;
        try {
            
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const decoded = await jwt.verify(token, config.SECRET_KEY);

            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            
            const userId = user_id2 === 0 ? decoded.user_id: user_id2;
            let sql = `SELECT user.user_id, user.login, user.email, user.last_name, user.first_name, 
                                user.share_location, user.last_visit, profil.gender, profil.orientation, profil.bio, profil.birthdate, 
                                YEAR(NOW()) - YEAR(profil.birthdate) as age, profil.popularity, address.latitude, address.longitude, address.country, address.city 
                        FROM user 
                        LEFT JOIN profil on user.user_id = profil.user_id 
                        LEFT JOIN address on user.user_id = address.user_id
                        WHERE user.user_id = ?;`; 
            sql = mysql.format(sql, userId);
            const users = await db.conn.queryAsync(sql);

            if (extended === true) {
                const tags = await queriesTag.getTagByUser({id: userId});
                users[0].tags = tags;
            }

            const pictures = await queriesPicture.getPicture({token: token, user_id2: user_id2});
            users[0].pictures = pictures;
            if (user_id2 === decoded.user_id)
                users[0].isMyProfile = true;
            else
                users[0].isMyProfile = false;
            return users[0];
        } catch (err) {
            throw new Error(errors.errorTypes.UNAUTHORIZED);
        }
    },

    getUsers: async ({ extended, orientation, gender = "" }, context) => {
        try {
            const token = context.token;
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const decoded = await jwt.verify(token, config.SECRET_KEY);


            let criteria = '';
            switch(orientation.toLowerCase()) {
                case 'female': criteria = `AND (profil.gender = 'Female' OR profil.gender = 'female')`
                    break;
                case 'male': criteria = `AND (profil.gender = 'Male' OR profil.gender = 'male')`
                    break;
                default: break;
            }

            let criteriab = "";
            if (gender !== "") {
                switch(gender.toLowerCase()) {
                    case 'female': criteria = `AND (profil.orientation = 'Female' OR profil.orientation = 'female')`
                        break;
                    case 'male': criteria = `AND (profil.orientation = 'Male' OR profil.orientation = 'male')`
                        break;
                    default: break;
                }
                criteria = `${criteria} ${criteriab}`;
            }

            let sql = `SELECT user.user_id, user.login, user.email, user.last_name, user.first_name, user.share_location, 
                                user.last_visit, profil.gender, profil.orientation, profil.bio, profil.birthdate, 
                                YEAR(NOW()) - YEAR(profil.birthdate) as age, profil.popularity, address.latitude, address.longitude, address.city, address.country, picture_id, priority, picture.src
                        FROM user 
                        LEFT JOIN address on user.user_id = address.user_id
                        LEFT JOIN profil on user.user_id = profil.user_id ${criteria}
                        LEFT JOIN picture on user.user_id = picture.user_id 
                        WHERE (picture.priority = 1 OR picture.priority IS NULL);`;
            const users = await db.conn.queryAsync(sql);

            if (extended === true) {
                const tags = await queriesTag.getAllTags();

                mergeResults(users, tags, "tags", { parentCmp: "user_id", childCmp: "owner_id" });
            }

            return users;
        } catch (err) {
            throw err.message;
        }
    },

    updateUser: async ({ user, profile, address }, context) => {
        const token = context.token;
        try {
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
                let sql = 'SELECT `password` FROM `user` WHERE `user_id` = ?;'; 
                sql = mysql.format(sql, decoded.user_id);
                let result = await db.conn.queryAsync(sql);
                if (!bcrypt.compareSync(user.old_password, result[0].password))
                    throw new Error(errors.errorTypes.UNAUTHORIZED);
                if(user.password !== "") {
                    var hash = bcrypt.hashSync(user.password, 10);
                    sql = 'UPDATE `user` SET `login` = ?, `email` = ?, `last_name` = ?, `first_name` = ?, `password` = ?, `share_location` = ? WHERE `user_id` = ?;'; 
                    sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, hash, profile.share_location, decoded.user_id]);
                } else {
                    sql = 'UPDATE `user` SET `login` = ?, `email` = ?, `last_name` = ?, `first_name` = ?, `share_location` = ? WHERE `user_id` = ?;'; 
                    sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, profile.share_location, decoded.user_id]);
                }
                result = await db.conn.queryAsync(sql);
                sql = 'INSERT INTO `profil` (`user_id`, `gender`, `orientation`, `bio`, `birthdate`) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE `user_id` = ?, `gender` = ?, `orientation` = ?, `bio` = ?, `birthdate` = ?;';
                sql = mysql.format(sql, [decoded.user_id, profile.gender, profile.orientation, profile.bio, profile.birthdate, decoded.user_id, profile.gender, profile.orientation, profile.bio, profile.birthdate]);
                result = await db.conn.queryAsync(sql);
                
                sql = "";
                for (let i in profile.new_tags) {
                    sql += 'INSERT INTO `interest` (`user_id`, `tag`) VALUES (?,?); ';
                    sql = mysql.format(sql, [decoded.user_id, profile.new_tags[i]]);
                }
                if (sql !== "") {
                    result = await db.conn.queryAsync(sql);
                }
                sql = "";
                for (let i in profile.delete_tags) {
                    sql += 'DELETE FROM `interest` WHERE `user_id` = ? AND `tag` = ?; ';
                    sql = mysql.format(sql, [decoded.user_id, profile.delete_tags[i]]);
                }
                
                if (sql !== "") {
                    result = await db.conn.queryAsync(sql);
                }

                if (address.latitude == 0 || address.longitude == 0) {
                    const add = await axios.get(`http://api.ipstack.com/${address.ip}?access_key=${config.IPSTACK_KEY}`);
                    sql = 'INSERT INTO `address` (`address_id`, `user_id`, `latitude`, `longitude`, `zipcode`, `city`, `country`) VALUES (NULL, ?,?,?,?,?,?) ON DUPLICATE KEY UPDATE `latitude` = ?, `longitude` = ?, `zipcode` = ?, `city` = ?, `country` = ?;';
                    sql = mysql.format(sql, [decoded.user_id, add.data.latitude, add.data.longitude, add.data.zip, add.data.city, add.data.country_name, add.data.latitude, add.data.longitude, add.data.zip, add.data.city, add.data.country_name]);
                    result = await db.conn.queryAsync(sql);
                } else {
                    geocoder.reverse({lat: address.latitude, lon: address.longitude}, async function(err, res) {
                        sql = 'INSERT INTO `address` (`address_id`, `user_id`, `latitude`, `longitude`, `zipcode`, `city`, `country`) VALUES (NULL, ?,?,?,?,?,?) ON DUPLICATE KEY UPDATE `latitude` = ?, `longitude` = ?, `zipcode` = ?, `city` = ?, `country` = ?;';
                        sql = mysql.format(sql, [decoded.user_id, address.latitude, address.longitude, res[0].zipcode, res[0].city, res[0].country, address.latitude, address.longitude, res[0].zipcode, res[0].city, res[0].country]);
                        result = await db.conn.queryAsync(sql);
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
    },

    likeUser: async ({user_id_to_like}, context) => {
        const token = context.token;
        try {
            let ret = false;
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            if (user_id_to_like !== decoded.user_id) {
                let sql = 'SELECT COUNT(user_id_visitor) as nb from `liked` WHERE `user_id_visitor` = ? AND `user_id_visited` = ?;'
                sql = mysql.format(sql, [user_id_to_like, decoded.user_id]);
                let result = await db.conn.queryAsync(sql);
                const flag_liked = result[0].nb;
                
                sql = 'SELECT COUNT(user_id_visitor) as nb from `liked` WHERE `user_id_visitor` = ? AND `user_id_visited` = ?;'
                sql = mysql.format(sql, [decoded.user_id, user_id_to_like]);
                result = await db.conn.queryAsync(sql);
                
                if (result[0].nb === 0){
                    sql = 'INSERT INTO `liked` (`user_id_visitor`, `user_id_visited`, `date`) VALUES(?,?,CURRENT_TIMESTAMP);';
                    sql = mysql.format(sql, [decoded.user_id, user_id_to_like]);
                    result = await db.conn.queryAsync(sql);
                    
                    ret = await module.exports.addNotification({type: "like", user_id_from: decoded.user_id, user_id_to: user_id_to_like});
                    if (ret === false) {
                        module.exports.updateScore(user_id_to_like, 2);
                        return 3; // like but blocked
                    }
                    if (flag_liked > 0) {
                        sql = 'INSERT INTO `matched` (`user_id_visitor`, `user_id_visited`, `date`) VALUES(?,?,CURRENT_TIMESTAMP);';
                        sql = mysql.format(sql, [decoded.user_id, user_id_to_like]);
                        result = await db.conn.queryAsync(sql);
                        
                        module.exports.addNotification({type: "match", user_id_from: decoded.user_id, user_id_to: user_id_to_like});
                        module.exports.addNotification({type: "match", user_id_from: user_id_to_like, user_id_to: decoded.user_id});
                        sql = 'INSERT INTO `chat` (`chat_id`, `user_id1`, `user_id2`) VALUES(NULL,?,?);';
                        sql = mysql.format(sql, [decoded.user_id, user_id_to_like]);
                        result = await db.conn.queryAsync(sql);
                        
                    }
                    module.exports.updateScore(user_id_to_like, 2);
                    return 1; // like
                } else {
                    sql = 'DELETE FROM `liked` WHERE `user_id_visitor` = ? AND `user_id_visited` = ?;';
                    sql = mysql.format(sql, [decoded.user_id, user_id_to_like]);
                    result = await db.conn.queryAsync(sql);
                    ret = await module.exports.addNotification({type: "unlike", user_id_from: decoded.user_id, user_id_to: user_id_to_like});
                    sql = 'DELETE FROM `chat` WHERE (`user_id1` = ? AND `user_id2` = ?) OR (`user_id1` = ? AND `user_id2` = ?);';
                        sql = mysql.format(sql, [user_id_to_like, decoded.user_id, decoded.user_id, user_id_to_like]);
                        await db.conn.queryAsync(sql);
                    if (ret === false) {
                        module.exports.updateScore(user_id_to_like, -2);
                        return 4; // unlike but blocked
                    }
                    if (flag_liked > 0) {
                        sql = 'DELETE FROM `matched` WHERE `user_id_visitor` = ? AND `user_id_visited` = ?;';
                        sql = mysql.format(sql, [decoded.user_id, user_id_to_like]);
                        result = await db.conn.queryAsync(sql);
                        
                        module.exports.addNotification({type: "unmatch", user_id_from: user_id_to_like, user_id_to: decoded.user_id});
                        sql = 'DELETE FROM `matched` WHERE `user_id_visitor` = ? AND `user_id_visited` = ?;';
                        sql = mysql.format(sql, [user_id_to_like, decoded.user_id]);
                        result = await db.conn.queryAsync(sql);
                        
                        module.exports.addNotification({type: "unmatch", user_id_from: decoded.user_id, user_id_to: user_id_to_like});
                        sql = 'DELETE FROM `chat` WHERE (`user_id1` = ? AND `user_id2` = ?) OR (`user_id1` = ? AND `user_id2` = ?);';
                        sql = mysql.format(sql, [user_id_to_like, decoded.user_id, decoded.user_id, user_id_to_like]);
                        await db.conn.queryAsync(sql);
                    }
                    module.exports.updateScore(user_id_to_like, -2);
                    return 2; // unlike
                }
            }
        } catch (err) {
            throw err.message;
        }

    },

    addToBlackList: async ({user_id_to_black_list}, context) => {
        const token = context.token;
        try {
            let ret = false;
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
                
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            if (user_id_to_black_list !== decoded.user_id) {
                let sql = 'SELECT COUNT(user_id_blocked) as nb from `black_listed` WHERE `user_id_blocked` = ? AND `user_id_blocker` = ?;'
                sql = mysql.format(sql, [user_id_to_black_list, decoded.user_id]);
                let result = await db.conn.queryAsync(sql);
                
                if (result[0].nb === 0){
                    sql = 'INSERT INTO `black_listed` (`user_id_blocked`, `user_id_blocker`, `date`) VALUES(?,?,CURRENT_TIMESTAMP);';
                    sql = mysql.format(sql, [user_id_to_black_list, decoded.user_id]);
                    result = await db.conn.queryAsync(sql);
                    ret = await module.exports.addNotification({type: "black_list", user_id_from: decoded.user_id, user_id_to: user_id_to_black_list});
                    module.exports.updateScore(user_id_to_black_list, -2);
                        sql = 'DELETE FROM `chat` WHERE (`user_id1` = ? AND `user_id2` = ?) OR (`user_id1` = ? AND `user_id2` = ?);';
                        sql = mysql.format(sql, [user_id_to_black_list, decoded.user_id, decoded.user_id, user_id_to_black_list]);
                    return ret;
                } else {
                    sql = 'DELETE FROM `black_listed` WHERE `user_id_blocked` = ? AND `user_id_blocker` = ?;';
                    sql = mysql.format(sql, [user_id_to_black_list, decoded.user_id]);
                    result = await db.conn.queryAsync(sql);
                    ret = await module.exports.addNotification({type: "unblack_list", user_id_from: decoded.user_id, user_id_to: user_id_to_black_list});
                    return ret;
                }
            }
            return false;
        } catch (err) {
            console.log("User not blacklisted");
            throw err.message;
        }

    },

    addToReport: async ({user_id_to_report}, context) => {
        const token = context.token;
        try {
            let ret = false;
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
                
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            if (user_id_to_report !== decoded.user_id) {
                let sql = 'SELECT COUNT(user_id_reported) as nb from `reported` WHERE `user_id_reported` = ? AND `user_id_reporter` = ?;'
                sql = mysql.format(sql, [user_id_to_report, decoded.user_id]);
                let result = await db.conn.queryAsync(sql);
                
                if (result[0].nb === 0){
                    sql = 'INSERT INTO `reported` (`user_id_reported`, `user_id_reporter`, `date`) VALUES(?,?,CURRENT_TIMESTAMP);';
                    sql = mysql.format(sql, [user_id_to_report, decoded.user_id]);
                    result = await db.conn.queryAsync(sql);
                    
                    ret = await module.exports.addNotification({type: "report", user_id_from: decoded.user_id, user_id_to: user_id_to_report});
                    return ret;
                } else {
                    sql = 'DELETE FROM `reported` WHERE `user_id_reported` = ? AND `user_id_reporter` = ?;';
                    sql = mysql.format(sql, [user_id_to_report, decoded.user_id]);
                    result = await db.conn.queryAsync(sql);
                    ret = await module.exports.addNotification({type: "unreport", user_id_from: decoded.user_id, user_id_to: user_id_to_report});
                    return ret;
                }
            }
            return false;
        } catch (err) {
            console.log("User not reported");
            throw err.message;
        }

    },

    addVisit: async ({user_id_visited}, context) => {
        const token = context.token;
        try {
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
                
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            if (user_id_visited !== decoded.user_id) {
                let sql = 'INSERT INTO `visit` (`visit_id`, `user_id_visitor`, `user_id_visited`, `date`) VALUES(NULL,?,?,CURRENT_TIMESTAMP);';
                sql = mysql.format(sql, [decoded.user_id, user_id_visited]);
                await db.conn.queryAsync(sql);
                const ret = await module.exports.addNotification({type: "visit", user_id_from: decoded.user_id, user_id_to: user_id_visited});
                return ret;
            }
            return false;
        } catch (err) {
            console.log("Visit no added");
            throw err.message;
        }

    },

    addNotification: async ({type, user_id_from, user_id_to}) => {
        let sql = 'SELECT COUNT(user_id_blocked) as nb FROM `black_listed` WHERE `user_id_blocked` = ? AND `user_id_blocker` = ?;';
        sql = mysql.format(sql, [user_id_from, user_id_to]);
        let result = await db.conn.queryAsync(sql);
        if (result[0].nb > 0)
            return false

        sql = 'INSERT INTO `notification` (`notification_id`, `type`, `user_id_from`, `user_id_to`, `date`, `is_read`) VALUES(NULL,?,?,?,CURRENT_TIMESTAMP, 0);';
        sql = mysql.format(sql, [type, user_id_from, user_id_to]);
        result = await db.conn.queryAsync(sql);
        
        if (result.insertId)
            return true;
        return false;
    },

    getUserNotifications: async ({ search }, context) => {
                
        try {
            const token = context.token;

            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const userId = decoded.user_id;
            let sql = `SELECT notification_id, type, user_id_from, user_id_to, date, is_read, login, email, last_name, first_name, src
                        FROM notification 
                        INNER JOIN user on notification.user_id_from = user.user_id
                        LEFT JOIN picture on notification.user_id_from = picture.user_id
                        WHERE user_id_to = ?
                        AND (priority = 1 OR priority IS NULL) 
                        ${search == 'unread' ? 'AND is_read = 0 ORDER BY date DESC, notification_id DESC;' : 'ORDER BY date DESC, notification_id DESC;'}
                        `;
            sql = mysql.format(sql, [userId]);
            const result = await db.conn.queryAsync(sql);
            return result;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    removeNotification: async ({notification_id}, context) => {
        try {
            
            const token = context.token;

            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const userId = decoded.user_id;
            let sql = `DELETE FROM notification WHERE notification_id = ? AND user_id_to = ?;`;
            sql = mysql.format(sql, [notification_id, userId]);
            await db.conn.queryAsync(sql);
            
            return true;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    checkNotification: async ({notification_id}, context) => {
        try {
            const token = context.token;

            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const userId = decoded.user_id;
            let sql = `UPDATE notification SET is_read = 1 WHERE notification_id = ? AND user_id_to = ?;`;
            sql = mysql.format(sql, [notification_id, userId]);
            await db.conn.queryAsync(sql);
            return true;
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    getStatusLikedReported: async ({ user_id2 }, context) => {
        try {
            const token = context.token;

            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);

            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                    throw new Error(errors.errorTypes.UNAUTHORIZED);
            const userId = decoded.user_id;
            let sql = `SELECT liked.date as liked, reported.date as report, black_listed.date as reported
            FROM user
            LEFT JOIN reported ON user.user_id = reported.user_id_reporter AND reported.user_id_reported = ?
            LEFT JOIN liked ON user.user_id = liked.user_id_visitor AND liked.user_id_visited = ?
            LEFT JOIN black_listed ON user.user_id = black_listed.user_id_blocker AND black_listed.user_id_blocked = ?
            WHERE (reported.user_id_reporter = ? OR liked.user_id_visitor = ? OR black_listed.user_id_blocker = ?)
            LIMIT 1;;`;

            sql = mysql.format(sql, [user_id2, user_id2, user_id2, userId, userId, userId]);
            const result = await db.conn.queryAsync(sql);
            return result[0];
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    confirmAccount: async ({registration_token}) => {
        let sql = 'UPDATE `user` SET `register_token` = "validated" WHERE `register_token` = ?';
        sql = mysql.format(sql, [registration_token]);
        const result = await db.conn.queryAsync(sql);
        if (result.affectedRows > 0)
            return true;
        else
            return false;
    },
    resetPassword: async ({login}, context) => {
        const reset_token = uniqid();
        let sql = 'UPDATE `user` SET `reset_token` =  ? WHERE `login` = ?';
        sql = mysql.format(sql, [reset_token, login]);
        let result = await db.conn.queryAsync(sql);
        if (result.affectedRows > 0) {
            sql = 'SELECT `email` FROM `user` WHERE `login` = ?';
            sql = mysql.format(sql, [login]);
            result = await db.conn.queryAsync(sql);
            if (result[0]) {
                var mailData = {
                    from: config.USER,
                    to: result[0].email,
                    subject: 'Matcha\'s password reset',
                    text: `Please click on this link to reset your password: https://${context.hostname}:4000/new_password/${reset_token}`,
                    html: `Please click on this link to reset your password: https://${context.hostname}:4000/new_password/${reset_token}`
                };
    
                transporter.sendMail(mailData, function(error, info)
                {
                    if (error){
                        return console.log("Email not sent");
                    }
                });
            }
        }
    },

    checkResetToken: async ({reset_token, password}) => {
        const hash = bcrypt.hashSync(password, 10);
        let sql = 'UPDATE `user` SET `reset_token` = "reset", `password` = ? WHERE `reset_token` = ?';
        sql = mysql.format(sql, [hash, reset_token]);
        const result = await db.conn.queryAsync(sql);
        if (result.affectedRows > 0)
            return true;
        else
            return false;
    },

    updateUserLocation: async ({address}, context) => {
        try {
            const token = context.token;
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                    throw new Error(errors.errorTypes.UNAUTHORIZED);
            const userId = decoded.user_id;
            let sql = "";
            let result = "";
                sql = 'UPDATE `user` SET `share_location` = 1 WHERE `user_id` = ?';               
                sql = mysql.format(sql, [userId]);
                result = await db.conn.queryAsync(sql);
            
                sql = 'UPDATE `address` SET `latitude` = ?, `longitude` = ? WHERE `user_id` = ?';               
                sql = mysql.format(sql, [address.latitude, address.longitude, userId]);
                result = await db.conn.queryAsync(sql);
                const t = await geocoder.reverse({lat: address.latitude, lon: address.longitude});
                    sql = 'INSERT INTO `address` (`address_id`, `user_id`, `latitude`, `longitude`, `zipcode`, `city`, `country`) VALUES (NULL, ?,?,?,?,?,?) ON DUPLICATE KEY UPDATE `latitude` = ?, `longitude` = ?, `zipcode` = ?, `city` = ?, `country` = ?;';
                    sql = mysql.format(sql, [decoded.user_id, address.latitude, address.longitude, t[0].zipcode, t[0].city, t[0].country, address.latitude, address.longitude, t[0].zipcode, t[0].city, t[0].country]);
                    result = await db.conn.queryAsync(sql);
                   
                    if (result.affectedRows > 0) {
                        sql = 'SELECT CONCAT(address.zipcode, " ", address.city, " ", address.country) as address from `address` WHERE `user_id` = ?';               
                        sql = mysql.format(sql, [userId]);
                        result = await db.conn.queryAsync(sql);
                        return (result[0].address);
                    }
                else
                    return "nok";
        } catch (err) {
            throw (errors.errorTypes.BAD_REQUEST);
        }
    },

    getReported: async ({}, context) => {
        const token = context.token;
        try {
            
            if (!token) 
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            
            if (decoded.role !== 2)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            const sql = 'SELECT reported.user_id_reported, user_reported.login as user_reported_login, user_reported.email as user_reported_email, reported.user_id_reporter, user_reporter.login as user_reporter_login, user_reporter.email as user_reporter_email, reported.date FROM `reported` LEFT JOIN `user` as user_reported ON reported.user_id_reported = user_reported.user_id LEFT JOIN `user` as user_reporter ON reported.user_id_reporter = user_reporter.user_id'; 
            const reported = await db.conn.queryAsync(sql);
            
            return reported;
        } catch (err) {
            throw new Error(errors.errorTypes.UNAUTHORIZED);
        }
    },

    updateScore: async (user_id, to_add) => {
        let sql = 'SELECT `popularity` FROM `profil` WHERE user_id = ?';
        sql = mysql.format(sql, [user_id]);
        const result = await db.conn.queryAsync(sql);
        const pop = result[0].popularity + to_add;
        if (pop >= 0 && pop <= 100) {
            sql = 'UPDATE `profil` SET `popularity` = ? WHERE `user_id` = ?';
            sql = mysql.format(sql, [pop, user_id]);
            await db.conn.queryAsync(sql);
        }
    },

    checkProfile: async ({}, context) => {
        const token = context.token;
        try {
            if (!token)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
                
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            if (decoded.err)
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            
            let sql = 'SELECT COUNT(`user_id`) as nb FROM `profil` WHERE profil.user_id = ? AND profil.gender IS NOT NULL AND profil.birthdate IS NOT NULL AND profil.bio IS NOT NULL AND (SELECT COUNT(picture.user_id) FROM `picture` WHERE picture.user_id = ? AND picture.priority = 1) >= 1;'
            sql = mysql.format(sql, [decoded.user_id, decoded.user_id]);
            const result = await db.conn.queryAsync(sql);
            if (result[0].nb === 1)
                return true;
            else
                return false;
        } catch (err) {
            console.log("User not found");
            throw err.message;
        }

    }
}