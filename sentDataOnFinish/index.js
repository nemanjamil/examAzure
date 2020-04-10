const Utils = require('../utils/utilsBlob');
const Exam = require('../models/exam');
const { getSpecificDataFromDB, connectionToDB, handleMongoConnection } = require('../utils/database');
const { validateIfStringExist } = require('../utils/common');

const { sendMailUtilsStatus } = require('../utils/sendMailUtils')
const examsuser = process.env.examsuser;
const secret_key = process.env.secret_key;
const { verifyToken, responseOkJson, responseErrorJson, createExamNamePath, parseJsonArrayToKeyValue } = require('../utils/common');

// function isOdd(num) { return num % 2;}
// let rnd = Math.floor(Math.random() * 100);
//         if (isOdd(rnd)) {
//             context.res = await responseErrorJson({
//                 message: "Error sendDataOnFinish",
//                 error: "Error sendDataOnFinish",  
//                 stateoferror: 111,
//             });
//             return;
//         }

module.exports = async function (context, req) {

    const token = req.headers.authorization;
    let data = req.body;

    try {

        let verifyTokenResponse = await verifyToken(token, secret_key);
        let createNamePathRsp = await createExamResultBlobNamePath(verifyTokenResponse);
        let getJsonExamBlobResponse = await Utils.putFileToContainerJson(examsuser, createNamePathRsp, JSON.stringify(data));

        // save exam finished = true and finished time in exam JSON file
        let examJsonBlobPath = await createExamNamePath(verifyTokenResponse);
        let getJsonExamFromBlob = await Utils.getJsonExamBlob(examJsonBlobPath, examsuser);
        await updateBlobOnExamFinish(getJsonExamFromBlob, examJsonBlobPath);
       

        const examId = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
                       verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
                       verifyTokenResponse.ExamEvent_EXTERNAL_ID

         await connectionToDB("sentDataOnFinish");
         let updateExamResult = await updateExamInDB(examId);

        // send email to proctor
        let fieldsDB = ['STATUS_EMAIL_HI', 'GEN_Email_Status_Link_To_Gallery',
                    'GEN_Email_Status_For_Information','GEN_Email_Status_Finished_State',
                    'GEN_Email_Status_The_Exam', 'GEN_Sender_Email_Name',
                    'GEN_Email_Status_Finished']

        const getDbDataForEmailTemplate = await getSpecificDataFromDB(fieldsDB);

        let parseJsonArrayToKeyValueRes = await parseJsonArrayToKeyValue(getDbDataForEmailTemplate);
        let rspsendMailUtils = await sendMailUtilsStatus(verifyTokenResponse, parseJsonArrayToKeyValueRes, 
            fieldsDB);
       
        const responseData = {
            getJsonExamBlobResponse,
            updateExamResult,
            rspsendMailUtils
        }

        let handleMongoConn = await handleMongoConnection()
        context.res = await responseOkJson(responseData, handleMongoConn);

    } catch (error) {
        console.log(error);
        context.res = await responseErrorJson(error);
    }

};

function createExamResultBlobNamePath(verifyTokenResponse) {
    let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_final_answers.json";

    return verifyTokenResponse.Participant_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/" + blobNameJson;
}

async function updateBlobOnExamFinish(getJsonExamFromBlob, examJsonBlobPath) {
    let jsonObject = JSON.parse(getJsonExamFromBlob);
    try {
        jsonObject.ExamEvent_EndTime = Math.floor(new Date() / 1000);
        jsonObject.Exam_Finished = true;
        let putModifiedJsonToCont = await Utils.putFileToContainerJson(examsuser, examJsonBlobPath, JSON.stringify(jsonObject));
        return putModifiedJsonToCont;

    } catch (error) {
        return Promise.reject({
                message : "updateBlobOnExamFinish make en error ",
                error: error,
                stateoferror: 85
        });
    }
}

const updateExamInDB = async (examId) => {

    try {
        await validateIfStringExist(examId)
        let examUpdate = await Exam.findOneAndUpdate(
            { examId: examId, examssk: examId }, 
            {$set:{status: "Finished"}}, {new: true});

        if (examUpdate) {
            
            examUpdate = examUpdate.toObject();
            delete examUpdate['_id'];
            delete examUpdate['examssk'];
            return examUpdate;

        } else {
             
            let messageBody = {
                message : "No Exam in DB "+examId,
                error: "No Exam in DB "+examId,
                stateoferror: 81
            }
            return Promise.reject(messageBody)
        }

    } catch (error) {
        let messageBody = {
            message : "Error updating exam start time",
            error: error,
            stateoferror: 80
        }
        return Promise.reject(messageBody);
    }
}