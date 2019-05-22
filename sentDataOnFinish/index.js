const Utils = require('../utils/utilsBlob');
const examsuser = process.env.examsuser;
const secret_key = process.env.secret_key;
const { verifyToken, responseOkJson, responseErrorJson } = require('../utils/common');


module.exports = async function (context, req) {
    
    const token = req.headers.authorization;
    let data = req.body;
    try {
        let verifyTokenResponse = await verifyToken(token, secret_key);
        let createNamePathRsp = await createNamePath(verifyTokenResponse);
        let getJsonExamBlobResponse = await Utils.putFileToContainerJson(examsuser, createNamePathRsp, JSON.stringify(data));

        // save exam finished = true and finished time in exam JSON file
        let examJsonBlobPath = await createExamNamePath(verifyTokenResponse);
        let getJsonExamFromBlob = await Utils.getJsonExamBlob(examJsonBlobPath, examsuser);
        await updateBlobOnExamFinish(getJsonExamFromBlob, examJsonBlobPath);

        context.res = await responseOkJson(getJsonExamBlobResponse);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }

};

function createNamePath(verifyTokenResponse){
    let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" + 
                       verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" + 
                       verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_final_answers.json";

    return verifyTokenResponse.Participant_EXTERNAL_ID + "/" + 
           verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" + 
           verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/" + blobNameJson;
}

function createExamNamePath(verifyTokenResponse) {
    let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_score.json";

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
