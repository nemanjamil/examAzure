const UtilsBlob = require('../utils/utilsBlob');
const { connectionToDB, testIfExamIsInProgress, closeMongoDbConnection, readyStateMongoose } = require('../utils/database');
const examsuser = process.env.examsuser;
const questionssk = process.env.QUESTIONSSK;
const secret_key = process.env.secret_key;
const { isArray, verifyToken, getExamIdFromToken, responseOkJson, responseErrorJson } = require('../utils/common');
const path = require('path');

var mongoose = require('mongoose');
const Question = require('../models/question');


// function isOdd(num) { return num % 2;}
// let rnd = Math.floor(Math.random() * 100);
//         if (isOdd(rnd)) {
//             context.res = await responseErrorJson({ 
//                 message : "test error -----  SET ONE QUESTION",
//                 error : "test ERROR --------- SET ONE QUESTION",
//                 stateoferror: 47
//             });
//             return;
//         } 

module.exports = async function (context, req) {

    let parses = req.body;
    const question = parses.question;
    const answers = parses.answers;
    const eventId = parses.eventId;
    const answersHash = parses.answersHash;
    const token = req.headers.authorization;

    try {

        let connectionToDb = await connectionToDB();
        const examId = await getExamIdFromToken(token, secret_key);

        if (!examId) {
            await Promise.reject({ 
                    message : "ExamId does not exsist",
                    error : "examId : "+examId,
                    stateoferror: 42
             });
        }

        let responseExamInProgress = await testIfExamIsInProgress(examId, context);
    
        if (!isArray(answers)) await Promise.reject({ message: "Answers is not array" });
        if (!parses.hasOwnProperty('question')) await Promise.reject({ message: "question value does not exist" });

        let verifyTokenResponse = await verifyToken(token, secret_key);
        const userFirstName = verifyTokenResponse.Participant_Firstname;
        const userLastName = verifyTokenResponse.Participant_Lastname;

        // 111/99293945/333/111_99293945_333_score.json
        let createNamePathRsp = await createNamePath(verifyTokenResponse);

        // save to BLOB
        // dobija sve informacije vezane za exam, sva pitanja i sve odgovore, koji su tacni koji ne, sta je odgovoreno i sta je tacno a sta pogresno odgovoreno
        let getJsonExamBlobResponse = await UtilsBlob.getJsonExamBlob(createNamePathRsp, examsuser);
        let updateQuestionResponse = await updateQuestion(getJsonExamBlobResponse, createNamePathRsp, question, answers);

        // proveriti da li vec postoji u bazi ????
        // save to DB
        if(!eventId) Promise.reject({message: "No event Id"});
        let { saveQuestion, examCost } = await saveQuestAndAnswers(createNamePathRsp, userFirstName, userLastName, question, answers, eventId, answersHash);

        let closeMongoDbConnectionRes = await closeMongoDbConnection();
        let stateOfMongoDb = await readyStateMongoose();

        context.res = await responseOkJson(
            updateQuestionResponse,
            {
                "saveQuestion" : saveQuestion,
                "examCost" : examCost,
                "connectionToDb" : connectionToDb,
                "stateOfMongoDb" : stateOfMongoDb,
                "responseExamInProgress" : responseExamInProgress
            }
        );

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

async function updateQuestion(getJsonExamBlobResponse, blobNameJsonPath, question, answers) {
    let jsonObject = JSON.parse(getJsonExamBlobResponse);

    try {
        // proveravamo da li je vec odgovoreno na ovo pitanje
        let modifyAswersResp = await modifyAswers(jsonObject, question, answers);

        // tako modifikovani JSON ponovo uploaduj na File Server
        let putModifiedJsonToCont = await UtilsBlob.putFileToContainerJson(examsuser, blobNameJsonPath, JSON.stringify(modifyAswersResp));
        return putModifiedJsonToCont;
    } catch (error) {
        return Promise.reject(error);
    }
}

function modifyAswers(jsonObject, question, answers) {
    // ovde treba da stavim ako odgovor ID pripada listi pitanja onda moze da snimi
    // a to treba da stavim i na front end kao proveru
    let oneQuestion = jsonObject.examQuestions.filter(item => {
        return item.question_id === question
    })
    if (oneQuestion[0].answersSelected === undefined || oneQuestion[0].answersSelected.length == 0) {
        oneQuestion[0].answersSelected = [...answers];
        return Promise.resolve(jsonObject);
    } else {
        // Todo [Nemanja] ovde staviti da ako je odgovoreno pitanje i ima ga u JSON SETUJ U BAZU
        return Promise.reject({ 
            message : "Allready answered question in BLOB : " + question,
            error: "Allready answered question in BLOB : " + question,
            stateoferror: 41
        })
    }
}

const saveQuestAndAnswers = async (createNamePathRsp, userFirstName, userLastName, question, answers, eventId, answersHash) => {

    const examId = path.basename(createNamePathRsp, '_score.json');

    //const questionssk = examId;

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
        let saveQuestion = await quest.save();
        let examCost = await quest.db.db.command({getLastRequestStatistics:1});
        return { saveQuestion, examCost }
    } catch (error) {
        let messageBody = {
            message: "Error saving question to database",
            error: error,
            stateoferror: 40
        }
        return Promise.reject(messageBody)
    }
}
