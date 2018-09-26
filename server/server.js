const express = require('express');
const app = express();
const port = 4000;
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');




const route = require('./routes/route');

const token = jwt.sign({ foo: 'bar' }, 'shhhhh');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({type: 'application/*+json'}));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));


route.setRoutes(app);
