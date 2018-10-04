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
    async filename(req, file, cb) {
        console.log("BODY", req.body);
        await jwt.verify(req.body.token, config.SECRET_KEY, async (err, decoded) => {
            if (await !fs.existsSync(`${appRoot}/public/pictures/${decoded.user_id}/`)){
                await fs.mkdirSync(`${appRoot}/public/pictures/${decoded.user_id}/`);
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
            const r = await queriesPicture.addPicture({token: req.body.token, picture_id: req.body.picture_id, url: src, type: req.body.type, delete_url: req.body.src});
            console.log("ADDPICTURE", r.insertId);
            req.body.insertId = r.insertId;
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

    app.post('/check', db.checkToken);
    app.post('/connect', db.login);
    app.post('/upload_picture', up.single('file'), upload.upload);
}