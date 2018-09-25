const db = require('../db/login');

exports.setRoutes = (app) => {

    app.get('/', (req, res) => res.send('Hello World!'));

    app.post('/connect', db.login);

    app.get('/check', (req, res) => {
        console.log("check get");

        res.status(200).send();
    });
}