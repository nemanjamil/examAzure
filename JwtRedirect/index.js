const accessKey = process.env.accessKey;
const storageAccount = process.env.storageAccount;
const examtemplatecontainer = process.env.examtemplatecontainer;
const azureStorage = require('azure-storage');
const UtilsBlob = require('../utils/utilsBlob');
const { createExamNamePath, verifyToken } = require('../utils/common');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)
// const jwt = require('jsonwebtoken');
const secret_key = process.env.secret_key;
const { connectionToDB } = require('../utils/database');
const Exam = require('../models/exam');
const path = require('path');


module.exports = async function (context, req) {

    let examUpdateResult = null;

    try {
        console.log("jwtRedirect");
        let tokenExistResponse = await tokenExist(req.query);

        // dekoduje token 
        let verifyTokenResponse = await verifyToken(tokenExistResponse, secret_key);

        // iz token informacija nalazi Exam koji vraca u tekstualnom obliku sa pridodatim informacijama
        // i vraca putanju gde bi za polaganje ovog User-a taj exem trebao da se iskopira
        const { examData, blobNameJsonPath } = await fetchExamVersion(verifyTokenResponse, examtemplatecontainer);

        const containerNameExam = process.env.examsuser;
        let redirect = null;
        let data = null;
        let copyExamVersionResponse = "";

        // test if exam token duration expired
        const now = Math.round(Date.now()/1000);
        let hasTokenExpire = now > (examData.ExamEvent_GenerationTime + examData.tokenvalidfor);

        if(hasTokenExpire){

            redirect = verifyTokenResponse.fe_endpoint + '/error?status=expired';

        }else{
                // proverava da li postoji vec ovaj Exem na toj putanji, ako postoji link je vec bio jednom pokrenut i test ne sme a se nastavi      
                const testIfExamBlobAlreadyExist = await isExamInBlobExist(blobNameJsonPath, containerNameExam);

                // if exam blob exist but exam didn't started
                let didExamStartedBefore = null;
                if (testIfExamBlobAlreadyExist.doesBlobExist && testIfExamBlobAlreadyExist.doesBlobExist !== null) {
                    didExamStartedBefore = await didExamBegin(blobNameJsonPath, containerNameExam);
                }

                // ako exam blob ne postoji
                if (!testIfExamBlobAlreadyExist.doesBlobExist && testIfExamBlobAlreadyExist.doesBlobExist !== null) {
                    // kopira exam u storage blob i dobija odgovor u Promisu "Fall" ili "Json upload successfully"
                    copyExamVersionResponse = await copyExamFileToContainerJson(containerNameExam, blobNameJsonPath, JSON.stringify(examData));

                //  let blobNameJson = createExamNamePath(verifyTokenResponse);
                const examId = path.basename(blobNameJsonPath, '_score.json');
                examUpdateResult = await updateExam(examId);

                console.log("zavrsio update");

                    redirect = verifyTokenResponse.fe_endpoint +
                        '?token=' + req.query.token +
                        "&status=" + copyExamVersionResponse.message

                // if exam blob exist but Json exam started value is false
                // exam can start but it not necessary saveExamInDB and copyExamFileToContainer
                } else if (!didExamStartedBefore && didExamStartedBefore !== null) {

                    redirect = verifyTokenResponse.fe_endpoint +
                        '?token=' + req.query.token +
                        "&status=" + copyExamVersionResponse.message

                } else {
                    copyExamVersionResponse = testIfExamBlobAlreadyExist;

                    if(verifyTokenResponse.fe_endpoint.endsWith("/")){
                        redirect = verifyTokenResponse.fe_endpoint + 'finish?status=used';
                    }else{
                        redirect = verifyTokenResponse.fe_endpoint + '/finish?status=used';
                    }
                }

                console.log("----------+-----------");

                data = {
                    copyExamVersionResponse: copyExamVersionResponse,
                    examUpdateResult: examUpdateResult
                }

        }

        context.res = {
            status: 302,
            body: data,
            headers: {
                'Location': redirect,
                'BlobExist': copyExamVersionResponse.doesBlobExist
            },
        };

        context.done();

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


async function fetchExamVersion(verifyTokenResponse, containerName) {
    try {
        // dobija Exam iz fajla u JSON obliku
        let getJsonExamResolve = await getJsonExam(verifyTokenResponse.ExamVersion_EXTERNAL_ID, containerName);

        // pretvara Exam JSON u text format
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
        clone.tokenvalidfor = verifyTokenResponse.tokenvalidfor;

        // let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        //     verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        //     verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_score.json";

        // let blobNameJsonPath = verifyTokenResponse.Participant_EXTERNAL_ID + "/" +
        //     verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" +
        //     verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/" + blobNameJson;

        let blobNameJsonPath = createExamNamePath(verifyTokenResponse);

        return { examData: clone, blobNameJsonPath: blobNameJsonPath };

    } catch (error) {
        return Promise.reject(error)
    }
}

async function isExamInBlobExist(blobNameJsonPath, containerNameExam) {

    return new Promise((resolve, reject) => {
        blobService.doesBlobExist(containerNameExam, blobNameJsonPath, function (error, result) {
            if (!error) {
                if (result.exists) {
                    console.log('Blob exists...');
                    resolve({ doesBlobExist: true, message: 'Blob exists...' });
                } else {
                    console.log('Blob does not exist...');
                    resolve({ doesBlobExist: false, message: 'Blob does not exist...' })
                }
            } else {
                console.log('Testing if blob exist error...');
                reject({ doesBlobExist: null, message: 'Something went wrong' });
            }
        });
    });
}

async function didExamBegin(blobNameJsonPath, containerNameExam) {
    const examJsonString = await UtilsBlob.getJsonExamBlob(blobNameJsonPath, containerNameExam);
    const examJson = JSON.parse(examJsonString);

    return examJson.Exam_Started;
}


function copyExamFileToContainerJson(containerName, blobName, data) {
    let opt = {
        contentSettings: {
            contentType: 'application/json',
        }
    }
    return new Promise((resolve, reject) => {

        blobService.createBlockBlobFromText(containerName, blobName, data, opt, err => {
            if (err) {
                reject({
                    message: "Fail copiing exam in blob"
                });
            } else {
                resolve({
                    message: "Exam copied in Blob"
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

// dobija Exam iz fajla JSON obliku
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
}


const updateExam = async (examId) => {

    try {
        await connectionToDB();
        let examUpdate = await Exam.findOneAndUpdate(
            {
                examId: examId, 
                examssk: examId
            }, 
            { $set:{
                status:"Start"
                }
            }, 
            {
                new: true
            });
       
        examUpdate = examUpdate.toObject();
        delete examUpdate['_id'];
        delete examUpdate['examssk'];

        return examUpdate;
        
    } catch (error) {
        console.log(error);
        let messageBody = {
            message: "Error updating exam"
        }
        return Promise.reject(messageBody)
    }
}