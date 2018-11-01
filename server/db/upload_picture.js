const queriesPicture = require('../graphql/resolvers/picture');
const fs = require('fs');
const sharp = require('sharp');

exports.upload = async (req, res) => {
    let insertId = -1;
    try {
        if (await fs.existsSync(`${appRoot}/build/pictures/${req.body.src}`)){
            await sharp(`build/pictures/tmp/${req.body.file_name}`)
            .resize(450, 450)
            .toFile(`build/pictures/${req.body.user_id}/${req.body.file_name}`);
            if ( await fs.existsSync(`${appRoot}/build/pictures/tmp/${req.body.file_name}`))
            {
                await fs.unlink(`${appRoot}/build/pictures/tmp/${req.body.file_name}`, (err) => {
                    if (err) {
                        throw err;
                    };
                });
            }
            const r = await queriesPicture.addPicture({token: req.body.token, picture_id: req.body.picture_id, url: `/pictures/${req.body.user_id}/${req.body.file_name}`, type: req.body.type, delete_url: req.body.src});
            insertId = r.insertId;
        }
    } catch (err) {
        res.status(400).send();
    }

    if (insertId !== -1) {
        const result = {
            pictures: await queriesPicture.getPicture({token: req.cookies['sessionid']}),
            insertId: req.body.insertId
        }
        res.status(200).send(result);
        return ;
    } else {
        res.status(400).send();
    }
}