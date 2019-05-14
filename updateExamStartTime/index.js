const UtilsBlob = require('../utils/utilsBlob');
const { connectionToDB } = require('../utils/database');
const Exam = require('../models/exam');
const examsuserContainer = process.env.examsuser;
const secret_key = process.env.secret_key;
const { verifyToken, responseOkJson, responseErrorJson } = require('../utils/common');



module.exports = async function (context, req) {

    const token = req.headers.authorization;

    try {
        let verifyTokenResponse = await verifyToken(token, secret_key);
        let createNamePathRsp = await createNamePath(verifyTokenResponse);

        let getJsonExamBlobResponse = await UtilsBlob.getJsonExamBlob(createNamePathRsp, examsuserContainer);
        let updateQuestionReq = await updateJson(getJsonExamBlobResponse, createNamePathRsp);

        await connectionToDB();
        const examId = examIdCalculate(verifyTokenResponse);
        //console.log("EXAM ID: " + examId);
        await updateExamInDB(context, examId);


        context.res = await responseOkJson(updateQuestionReq);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }

};




async function updateJson(getJsonExamBlobResponse, blobNameJsonPath) {
    let jsonObject = JSON.parse(getJsonExamBlobResponse);

    // racunanje vremena u Londonu
    // ovo nam ne treba, london nije pocetna vremenska zona
    // new Date daje podatak pocetne nulte UTC zone
    // ovaj kod je izgleda suvisan ali da sacuvamo za svaki slucaj

    // function calcTime(offset) {
    //     d = new Date();
    //     utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    //     nd = new Date(utc + (3600000 * offset));
    //     return nd;
    // }
    // function toTimestamp(strDate) {
    //     var datum = Date.parse(strDate);
    //     return datum / 1000;
    // }


    // let LondonTime = calcTime('+1')
    try {

        jsonObject.ExamEvent_StartTime = Math.floor(new Date() / 1000);
     //   jsonObject.ExamEvent_StartTime_London = toTimestamp(LondonTime);
        jsonObject.Exam_Started = true;
        let putModifiedJsonToCont = await UtilsBlob.putFileToContainerJson(examsuserContainer, blobNameJsonPath, JSON.stringify(jsonObject));
        putModifiedJsonToCont.LondonTime = jsonObject.ExamEvent_StartTime_London;
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

const updateExamInDB = async (context, examId) => {

    try {
        const exam = await Exam.findOne({ examId: examId });

        exam.startTime = new Date();
        exam.started = true;

        await exam.save();


        // context.res = {
        //     status: 200,
        // };

        // context.done();

    } catch (error) {
        console.log(error);
        let messageBody = {
            message: "Error updating exam start time"
        }
        return Promise.reject(messageBody);
    }
}