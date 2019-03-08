const jwt = require('jsonwebtoken');

const isArray = (array) => {
    if (Array.isArray(array)  && array.length) {
        return true;
    } else {
        return false;
    }
}

const SENTENCES = {
    questionsAnswered : "All questions are answered"
}

const verifyToken = (token, secret_key) => {
    return jwt.verify(token, secret_key, function (err, decoded) {
        if (err) {
            return Promise.reject(err);
        } else {
            return Promise.resolve(decoded);
        }
    });
}

module.exports = {
    isArray,
    SENTENCES,
    verifyToken
}