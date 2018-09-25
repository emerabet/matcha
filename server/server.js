const express = require('express');
const app = express();
const port = 4000;

const jwt = require('jsonwebtoken');
const mysql = require('mysql');


const token = jwt.sign({ foo: 'bar' }, 'shhhhh');

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));