const db = require('../db/login');
var jwt = require('jsonwebtoken');
const upload = require('../db/upload_picture');
const multer = require('multer');
const config = require('../config');
var fs = require('fs');
var uniqid = require('uniqid');

const storage = multer.diskStorage({
    destination: './public/pictures',
    filename(req, file, cb) {
        console.log("req", req);
        console.log("file", file);
        console.log("cb", cb);
        jwt.verify(file.originalname, config.SECRET_KEY, (err, decoded) => {
            
            console.log("dir", appRoot);
            if (!fs.existsSync(`${appRoot}/public/pictures/${decoded.user_id}/`)){
                fs.mkdirSync(`${appRoot}/public/pictures/${decoded.user_id}/`);
            }
            let type = file.mimetype;
            let i = type.lastIndexOf('/') + 1;
            if (i !== -1)
                type = type.substr(i);
            console.log("TYPE", type);
            cb(null, `/${decoded.user_id}/${uniqid()}.${type}`);
        });
      
    },
  });
  
  const up = multer({ storage });

exports.setRoutes = (app) => {

    app.get('/', (req, res) => res.send('Hello World!'));

    app.post('/connect', db.login);
    app.post('/upload_picture', up.single('file'), upload.upload);
}