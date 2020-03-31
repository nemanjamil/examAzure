const jwt = require('jsonwebtoken');

const isArray = (array) => {
    if (Array.isArray(array) && array.length) {
        return true;
    } else {
        return false;
    }
}

const validateIfStringExist = async (string) => {

    return new Promise((resolve, reject) => {
        if (string) {
            resolve(string)
        } else {
            reject({
                message : "String does not exist : "+ string,
                error : "String does not exist : "+ string,
                stateoferror: 33
            })
        }
    })

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
    somethingWentWrong: "Something went wrong",
    inProgress: "In Progress",
    abortedByUser: "Aborted by user"
}

const verifyToken = async (token, secret_key) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret_key, function (error, decoded) {
            if (error) {
                reject({
                    message : "VerifyToken Get Exam from Token can't be resolved : ",
                    error : error,
                    stateoferror: 32
                })
            } else {
                resolve(decoded)
            }
        })
    })
}

const getExamIdFromToken = async (token, secret_key) => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, secret_key, function (error, decoded) {
            if (error) {
                reject({
                    message : "Get Exam from Token can't be resolved",
                    error : error,
                    stateoferror: 31
                });
            } else {
                examId = decoded.Participant_EXTERNAL_ID + "_" +
                decoded.ExamVersion_EXTERNAL_ID + "_" +
                decoded.ExamEvent_EXTERNAL_ID;
                resolve(examId);
            }
         });
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

const createSaltExamPath = (verifyTokenResponse) => {
    let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + ".salt";

    return verifyTokenResponse.Participant_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/salt/" + blobNameJson;
}

const nameVariables = {
    basicssk : "tems"
}

const parseJsonArrayToKeyValue = async (data) => {
    let newObj = []
    data.forEach((el, i) => {
        newObj[el.name] = JSON.parse(el.value)
    })
    return newObj;
}

const checkIfValuesForKeyExistInObject = async (dataObject) => {
        
       let arrayFromObject = Object.keys(dataObject)

       const ixValueExist = (currentValue) => {
            if (dataObject[currentValue]) {
                return true;
            } else {
                return false;
            }
        }
    return new Promise((resolve, reject) => {

        let checkObjectState = arrayFromObject.every(ixValueExist);
         if (checkObjectState) {
            resolve("All values in object exist")
        } else {
            reject({
                message : "Some values in object does not exist",
                error : dataObject,
                stateoferror: 34
            });
        }
    })

}

module.exports = {
    isArray,
    SENTENCES,
    verifyToken,
    responseOkJson,
    responseErrorJson,
    getExamIdFromToken,
    createExamNamePath,
    createSaltExamPath,
    nameVariables,
    parseJsonArrayToKeyValue,
    validateIfStringExist,
    checkIfValuesForKeyExistInObject
}