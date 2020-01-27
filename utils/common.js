const jwt = require('jsonwebtoken');

const isArray = (array) => {
    if (Array.isArray(array) && array.length) {
        return true;
    } else {
        return false;
    }
}

const responseOkJson = async (response, addedElements) => {

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

const responseErrorJson = async (error,statusNumber = 400) => {
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

const verifyToken = async (token, secret_key) => {
    return jwt.verify(token, secret_key, function (err, decoded) {
        if (err) {
            return Promise.reject(err);
        } else {
            return Promise.resolve(decoded);
        }
    });
}

const getExamIdFromToken = async (token, secret_key) => {
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

const createExamNamePath = (verifyTokenResponse) => {
    let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_score.json";

    return verifyTokenResponse.Participant_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/" + blobNameJson;
}

const nameVariables = {
    basicsk : "tems"
}

const parseJsonArrayToKeyValue = async (data) => {
     let newObj = []
    data.forEach((el, i) => {
        newObj[el.name] = JSON.parse(el.value)
    })
    return newObj;
}

module.exports = {
    isArray,
    SENTENCES,
    verifyToken,
    responseOkJson,
    responseErrorJson,
    getExamIdFromToken,
    createExamNamePath,
    nameVariables,
    parseJsonArrayToKeyValue
}