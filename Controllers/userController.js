const userModel = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const validate = require('validator');
const validator = require('../Validator/validator');





const registerUser = async function (req, res) {
    try {
        const data = req.body;

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty" });
        }

        const registeredUser = await userModel.findOne({ email: data.email, mobile: data.mobile });
        if (registeredUser) {
            return res.status(400).send({ status: false, message: "User already registered, please login with email and password!" })

        }

        if (!data.fname) {
            return res.status(400).send({ status: false, message: "first name can't be empty" })
        }

        if (!validator.valid(data.fname)) {
            return res.status(400).send({ status: false, message: "Use alphabets only" })
        }

        if (!data.lname) {
            return res.status(400).send({ status: false, message: "last name can't be empty" })
        }
        if (!validator.valid(data.lname)) {
            return res.status(400).send({ status: false, message: "Use alphabets only" })
        }


        if (!data.mobile) {
            return res.status(400).send({ status: false, message: "Mobile can't be empty" })
        }


        const validPhone = validator.isValidNumber(data.mobile);

        if (!validPhone) {
            return res.status(400).send({ status: false, message: "Invalid Mobile number." })

        }


        const checkMobile = await userModel.findOne({ mobile: data.mobile });
        if (checkMobile) {
            return res.status(400).send({ status: false, message: "Mobile number already exists." })
        }

        if (!data.email) {
            return res.status(400).send({ status: false, message: "Email can't be empty" })
        }

        const emailValidate = validator.isValidEmail(data.email);

        if (!emailValidate) {
            return res.status(400).send({ status: false, message: "Invalid Email" })

        }

        const checkEmail = await userModel.findOne({ email: data.email });
        if (checkEmail) {
            return res.status(400).send({ status: false, message: "Email already exists." })
        }
        if (!data.password) {
            return res.status(400).send({ status: false, message: "Password can't be empty" })
        }
        const validPassword = validator.isValidPassword(data.password);
        if (!validPassword) {
            return res.status(400).send({ status: false, message: "Password should be between 8 - 15 characters." })

        }


        const user = await userModel.create(data);

        return res.status(200).send({ status: true, message: "User created sucessfully", data: user })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const loginUser = async function (req, res) {
    try {
        const data = req.body;

        if (Object.keys(data).length === 0) {
            return res.status(400).send({ status: false, message: "Body can't be empty" })
        }

        if (!data.email) {
            return res.status(400).send({ status: false, message: "Email can't be empty" })
        }
        if (!data.password) {
            return res.status(400).send({ status: false, message: "Password can't be empty" })
        }

        const checkUser = await userModel.findOne({ email: data.email, password: data.password }).select({ _id: 1 });
        console.log(checkUser);

        if (!checkUser) {
            return res.status(400).send({ status: false, message: "Email or password is not correct." })
        }


        let token = jwt.sign({
            userId: checkUser._id
        }, "secret_key");

        return res.status(200).send({ status: true, message: "User logged-in sucessfully", data: { _id: checkUser._id.toString(), token: token } })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;