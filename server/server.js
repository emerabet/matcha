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

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
//app.use(cors({credentials: true, origin: 'https://localhost:3000'}));
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
    const token = req.cookies['sessionid'];
    try {
        if (req.body.query.replace(/\s/g, '') === "querygetLogin($login:String!){getLogin(login:$login)}"
            || req.body.query.replace(/\s/g, '') === "querygetEmail($email:String!){getEmail(email:$email)}"
            || req.body.query.replace(/\s/g, '') === "mutationaddUser($user:AddUserInput!,$address:AddAddressInput!){addUser(user:$user,address:$address)}"
            || req.body.query.replace(/\s/g, '') === "mutationconfirmAccount($registration_token:String!){confirmAccount(registration_token:$registration_token)}"
            || req.body.query.replace(/\s/g, '') === "mutationresetPassword($login:String!){resetPassword(login:$login)}"
            || req.body.query.replace(/\s/g, '') === "mutationcheckResetToken($reset_token:String!,$password:String!){checkResetToken(reset_token:$reset_token,password:$password)}") {
            next();
        } else {
            if (!token || token === undefined){
                    throw new Error(errors.errorTypes.UNAUTHORIZED);
            }
                const decoded = await jwt.verify(token, config.SECRET_KEY);
                if (decoded.err){
                    throw new Error(errors.errorTypes.UNAUTHORIZED);
                }
                if (req.headers.authorization !== decoded.csrf_token) {
                    throw new Error(errors.errorTypes.UNAUTHORIZED);
                }
                next();
            }
        } catch (err) {
            res.status(403).send();
    }
}

app.use('/api', mdw, express_graphql( req =>( {
    schema: schemas.registerSchema,
    rootValue: root,
    context: {
        token: req.cookies['sessionid'],
        hostname: req.hostname
    },
    graphiql: true,    
    formatError: (err) => {
        return ({ message: err.message, statusCode: 403})
    }
})));

var options = {
    key: fs.readFileSync( './server.key' ),
    cert: fs.readFileSync( './server.crt' ),
    requestCert: false,
    rejectUnauthorized: false
};

/***********HTTPS*********************/

const https = require('https');
const ser = https.createServer(options, app);
const io = require('socket.io')(ser);
ser.listen(port, () => console.log("server running"))
io.on('connection', (socket) => mySocket(io, socket, connectedUsers));

/*const http = require('http').Server(app);
const io = require('socket.io')(http);
io.on('connection', (socket) => mySocket(io, socket, connectedUsers));
http.listen(port, () => console.log("Server started"))
*/
const connectedUsers = new Map();



//io.listen(5000); // HTTP (NO NEED THIS LINE FOR HTTPS WORKS ON 4000)
//app.listen(port, () => console.log(`Example app listening on port ${port}!`));

route.setRoutes(app);