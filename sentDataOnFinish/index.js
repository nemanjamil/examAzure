<<<<<<< HEAD
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

=======
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

>>>>>>> e67b7ca70cc1c842c725fe60baf866e6a419db9c
