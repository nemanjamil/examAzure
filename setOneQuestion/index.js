const UtilsBlob = require('../utils/utilsBlob');
const examtemplatecontainer = process.env.examtemplatecontainer;
const examsuser = process.env.examsuser;
const secret_key = process.env.secret_key;
const { isArray, verifyToken } = require('../utils/common');

module.exports = async function (context, req) {
    
    let parses = req.body;
    const question = parses.question;
    const answers = parses.answers;
    const token = req.headers.authorization;
 
    try {
        if (!isArray(answers)) await Promise.reject({message : "Answers is not array"});
        if (!parses.hasOwnProperty('question')) await Promise.reject({message : "question value does not exist"});
        let verifyTokenResponse = await verifyToken(token, secret_key);
        let createNamePathRsp = await createNamePath(verifyTokenResponse);
    
        let getJsonExamBlobResponse = await UtilsBlob.getJsonExamBlob(createNamePathRsp, examsuser);
        let updateQuestionReq = await updateQuestion(getJsonExamBlobResponse, createNamePathRsp, question, answers);
        
       context.res = {
            status: 200, 
            body: { 
                    message : updateQuestionReq,
                    status : true
                },
            headers: {
                'Content-Type': 'application/json'
            }
        };

    } catch (error) {
        context.res = {
            status: 400, 
            body: { 
                message : error,
                status : false
             },
            headers: {
                'Content-Type': 'application/json'
            }
        };
    } 
};

function createNamePath(verifyTokenResponse){
    let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" + 
                       verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" + 
                       verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_score.json";

    return verifyTokenResponse.Participant_EXTERNAL_ID + "/" + 
           verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" + 
           verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/" + blobNameJson;
}

async function updateQuestion(getJsonExamBlobResponse, blobNameJsonPath, question, answers){
    let jsonObject = JSON.parse(getJsonExamBlobResponse);
  
    try {
        let modifyAswersResp = await modifyAswers(jsonObject, question, answers);
        let putModifiedJsonToCont = await UtilsBlob.putFileToContainerJson(examsuser, blobNameJsonPath, JSON.stringify(modifyAswersResp));
        return putModifiedJsonToCont;
    } catch (error){
        return Promise.reject(error);
    }
}

function modifyAswers(jsonObject, question, answers){
    let oneQuestion = jsonObject.examQuestions.filter(item => {
        return item.question_id === question
    })
    if (oneQuestion[0].answersSelected === undefined || oneQuestion[0].answersSelected.length == 0) {
        oneQuestion[0].answersSelected = [...answers];
        return Promise.resolve(jsonObject);
    } else {
        return Promise.reject("Allready answered question : "+question)
    }
}