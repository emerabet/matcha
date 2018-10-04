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
const errors = require('./graphql/errors');
const path = require('path');
let rootDir = __dirname; 
let i = rootDir.lastIndexOf('/');
if (i !== -1)
    rootDir = rootDir.substr(0, i);
global.appRoot = path.resolve(rootDir);

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const root = {
    ...resolversUser,
    ...resolverTags,
    ...resolverPicture
}

app.use('/api', express_graphql({
    schema: schemas.registerSchema,
    rootValue: root,
    graphiql: true,
    formatError: (err) => {
        //console.log(err);
        return ({ message: err.message, statusCode: 403/*errors.errorCodes[err.message].statusCode*/})
    }
}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


route.setRoutes(app);