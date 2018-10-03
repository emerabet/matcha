exports.upload = async (req, res) => {
    console.log(req.body);
    console.log("file", req.file);
    res.status(200).send({ message: "uploaded"});
}