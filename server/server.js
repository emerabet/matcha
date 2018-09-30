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
const errors = require('./graphql/errors');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const root = {
    ...resolversUser,
    ...resolverTags
}

app.use('/api', express_graphql({
    schema: schemas.registerSchema,
    rootValue: root,
    graphiql: true,
    formatError: (err) => {
        console.log(err);
        return ({ message: err.message, statusCode: errors.errorCodes[err.message].statusCode})
    }
}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


route.setRoutes(app);