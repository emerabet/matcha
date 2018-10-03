const queriesPicture = require('../graphql/resolvers/picture');

exports.upload = async (req, res) => {
    console.log(req.body);
    console.log("file", req.file);
    res.status(200).send({ pictures: await queriesPicture.getPicture({token: req.body.token})});
}