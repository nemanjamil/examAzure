const UtilsBlob = require('../utils/utilsBlob');
const examtemplatecontainer = process.env.examtemplatecontainer;
const examsuser = process.env.examsuser;
const secret_key = process.env.secret_key;
const { isArray, verifyToken } = require('../utils/common');
const path = require('path');

var mongoose = require('mongoose');
const Question = require('../models/question');



module.exports = async function (context, req) {

    let parses = req.body;
    const question = parses.question;
    const answers = parses.answers;
    const eventId = parses.eventId;
    const token = req.headers.authorization;

    mongoose.connect(`${process.env.COSMOSDB_CONNSTR}/exams` + "?ssl=true&replicaSet=globaldb", {
        useNewUrlParser: true,
        auth: {
            user: process.env.COSMODDB_USER,
            password: process.env.COSMOSDB_PASSWORD
        }
    })
        .then(() => console.log('Connection to CosmosDB successful'))
        .catch((err) => console.error(err));
    
       

    const saveQuestAndAnsw = async (createNamePathRsp, userFirstName, userLastName) => {
        const quest = new Question({
            userName: userFirstName,
            userLastName: userLastName,
            time: new Date(),
            eventId: eventId,
            examName: createNamePathRsp,
            examId: path.basename(createNamePathRsp, '_score.json'),
            question: question,
            answers: answers
        });
        quest
            .save()
            .then(result => {
                console.log('Created Question');
            })
            .catch(err => {
                console.log(err);
            });
    }

    try {
        if (!isArray(answers)) await Promise.reject({ message: "Answers is not array" });
        if (!parses.hasOwnProperty('question')) await Promise.reject({ message: "question value does not exist" });
        
        let verifyTokenResponse = await verifyToken(token, secret_key);
        const userFirstName = verifyTokenResponse.Participant_Firstname;
        const userLastName = verifyTokenResponse.Participant_Lastname;

        // 111/99293945/333/111_99293945_333_score.json
        let createNamePathRsp = await createNamePath(verifyTokenResponse);

        await saveQuestAndAnsw(createNamePathRsp, userFirstName, userLastName);

        // dobija sve informacije vezane za exam, sva pitanja i sve odgovore, koji su tacni koji ne, sta je odgovoreno i sta je tacno a sta pogresno odgovoreno
        let getJsonExamBlobResponse = await UtilsBlob.getJsonExamBlob(createNamePathRsp, examsuser);
        let updateQuestionReq = await updateQuestion(getJsonExamBlobResponse, createNamePathRsp, question, answers);

        context.res = {
            status: 200,
            body: {
                message: updateQuestionReq,
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