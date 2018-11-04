const db = require('../db/login');
var jwt = require('jsonwebtoken');
const upload = require('../db/upload_picture');
const multer = require('multer');
const config = require('../config');
var fs = require('fs');
var uniqid = require('uniqid');

const storage = multer.diskStorage({
    destination: './build/pictures',
    fileFilter: (req, file, cb) => {
        const picture_types = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
        let type = file.mimetype;
            let i = type.lastIndexOf('/') + 1;
            if (i !== -1)
                type = type.substr(i);
        if (picture_types.includes(type)) {
          return cb(null, true);
        } else {
        return cb(null, false);}
    },
    async filename(req, file, cb) {
        try {
        const token = req.cookies['sessionid'];
        await jwt.verify(token, config.SECRET_KEY, async (err, decoded) => {
            if (await !fs.existsSync(`${appRoot}/build/pictures/${decoded.user_id}/`)){
                await fs.mkdirSync(`${appRoot}/build/pictures/${decoded.user_id}/`);
            }
            if (await !fs.existsSync(`${appRoot}/build/pictures/tmp/`)){
                await fs.mkdirSync(`${appRoot}/build/pictures/tmp/`);
            }
            let type = file.mimetype;
            let i = type.lastIndexOf('/') + 1;
            if (i !== -1)
                type = type.substr(i);
                const file_name = `${uniqid()}.${type}`;
                req.body.src = `/tmp/${file_name}`;
                req.body.file_name = file_name;
                req.body.user_id = decoded.user_id;
                req.body.token = token;
                cb(null, `/tmp/${file_name}`);
        });
    } catch (err) { console.log("not uploaded")}
    },
});
  
const up = multer({ storage });

exports.setRoutes = (app) => {

    app.get('/', (req, res) => res.send('Hello World!'));

    app.get('/check', db.checkToken);
    app.post('/connect', db.login);
    app.post('/logout', db.logout);
    app.post('/locate', db.locate);
    app.post('/upload_picture', up.single('file'), upload.upload);
}