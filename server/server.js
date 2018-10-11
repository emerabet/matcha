const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const express_graphql = require('express-graphql');
const schemas = require('./graphql/schemas');
const route = require('./routes/route');
const resolversUser = require('./graphql/resolvers/user');
const resolverTags = require('./graphql/resolvers/tag');
const resolverPicture = require('./graphql/resolvers/picture');
const resolverChat = require('./graphql/resolvers/chat');
const errors = require('./graphql/errors');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('./config');
const cookieParser = require('cookie-parser');



let rootDir = __dirname; 
let i = rootDir.lastIndexOf('/');
if (i !== -1)
    rootDir = rootDir.substr(0, i);
global.appRoot = path.resolve(rootDir);

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
//app.use(cors({credentials: true, origin: 'http://10.18.198.50:3000'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const root = {
    ...resolversUser,
    ...resolverTags,
    ...resolverPicture,
    ...resolverChat
}

const mdw = async (req, res, next) => {
    console.log("IN MIDDLEWARE", req.headers);
    console.log('Cookies: ', req.cookies)
    const token = req.cookies['sessionid'];
    // Cookies that have been signed
    console.log('Signed Cookies: ', req.signedCookies)
    try {
        if (!req.headers.authorization){
            console.log("QQQQQQQQQQQ");
                throw new Error(errors.errorTypes.UNAUTHORIZED);
        }
            console.log("token in middleware", token);
            const decoded = await jwt.verify(token, config.SECRET_KEY);
            console.log("TEST");
            if (decoded.err){
                console.log("UWHIUEFBHOWEBHFOEBOG");
                throw new Error(errors.errorTypes.UNAUTHORIZED);
            }
            console.log("TEST");
            next();
        } catch (err) {
        console.log("ERROR IN MIDDLEWARE", err);   
        res.status(403).send();    
    }
}

app.use('/api', mdw, express_graphql( req =>( {
    schema: schemas.registerSchema,
    rootValue: root,
    context: {
        token: req.cookies['sessionid']
    },
    graphiql: true,    
    formatError: (err) => {
        //console.log(err);
        return ({ message: err.message, statusCode: 403})
    }
})));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


route.setRoutes(app);