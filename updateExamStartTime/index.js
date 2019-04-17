const UtilsBlob = require('../utils/utilsBlob');
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
        context.res = await responseOkJson(updateQuestionReq);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }

};

async function updateJson(getJsonExamBlobResponse, blobNameJsonPath){
    let jsonObject = JSON.parse(getJsonExamBlobResponse);
  
    function calcTime(offset) {
       d = new Date();
       utc = d.getTime() + (d.getTimezoneOffset() * 60000);
       nd = new Date(utc + (3600000*offset));
       return nd;
       //return nd.toLocaleString();
   }
   function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
   }


   let LondonTime = calcTime('+1')
    try {
        
        jsonObject.ExamEvent_StartTime = Math.floor(new Date() / 1000);
        jsonObject.ExamEvent_StartTime_London = toTimestamp(LondonTime);
        let putModifiedJsonToCont = await UtilsBlob.putFileToContainerJson(examsuserContainer, blobNameJsonPath, JSON.stringify(jsonObject));
        putModifiedJsonToCont.LondonTime = jsonObject.ExamEvent_StartTime_London;
        return putModifiedJsonToCont;

    } catch (error){
        return Promise.reject(error);
    }
}

function createNamePath(verifyTokenResponse){
    let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" + 
                       verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" + 
                       verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_score.json";

    return verifyTokenResponse.Participant_EXTERNAL_ID + "/" + 
           verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" + 
           verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/" + blobNameJson;
}