<<<<<<< HEAD
const accessKey = process.env.accessKey;
const storageAccount = process.env.storageAccount;
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)
const jwt = require('jsonwebtoken');
const secret_key = process.env.secret_key;
module.exports = async function (context, req) {

    //let secret_key = 'bmp_space_165423106546545';
    let container = "examstemplate";

    try {
        let tokenExistResponse = await tokenExist(req.query);
        let verifyTokenResponse = await verifyToken(tokenExistResponse, secret_key);
        let copyExamVersionResponse = await copyExamVersion(verifyTokenResponse, container);
        let redirect = verifyTokenResponse.fe_endpoint+
                       '?token='+req.query.token+
                       "&status="+copyExamVersionResponse.message
        context.res = {
            status: 302,
            body: copyExamVersionResponse,
            headers: {
                'Location': redirect
            },
        };
    } catch (error) {
        console.log("error", error);
        context.res = {
            status: 400,
            body: error,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

async function tokenExist(reqquery) {
    if (reqquery.token) {
        return reqquery.token;
    } else {
        let messageBody = {
            message: "No token in request!"
        }
        return Promise.reject(messageBody)
    }
}

async function verifyToken(token, secret_key) {
    return jwt.verify(token, secret_key, function (err, decoded) {
        if (err) {
            return Promise.reject(err);
        } else {
            return Promise.resolve(decoded);
        }
    });
}


async function copyExamVersion(verifyTokenResponse, containerName) {
    try {
        let getJsonExamResolve = await getJsonExam(verifyTokenResponse.ExamVersion_EXTERNAL_ID, containerName);
        let parseJsonResponse = await parseJson(getJsonExamResolve);

        let clone = Object.assign({}, parseJsonResponse);
        clone.Participant_Firstname = verifyTokenResponse.Participant_Firstname;
        clone.Participant_Lastname = verifyTokenResponse.Participant_Lastname;
        clone.Participant_EXTERNAL_ID = verifyTokenResponse.Participant_EXTERNAL_ID;
        clone.BulkEvent_EXTERNAL_ID = verifyTokenResponse.BulkEvent_EXTERNAL_ID;
        clone.ExamVersion_plannedDuration = verifyTokenResponse.ExamVersion_plannedDuration;
        clone.ExamEvent_GenerationTime = verifyTokenResponse.ExamEvent_GenerationTime;
        clone.ExamEvent_ReadyTime = Math.floor(new Date() / 1000);
        clone.ExamEvent_EXTERNAL_ID = verifyTokenResponse.ExamEvent_EXTERNAL_ID;

        let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" + 
                           verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" + 
                           verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_score.json";
        let containerNameExam = "exams";
        let blobNameJsonPath = verifyTokenResponse.Participant_EXTERNAL_ID + "/" + 
                               verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" + 
                               verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/" + blobNameJson;
        var dataResponse = await putFileToContainerJson(containerNameExam, blobNameJsonPath, JSON.stringify(clone))

        return dataResponse;
    } catch (error) {
        return Promise.reject(error)
    }

}

function putFileToContainerJson(containerName, blobName, data) {
    let opt = {
        contentSettings: {
            contentType: 'application/json',
        }
    }
    return new Promise((resolve, reject) => {

        blobService.createBlockBlobFromText(containerName, blobName, data, opt, err => {
            if (err) {
                reject({
                    message: "Fail"
                });
            } else {
                resolve({
                    message: "Json upload successfully"
                });
            }
        });
    });
}

function parseJson(getJsonExamResolve) {
    try {
        return JSON.parse(getJsonExamResolve)
    } catch (err) {
        let messageBody = {
            message: err.message
        }
        return Promise.reject(messageBody)
    }
}

async function getJsonExam(ExamVersion_EXTERNAL_ID, containerName) {
    // blobService.doesBlobExist
    return new Promise((resolve, reject) => {
        blobService.getBlobToText(containerName, ExamVersion_EXTERNAL_ID + '.json', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
=======
const accessKey = process.env.accessKey;
const storageAccount = process.env.storageAccount;
const azureStorage = require('azure-storage');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)
const jwt = require('jsonwebtoken');
const secret_key = process.env.secret_key;
module.exports = async function (context, req) {

    //let secret_key = 'bmp_space_165423106546545';
    let container = "examstemplate";

    try {
        let tokenExistResponse = await tokenExist(req.query);
        let verifyTokenResponse = await verifyToken(tokenExistResponse, secret_key);
        let copyExamVersionResponse = await copyExamVersion(verifyTokenResponse, container);
        let redirect = verifyTokenResponse.fe_endpoint+
                       '?token='+req.query.token+
                       "&status="+copyExamVersionResponse.message
        context.res = {
            status: 302,
            body: copyExamVersionResponse,
            headers: {
                'Location': redirect
            },
        };
    } catch (error) {
        console.log("error", error);
        context.res = {
            status: 400,
            body: error,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};

async function tokenExist(reqquery) {
    if (reqquery.token) {
        return reqquery.token;
    } else {
        let messageBody = {
            message: "No token in request!"
        }
        return Promise.reject(messageBody)
    }
}

async function verifyToken(token, secret_key) {
    return jwt.verify(token, secret_key, function (err, decoded) {
        if (err) {
            return Promise.reject(err);
        } else {
            return Promise.resolve(decoded);
        }
    });
}


async function copyExamVersion(verifyTokenResponse, containerName) {
    try {
        let getJsonExamResolve = await getJsonExam(verifyTokenResponse.ExamVersion_EXTERNAL_ID, containerName);
        let parseJsonResponse = await parseJson(getJsonExamResolve);

        let clone = Object.assign({}, parseJsonResponse);
        clone.Participant_Firstname = verifyTokenResponse.Participant_Firstname;
        clone.Participant_Lastname = verifyTokenResponse.Participant_Lastname;
        clone.Participant_EXTERNAL_ID = verifyTokenResponse.Participant_EXTERNAL_ID;
        clone.BulkEvent_EXTERNAL_ID = verifyTokenResponse.BulkEvent_EXTERNAL_ID;
        clone.ExamVersion_plannedDuration = verifyTokenResponse.ExamVersion_plannedDuration;
        clone.ExamEvent_GenerationTime = verifyTokenResponse.ExamEvent_GenerationTime;
        clone.ExamEvent_ReadyTime = Math.floor(new Date() / 1000);
        clone.ExamEvent_EXTERNAL_ID = verifyTokenResponse.ExamEvent_EXTERNAL_ID;

        let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" + 
                           verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" + 
                           verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_score.json";
        let containerNameExam = "exams";
        let blobNameJsonPath = verifyTokenResponse.Participant_EXTERNAL_ID + "/" + 
                               verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" + 
                               verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/" + blobNameJson;
        var dataResponse = await putFileToContainerJson(containerNameExam, blobNameJsonPath, JSON.stringify(clone))

        return dataResponse;
    } catch (error) {
        return Promise.reject(error)
    }

}

function putFileToContainerJson(containerName, blobName, data) {
    let opt = {
        contentSettings: {
            contentType: 'application/json',
        }
    }
    return new Promise((resolve, reject) => {

        blobService.createBlockBlobFromText(containerName, blobName, data, opt, err => {
            if (err) {
                reject({
                    message: "Fail"
                });
            } else {
                resolve({
                    message: "Json upload successfully"
                });
            }
        });
    });
}

function parseJson(getJsonExamResolve) {
    try {
        return JSON.parse(getJsonExamResolve)
    } catch (err) {
        let messageBody = {
            message: err.message
        }
        return Promise.reject(messageBody)
    }
}

async function getJsonExam(ExamVersion_EXTERNAL_ID, containerName) {
    // blobService.doesBlobExist
    return new Promise((resolve, reject) => {
        blobService.getBlobToText(containerName, ExamVersion_EXTERNAL_ID + '.json', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
>>>>>>> e67b7ca70cc1c842c725fe60baf866e6a419db9c
}