const mongoose = require('mongoose');



let valid = function (value) {
    if (typeof value == "undefined" || typeof value == null || typeof value === "number" || value.trim().length == 0) {
        return false
    }
    if (typeof value == "string") {
        return true
    }
    return true
}

const isValidObjectId = function (value) {
    return mongoose.Types.ObjectId.isValid(value);
};

const isValidEmail = function (value) {

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        return false
    }
    return true
};

const isValidNumber = function (value) {

    if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(value))) {

        return false
    }
    return true
};

const isValidPassword = (value) => {
    if (typeof value === "undefined" || value === null) return false
    const re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/
    return re.test(value)
}

module.exports.valid = valid;
module.exports.isValidObjectId = isValidObjectId;
module.exports.isValidEmail = isValidEmail;
module.exports.isValidNumber = isValidNumber;
module.exports.isValidPassword = isValidPassword;
