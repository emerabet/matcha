const queriesPicture = require('../graphql/resolvers/picture');

exports.upload = async (req, res) => {
    console.log("QUERIES", req.body);
    console.log("file", req.file);
    const result = {
        pictures: await queriesPicture.getPicture({token: req.headers.authorization}),
        insertId: req.body.insertId
    }
    res.status(200).send(result);
}