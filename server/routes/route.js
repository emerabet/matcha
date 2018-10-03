const db = require('../db/login');
var jwt = require('jsonwebtoken');
const upload = require('../db/upload_picture');
const multer = require('multer');
const config = require('../config');
var fs = require('fs');
var uniqid = require('uniqid');
var axios = require('axios');
const queriesPicture = require('../graphql/resolvers/picture');

const storage = multer.diskStorage({
    destination: './public/pictures',
    filename(req, file, cb) {
        console.log("BODY", req.body);
        jwt.verify(req.body.token, config.SECRET_KEY, (err, decoded) => {
            if (!fs.existsSync(`${appRoot}/public/pictures/${decoded.user_id}/`)){
                fs.mkdirSync(`${appRoot}/public/pictures/${decoded.user_id}/`);
            }
            let type = file.mimetype;
            let i = type.lastIndexOf('/') + 1;
            if (i !== -1)
                type = type.substr(i);
            const file_name = `${uniqid()}.${type}`;
            cb(null, `/${decoded.user_id}/${file_name}`);
            const url = `${appRoot}/public/pictures/${decoded.user_id}/${file_name}`;
            console.log("body token", req.body.token);
            const src = `/pictures/${decoded.user_id}/${file_name}`;
            queriesPicture.addPicture({token: req.body.token, picture_id: req.body.picture_id, url: src, type: req.body.type});

       /* if (!result.data.errors)
            toast("Profile updated successfully", {type: toast.TYPE.SUCCESS});
        else
            toast("Error updating your profile information, please check that the password you put is correct !", {type: toast.TYPE.ERROR});
    */
        });
      
    },
  });
  
  const up = multer({ storage });

exports.setRoutes = (app) => {

    app.get('/', (req, res) => res.send('Hello World!'));

    app.post('/connect', db.login);
    app.post('/upload_picture', up.single('file'), upload.upload);
}