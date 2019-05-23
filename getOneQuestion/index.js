const Utils = require('../utils/utilsBlob');
const { connectionToDB, testIfExamIsInProgress } = require('../utils/database');
const examtemplatecontainer = process.env.examtemplatecontainer;
const examsuser = process.env.examsuser;
const secret_key = process.env.secret_key;
//const { parse } = require('querystring');
const { verifyToken, responseOkJson, responseErrorJson, getExamIdFromToken } = require('../utils/common');
const shuffle = require('lodash.shuffle');
const sample = require('lodash.sample');
const {
    isArray,
    SENTENCES
} = require('../utils/common');

module.exports = async function (context, req) {

    //let parses = parse(req.body);
    const token = req.headers.authorization;
    // "folder": "4444/99293945/8888",
    //"blobname": "4444_99293945_8888_score.json"
    // let parses = req.body;
    // let folder = parses.folder;
    // let blobname = parses.blobname;
    // let blobLocation = folder + '/' + blobname;

    try {
        await connectionToDB();
        const examId = await getExamIdFromToken(token, secret_key);
        let response = await testIfExamIsInProgress(examId);

        let verifyTokenResponse = await verifyToken(token, secret_key);
        let createNamePathRsp = await createNamePath(verifyTokenResponse);
        let getJsonExamBlobResponse = await Utils.getJsonExamBlob(createNamePathRsp, examsuser);
        let getOneQuestionResponse = await getOneQuestion(getJsonExamBlobResponse);

        // if exam is in progress
        if (response.value) {
            // getOneQuestionResponse.state==false && { hasQuestions : false }
            context.res = await responseOkJson(getOneQuestionResponse.message, { hasQuestions: getOneQuestionResponse.state });
        } else {
            context.res = {
                status: 200,
                body: {
                    message: response.message,
                    status: true
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            };
        }



    } catch (error) {
          context.res = await responseErrorJson(error);
    }
};

function createNamePath(verifyTokenResponse) {
    let blobNameJson = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "_score.json";

    return verifyTokenResponse.Participant_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamVersion_EXTERNAL_ID + "/" +
        verifyTokenResponse.ExamEvent_EXTERNAL_ID + "/" + blobNameJson;
}


async function getOneQuestion(jsonTextObject) {

    let jsonObject = JSON.parse(jsonTextObject);

    let oneQuestionShuffle = jsonObject.examQuestions.filter(element => {
        let answersSelected = element.answersSelected;
        if (!answersSelected || !answersSelected.length) {
            return answersSelected;
        }
    })

    if (isArray(oneQuestionShuffle)) {
        let sh = await shuffle(oneQuestionShuffle);
        let getOneQuestion = await sample(sh);

        // shuffle the answers!!! modify
        let shuffleAnswers = await shuffle(getOneQuestion.answers);
        getOneQuestion.answers = shuffleAnswers;



        getOneQuestion.answers.forEach(element => {
            delete element['correct'];
        })

        delete getOneQuestion['answersSelected'];
        delete getOneQuestion['answersHashORG'];
        delete getOneQuestion['answersHash'];

        return {
            message: getOneQuestion,
            state: true
        }


    } else {

        return {
            message: SENTENCES.questionsAnswered,
            state: false
        }
    }
}