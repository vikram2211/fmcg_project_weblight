const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');
const validator = require('../Validator/validator');


const authentication = async function (req, res, next) {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            token = req.headers.authorization.split(' ')[1]
            //console.log(token)
        }

        if (!token) {
            return res.status(400).send({ status: false, message: "token is missing." })
        }

        jwt.verify(token, "secret_key", function (err, decoded) {
            if (err) {
                return res.status(401).send({ status: false, message: "token invalid" })
            }
            req.userId = decoded.userId
            next();

        })
    } catch (error) {
        return res.status(500).send({ status: false, message: err.message })

    }
}

const authorization = async function (req, res, next) {
    try {

        let tokenUserId = req.userId
        //console.log(tokenUserId);
        let userId = req.params.userId

        //check the  user id are present in decoded token
        let User = await userModel.findOne({ _id: userId })
        if (!User) return res.status(404).send({ status: false, msg: "User not exist" })
        if (userId != tokenUserId) { return res.status(403).send({ status: false, msg: "Not Authorised!!" }) }

        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

module.exports.authentication = authentication;
module.exports.authorization = authorization;