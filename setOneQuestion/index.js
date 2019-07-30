const UtilsBlob = require('../utils/utilsBlob');
const { connectionToDB, testIfExamIsInProgress } = require('../utils/database');
const examtemplatecontainer = process.env.examtemplatecontainer;
const examsuser = process.env.examsuser;
const secret_key = process.env.secret_key;
const { isArray, verifyToken, getExamIdFromToken } = require('../utils/common');
const path = require('path');

var mongoose = require('mongoose');
const Question = require('../models/question');



module.exports = async function (context, req) {

    let parses = req.body;
    const question = parses.question;
    const answers = parses.answers;
    const eventId = parses.eventId;
    const answersHash = parses.answersHash;
    const token = req.headers.authorization;


    try {

        await connectionToDB();
        const examId = await getExamIdFromToken(token, secret_key);
        let response = await testIfExamIsInProgress(examId);

    
        if (!isArray(answers)) await Promise.reject({ message: "Answers is not array" });
        if (!parses.hasOwnProperty('question')) await Promise.reject({ message: "question value does not exist" });

        let verifyTokenResponse = await verifyToken(token, secret_key);
        const userFirstName = verifyTokenResponse.Participant_Firstname;
        const userLastName = verifyTokenResponse.Participant_Lastname;

        // 111/99293945/333/111_99293945_333_score.json
        let createNamePathRsp = await createNamePath(verifyTokenResponse);

     //   await connectionToDB();
        if(!eventId) Promise.reject({message: "No event Id"});
        await saveQuestAndAnswers(createNamePathRsp, userFirstName, userLastName, question, answers, eventId, answersHash);

        // dobija sve informacije vezane za exam, sva pitanja i sve odgovore, koji su tacni koji ne, sta je odgovoreno i sta je tacno a sta pogresno odgovoreno
        let getJsonExamBlobResponse = await UtilsBlob.getJsonExamBlob(createNamePathRsp, examsuser);
        response = await updateQuestion(getJsonExamBlobResponse, createNamePathRsp, question, answers);

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

    } catch (error) {
        context.res = {
            status: 400,
            body: {
                message: error,
                status: false
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
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

async function updateQuestion(getJsonExamBlobResponse, blobNameJsonPath, question, answers) {
    let jsonObject = JSON.parse(getJsonExamBlobResponse);

    try {
        let modifyAswersResp = await modifyAswers(jsonObject, question, answers);
        let putModifiedJsonToCont = await UtilsBlob.putFileToContainerJson(examsuser, blobNameJsonPath, JSON.stringify(modifyAswersResp));
        return putModifiedJsonToCont;
    } catch (error) {
        return Promise.reject(error);
    }
}

function modifyAswers(jsonObject, question, answers) {
    let oneQuestion = jsonObject.examQuestions.filter(item => {
        return item.question_id === question
    })
    if (oneQuestion[0].answersSelected === undefined || oneQuestion[0].answersSelected.length == 0) {
        oneQuestion[0].answersSelected = [...answers];
        return Promise.resolve(jsonObject);
    } else {
        return Promise.reject("Allready answered question : " + question)
    }
}

const saveQuestAndAnswers = async (createNamePathRsp, userFirstName, userLastName, question, answers, eventId, answersHash) => {

    const examId = path.basename(createNamePathRsp, '_score.json');

    const questionssk = examId;

    const quest = new Question({
        userName: userFirstName,
        userLastName: userLastName,
        time: new Date(),
        eventId: eventId,
        examName: createNamePathRsp,
        examId: examId,
        questionId: question,
        answers: answers,
        questionssk: questionssk,
        answersHash: answersHash
    });

    try {

        await quest.save();

    } catch (error) {

        console.log(error);
        let messageBody = {
            message: "Error saving question to database"
        }
        return Promise.reject(messageBody)
    }
}
