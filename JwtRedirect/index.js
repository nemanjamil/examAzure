const accessKey = process.env.accessKey;
const storageAccount = process.env.storageAccount;
const examtemplatecontainer = process.env.examtemplatecontainer;
const azureStorage = require('azure-storage');
const { sendMailUtils } = require('../utils/sendMailUtils')
const UtilsBlob = require('../utils/utilsBlob');
const { getSpecificDataFromDB } = require('../utils/database');
const { createExamNamePath, verifyToken, parseJsonArrayToKeyValue, responseErrorJson } = require('../utils/common');
const blobService = azureStorage.createBlobService(storageAccount, accessKey)
// const jwt = require('jsonwebtoken');
const secret_key = process.env.secret_key;
const { connectionToDB, closeMongoDbConnection } = require('../utils/database');
const Exam = require('../models/exam');
const path = require('path');
const examssk = process.env.EXAMSSK;


module.exports = async function (context, req) {

    let examUpdateResult = null;

    try {
        
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

        } else {
                // proverava da li postoji vec ovaj Exem na toj putanji, ako postoji link je vec bio jednom pokrenut i test ne sme a se nastavi      
                const testIfExamBlobAlreadyExist = await isExamInBlobExist(blobNameJsonPath, containerNameExam);

                // status Exam in DB
                // TODO nemanja
            
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

                    let fieldsDB = ['STATUS_EMAIL_HI', 'STATUS_EMAIL_SENTENCE', 'STATUS_EMAIL_TITLE','GEN_Sender_Email_Name']
                    const getDbDataForEmailTemplate = await getSpecificDataFromDB(fieldsDB);
                    let parseJsonArrayToKeyValueRes = await parseJsonArrayToKeyValue(getDbDataForEmailTemplate);
                    let rspsendMailUtils = await sendMailUtils(verifyTokenResponse, parseJsonArrayToKeyValueRes, fieldsDB);
                  
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

        await closeMongoDbConnection(); 

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
        console.log("error JWT REDIRECT", error);
        context.res = await responseErrorJson(error);
    }
};

async function tokenExist(reqquery) {
    if (reqquery.token) {
        return reqquery.token;
    } else {
        let messageBody = {
            message : "No token in request!",
            error:  "No token in request!",
            stateoferror: 130
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
                reject({ 
                    message : "doesBlobExist : "+blobNameJsonPath,
                    error:  err,
                    stateoferror: 134,
                    doesBlobExist: null
                });
            }
        });
    });
}

async function didExamBegin(blobNameJsonPath, containerNameExam) {

    try {
        const examJsonString = await UtilsBlob.getJsonExamBlob(blobNameJsonPath, containerNameExam);
        const examJson = JSON.parse(examJsonString);
        return examJson.Exam_Started;
    } catch (error) {
        return Promise.reject(error)
    }
}


function copyExamFileToContainerJson(containerName, blobName, data) {
    let opt = {
        contentSettings: {
            contentType: 'application/json',
        }
    }
    return new Promise((resolve, reject) => {

        blobService.createBlockBlobFromText(containerName, blobName, data, opt, error => {
            if (error) {
                reject({
                    message : "Copy exam fail = createBlockBlobFromText ",
                    error : error,
                    stateoferror: 135
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
            message : "Parse JSON error",
            error:  err,
            stateoferror: 133
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
                reject({
                    message : "getBlobToText get Exam",
                    error:  err,
                    stateoferror: 131 
                });
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
                examssk: examssk
            }, 
            { $set:{
                status:"Ready"
                }
            }, 
            {
                new: true
            });

       if (examUpdate) {
            examUpdate = examUpdate.toObject();
            delete examUpdate['_id'];
            delete examUpdate['examssk'];
            return examUpdate;
       } else {
            let messageBody = {
                message: "This exam does not exist in our DB "+examId,
                error: result,  
                stateoferror: 121,
            }
            return Promise.reject(messageBody)
       }

        
        
    } catch (error) {
        let messageBody = {
            message: "updateExam : "+examId,
            error: error,  
            stateoferror: 136,
        }
        return Promise.reject(messageBody)
    }
}