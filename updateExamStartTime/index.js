const UtilsBlob = require('../utils/utilsBlob');
const { connectionToDB, handleMongoConnection } = require('../utils/database');
const Exam = require('../models/exam');
const { getSpecificDataFromDB } = require('../utils/database');
const { SENTENCES } = require('../utils/common');
const { sendMailUtilsStatus } = require('../utils/sendMailUtils')
const examsuserContainer = process.env.examsuser;
const secret_key = process.env.secret_key;
const { verifyToken, responseOkJson, responseErrorJson, parseJsonArrayToKeyValue } = require('../utils/common');

module.exports = async function (context, req) {

    const token = req.headers.authorization;

    try {
        let verifyTokenResponse = await verifyToken(token, secret_key);
        let createNamePathRsp = await createNamePath(verifyTokenResponse);

        let getJsonExamBlobResponse = await UtilsBlob.getJsonExamBlob(createNamePathRsp, examsuserContainer);
        let updateQuestionReq = await updateJson(getJsonExamBlobResponse, createNamePathRsp);

        await connectionToDB("updateExamStartTime");
        const examId = examIdCalculate(verifyTokenResponse);
        const updateResult = await updateExamInDB(examId);

        // send email to proctor
        let fieldsDB = ['STATUS_EMAIL_HI', 'GEN_Email_Status_Link_To_Gallery',
                    'GEN_Email_Status_For_Information','GEN_Email_Status_Started_On',
                    'GEN_Email_Status_The_Exam', 'GEN_Sender_Email_Name', 
                    'GEN_Email_Status_Started']
                    
        const getDbDataForEmailTemplate = await getSpecificDataFromDB(fieldsDB);
        let parseJsonArrayToKeyValueRes = await parseJsonArrayToKeyValue(getDbDataForEmailTemplate);

        let rspsendMailUtils = await sendMailUtilsStatus(verifyTokenResponse, parseJsonArrayToKeyValueRes, 
            fieldsDB);

        let handleMongoConn = await handleMongoConnection()

        response = {
            updateQuestion: updateQuestionReq,
            updateExamDb: updateResult
        }

        context.res = await responseOkJson(response, handleMongoConn);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }
};

async function updateJson(getJsonExamBlobResponse, blobNameJsonPath) {
    let jsonObject = JSON.parse(getJsonExamBlobResponse);

    try {
        jsonObject.ExamEvent_StartTime = Math.floor(new Date() / 1000);
        jsonObject.Exam_Started = true;
        let putModifiedJsonToCont = await UtilsBlob.putFileToContainerJson(examsuserContainer, blobNameJsonPath, JSON.stringify(jsonObject));
        return putModifiedJsonToCont;

    } catch (error) {
        return Promise.reject(error);
    }
}

function createNamePath(verifyTokenResponse) {
    let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_score.json";

    return verifyTokenResponse.Participant_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/" + blobNameJson;
}

const examIdCalculate = (verifyTokenResponse) => {
    return verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID;
}

const updateExamInDB = async (examId) => {

    try {

        data = { 
            startTime: new Date(),
            started : true,
            status: SENTENCES.inProgress
        }

        let examUpdate = await Exam.findOneAndUpdate(
            { examId: examId, examssk: examId},
            { $set: data },
            { new: true }
        );

        if (examUpdate) {
            
            examUpdate = examUpdate.toObject();
            delete examUpdate['_id'];
            delete examUpdate['examssk'];
            return examUpdate;

        } else {
             
            let messageBody = {
                message : "No Exam in DB "+examId,
                error: "No Exam in DB "+examId,
                stateoferror: 120
            }
            return Promise.reject(messageBody)
        }

    } catch (error) {
        console.log(error);
        let messageBody = {
            message: "Error updating exam start time"
        }
        return Promise.reject(messageBody);
    }
}