const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');
const express_graphql = require('express-graphql');
const schemas = require('./graphql/schemas');
const route = require('./routes/route');
const resolversUser = require('./graphql/resolvers/user');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const root = {
    ...resolversUser
}

app.use('/api', express_graphql({
    schema: schemas.registerSchema,
    rootValue: root,
    graphiql: true
}));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


route.setRoutes(app);