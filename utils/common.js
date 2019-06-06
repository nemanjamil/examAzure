const jwt = require('jsonwebtoken');

const isArray = (array) => {
    if (Array.isArray(array) && array.length) {
        return true;
    } else {
        return false;
    }
}

const responseOkJson = (response, addedElements) => {

    return {
        status: 200,
        body: {
            message: response,
            status: true,
            addedElements
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

const responseErrorJson = (error,statusNumber = 400) => {
    return {
        status: statusNumber,
        body: {
            message: error,
            status: false
        },
        headers: {
            'Content-Type': 'application/json'
        }
    }
}


const SENTENCES = {
    questionsAnswered: "All questions are answered",
    somethingWentWrong: "Something went wrong"
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

const getExamIdFromToken = (token, secret_key) => {
    return jwt.verify(token, secret_key, function (err, decoded) {
        if (err) {
            return Promise.reject(err);
        } else {
            examId = decoded.Participant_EXTERNAL_ID + "_" +
            decoded.ExamVersion_EXTERNAL_ID + "_" +
            decoded.ExamEvent_EXTERNAL_ID;
            return Promise.resolve(examId);
        }
    });
}


module.exports = {
    isArray,
    SENTENCES,
    verifyToken,
    responseOkJson,
    responseErrorJson,
    getExamIdFromToken
}