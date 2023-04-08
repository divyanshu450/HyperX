const jwt = require("jsonwebtoken");
const config = process.env;

function verifyToken(req, res, next) {
    try {
        //console.log(req);
        const token = req.body.token || req.query.token || req.headers["x-access-token"]
        // console.log(token);
        if (!token) {
            return res.send({ status: 403, message: "No token provided", data: null, err: null });
        }
        const decode = jwt.verify(token, config.TOKEN_KEY);
        req.user = decode;
        console.log(req.user);

    } catch (error) {
        console.log('err', error);
        return res.send({ status: 500, message: "Please Login Again", data: null, err: error });
    }


    return next();
}

module.exports = verifyToken;