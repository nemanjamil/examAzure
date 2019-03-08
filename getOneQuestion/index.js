const Utils = require('../utils/utilsBlob');
const examtemplatecontainer = process.env.examtemplatecontainer;
const examsuser = process.env.examsuser;
//const { parse } = require('querystring');
const shuffle = require('lodash.shuffle');
const sample = require('lodash.sample');
const {
    isArray,
    SENTENCES
} = require('../utils/common');

module.exports = async function (context, req) {

    //let parses = parse(req.body);
    let parses = req.body;
    let folder = parses.folder;
    let blobname = parses.blobname;
    let blobLocation = folder + '/' + blobname;
   
    try {

        let getJsonExamBlobResponse = await Utils.getJsonExamBlob(blobLocation, examsuser);
        let getOneQuestionResponse = await getOneQuestion(getJsonExamBlobResponse);

        context.res = {
            status: 200,
            body: getOneQuestionResponse,
            headers: {
                'Content-Type': 'application/json'
            }
        };

    } catch (error) {
        context.res = {
            status: 400,
            body: error,
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }
};


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

        getOneQuestion.answers.forEach(element => {
            delete element['correct']; 
        })
        
        delete getOneQuestion['answersSelected']; 
        delete getOneQuestion['answersHashORG']; 
        delete getOneQuestion['answersHash']; 
        
        return getOneQuestion;

    } else {
        return SENTENCES.questionsAnswered;
    }
}