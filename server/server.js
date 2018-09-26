const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');




const route = require('./routes/route');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


route.setRoutes(app);
