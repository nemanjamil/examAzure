const Utils = require('../utils/utilsBlob');
const Exam = require('../models/exam');
const { getSpecificDataFromDB, connectionToDB } = require('../utils/database');

const { sendMailUtils } = require('../utils/sendMailUtils')
const examsuser = process.env.examsuser;
const secret_key = process.env.secret_key;
const { verifyToken, responseOkJson, responseErrorJson, createExamNamePath, parseJsonArrayToKeyValue } = require('../utils/common');
const examssk = process.env.EXAMSSK;

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

        await connectionToDB();
        let updateExamResult = await updateExamInDB(examId);

        // send email to proctor
        let fieldsDB = ['STATUS_EMAIL_HI', 'STATUS_EMAIL_SENTENCE_FINISHED_EXAM', 'STATUS_EMAIL_TITLE', 'GEN_Sender_Email_Name']
        const getDbDataForEmailTemplate = await getSpecificDataFromDB(fieldsDB);
        let parseJsonArrayToKeyValueRes = await parseJsonArrayToKeyValue(getDbDataForEmailTemplate);
        let rspsendMailUtils = await sendMailUtils(verifyTokenResponse, parseJsonArrayToKeyValueRes, fieldsDB);


        const responseData = {
            getJsonExamBlobResponse,
            updateExamResult
        }

        context.res = await responseOkJson(responseData);

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
        return Promise.reject(error);
    }
}

const updateExamInDB = async (examId) => {

    try {

        let examUpdate = await Exam.findOneAndUpdate({examId: examId, examssk: examssk}, {$set:{status: "Finished"}}, {new: true});

        examUpdate = examUpdate.toObject();
        delete examUpdate['_id'];
        delete examUpdate['examssk'];

        return examUpdate;

    } catch (error) {
        let messageBody = {
            message: "Error updating exam start time"
        }
        return Promise.reject(messageBody);
    }
}