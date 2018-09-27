const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var mysql = require('mysql');
const db = require('./db/connection');
const schemas = require('./graphql/schemas');
const route = require('./routes/route');



app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

class User {
    constructor(id, {user_name}) {
        this.id = id;
        this.user_name = user_name;
    }
}

const root = {
    addUser: async function({user}) {
            console.log("user to add in db", user);
            let sql = "INSERT INTO `user` (`user_id`, `login`, `email`, `last_name`, `first_name`, `password`, `register_token`, `reset_token`, `last_visit`, `creation_date`, `role`) VALUES (NULL, ?, ?, ?, ?, ?, 'sadas', 'asdad', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, '1');"; 
            sql = mysql.format(sql, [user.user_name, user.email, user.last_name, user.first_name, user.password]);
            const result = await db.conn.queryAsync(sql);
            console.log("ID", result.insertId);
            return result.insertId;
    },
    getUser: async function({id}) {
        console.log("uuser to get from db", id);
            let sql = "SELECT * from `user` WHERE `user_id` = ?;"; 
            sql = mysql.format(sql, id);
            const result = await db.conn.queryAsync(sql);
            console.log("ID", result);
            return result[0];
    }

}


app.use('/api', express_graphql({
    schema: schemas.registerSchema,
    rootValue: root,
    graphiql: true
}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


route.setRoutes(app);
