const Utils = require('../utils/utilsBlob');
const { connectionToDB, testIfExamIsInProgress, 
    disconectFromDB, readyStateMongoose, closeMongoDbConnection } = require('../utils/database');
const examtemplatecontainer = process.env.examtemplatecontainer;
const questionssk = process.env.QUESTIONSSK;
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
const Question = require('../models/question');

/* function isOdd(num) { return num % 2;}
let rnd = Math.floor(Math.random() * 100);
if (isOdd(rnd)) {
    context.res = await responseErrorJson("Error number");
    return;
} */

module.exports = async function (context, req) {

    const token = req.headers.authorization;
 
    try {
        let connectionToDb = await connectionToDB();
        const examId = await getExamIdFromToken(token, secret_key);
        let response = await testIfExamIsInProgress(examId);
        
        let verifyTokenResponse = await verifyToken(token, secret_key);
        let createNamePathRsp = await createNamePath(verifyTokenResponse);
        let getJsonExamBlobResponse = await Utils.getJsonExamBlob(createNamePathRsp, examsuser);
        let getOneQuestionResponse = await getOneQuestion(getJsonExamBlobResponse);
        
        let getNumberOfAnsweredQuestionsResonse = await getNumberOfAnsweredQuestions(examId)
        
        let closeMongoDbConnectionRes = await closeMongoDbConnection();
        let stateOfMongoDb = await readyStateMongoose();

        // if exam is in progress
        if (response.status) {

            // getOneQuestionResponse.state==false && { hasQuestions : false }
            context.res = await responseOkJson(
                getOneQuestionResponse.message, 
                { 
                    hasQuestions: getOneQuestionResponse.state,
                    getNumberOfAnsweredQuestions: getNumberOfAnsweredQuestionsResonse,
                    stateOfMongoDb : stateOfMongoDb,
                    connectionToDb : connectionToDb,
                }
                );
        } else {
            context.res = {
                status: 200,
                body: {
                    message: response.message,
                    status: true,
                    stateOfMongoDb : stateOfMongoDb
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

const getNumberOfAnsweredQuestions = async (examId) => {
     try {
        let countAnsweredExams = await Question.count({ examId: examId, questionssk : questionssk })
        return countAnsweredExams;
    } catch (error) {
        let messageBody = {
            message: "Error counting questions"
        }
        return Promise.reject(messageBody)
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
        //delete getOneQuestion['answersHash'];

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