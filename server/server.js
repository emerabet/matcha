const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
var mysql = require('mysql');
const db = require('./connection');
const schemas = require('./graphql/schemas');
const route = require('./routes/route');



app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

class User {
    constructor(user_name, first_name, last_name, email, password) {
        this.user_name = user_name;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
    }
}

const root = {
    addUser: /*async*/ function({user_name, first_name, last_name, email, password}) {
        new User(user_name, first_name, last_name, email, password);
        //let sql = `INSERT into VALUES (null, ?, ?, ?, ?, ?, "token", "token", null, null, 1)`; 
        //
          //      sql = mysql.format(sql, [user_name, email, last_name, first_name, password]);
            //    const rows = await db.conn.queryAsync(sql);

    }
}

app.use('/api', express_graphql({
    schema: schemas.registerSchema,
    rootValue: root,
    graphiql: true
}));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));


route.setRoutes(app);
