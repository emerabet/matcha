const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const mySocket = require('./socket');
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

//app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cors({credentials: true, origin: 'https://10.18.201.85:3000'}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

const root = {
    ...resolversUser,
    ...resolverTags,
    ...resolverPicture,
    ...resolverChat
}

const mdw = async (req, res, next) => {
   // console.log("IN MIDDLEWARE", req.headers);
   // console.log('Cookies: ', req.cookies)
    const token = req.cookies['sessionid'];
    // Cookies that have been signed
   // console.log('Signed Cookies: ', req.signedCookies)
    try {
     //   console.log("BODY", req.body.query);
        if (req.body.query.replace(/\s/g, '') === "querygetLogin($login:String!){getLogin(login:$login)}"
            || req.body.query.replace(/\s/g, '') === "querygetEmail($email:String!){getEmail(email:$email)}"
            || req.body.query.replace(/\s/g, '') === "mutationaddUser($user:AddUserInput!,$address:AddAddressInput!){addUser(user:$user,address:$address)}"
            || req.body.query.replace(/\s/g, '') === "mutationconfirmAccount($registration_token:String!){confirmAccount(registration_token:$registration_token)}"
            || req.body.query.replace(/\s/g, '') === "mutationresetPassword($login:String!){resetPassword(login:$login)}"
            || req.body.query.replace(/\s/g, '') === "mutationcheckResetToken($reset_token:String!,$password:String!){checkResetToken(reset_token:$reset_token,password:$password)}") {
            console.log("OK", req.body.query.replace(/\s/g, ''));
            next();
        } else {
            if (!token || token === undefined){
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
                console.log ("CSRF TOKEN", req.headers.authorization, decoded.csrf_token);
                if (req.headers.authorization !== decoded.csrf_token) {
                    console.log("WRONG CSRF TOKEN");
                    throw new Error(errors.errorTypes.UNAUTHORIZED);
                }
                next();
            }
        } catch (err) {
        console.log("ERROR IN MIDDLEWARE");   
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

var options = {
    key: fs.readFileSync( './server.key' ),
    cert: fs.readFileSync( './server.crt' ),
    requestCert: false,
    rejectUnauthorized: false
};

const https = require('https');


const ser = https.createServer(options, app);

const io = require('socket.io')(ser);
ser.listen(port, () => console.log("server runi"))
/*
const mySocketMiddleware = mySocket();
*/const connectedUsers = new Map();

console.log('ici');
io.on('connection', (socket) => mySocket(io, socket, connectedUsers));
//io.listen(5000);
//app.listen(port, () => console.log(`Example app listening on port ${port}!`));

route.setRoutes(app);