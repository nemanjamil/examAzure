const Utils = require('../utils/utilsBlob');
const Exam = require('../models/exam');
const { connectionToDB } = require('../utils/database');
const { verifyToken, responseErrorJson, responseOkJson } = require('../utils/common');
const UtilsBlob = require('../utils/utilsBlob');
const examsuserContainer = process.env.examsuser;
const examtemplatecontainer = process.env.examtemplatecontainer;
const secret_key = process.env.secret_key;
const Question = require('../models/question');
const crypto = require('crypto');


module.exports = async function (context, req) {

    const { examId } = req.body;
    const token = req.headers.authorization;

    let updateProperties = [];

    for (let key in req.body) {
        if (key !== 'examId') {
            updateProperties.push({
                name: key,
                value: req.body[key]
            });
        }
    }

    try {
        await connectionToDB();
        let verifyTokenResponse = await verifyToken(token, secret_key); 
        let createNamePathRsp = await createNamePath(verifyTokenResponse);
        let getHashResponse = await Utils.getJsonExamBlob(createNamePathRsp, examtemplatecontainer);
        let getQuestionsFromDBResponse = await getQuestionsFromDB(examId);
        let countAnswersResponse = await countAnswers(getHashResponse, getQuestionsFromDBResponse);
        let updateDbParamsResult = await updateDbParams(countAnswersResponse,updateProperties);
        
        const updateDBResult = await updateExam(examId, updateDbParamsResult);
        const updateCheatedJSONResult = await isCheatedPropertyUpdating(examId, updateDbParamsResult);

        const response = {
            updateExamDB: updateDBResult,
            isCheatedPropertyUpdating: updateCheatedJSONResult
        }

        context.res = await responseOkJson(response);

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}


const countAnswers = async (getHashResponse, getQuestionsFromDBResponse) => {
        let correctAnswers = 0;
        let wrongAnswers = 0
        getQuestionsFromDBResponse.map(el => {
           let sortAnswers = el.answers.sort()
           let answerString = sortAnswers.join("")+getHashResponse;
           let cryptoHash = crypto.createHash('sha512').update(answerString).digest('hex');
           el['cryptoHash'] = cryptoHash;
           el['questionAnswer'] = cryptoHash===el.answersHash ? "correct" : "wrong";
           if  (cryptoHash===el.answersHash) {
                correctAnswers++;
           } else {
                wrongAnswers++;
           }
           return el;
        })

        return {correctAnswers,wrongAnswers}
}

const updateExam = async (examId, updateProperties) => {

    try {
        const exam = await Exam.findOne({ examId: examId });

        for (let key in updateProperties) {
            exam[updateProperties[key].name] = updateProperties[key].value;
        }

        let result = await exam.save();
        result = result.toObject();
        delete result['_id'];
        delete result['examssk'];

        return result;
        
    } catch (error) {
        let messageBody = {
            message: "Error updating exam"
        }
        return Promise.reject(messageBody)
    }
}


// If updating exam DB property is cheated (true or false)
// then update same information in blob JSON
const isCheatedPropertyUpdating = async (examId, updateProperties) => {

    let cheatedProperty = null;
    cheatedProperty = updateProperties.find(el => el.name === 'isCheated');

    if (cheatedProperty) {
        // create blob path from examId: tom_123_sd3-34sd => tom/123/sd3-34sd/tom_123_sd3-34sd_score.json
        const blobName = `${examId}_score.json`;
        const blobPath = `${examId.split('_').join('/')}/${blobName}`;
        try {
            let examJsonFromBlob = await UtilsBlob.getJsonExamBlob(blobPath, examsuserContainer);
            await updateJson(examJsonFromBlob, blobPath, cheatedProperty);
            return Promise.resolve({message: "Cheated property in JSON was updated"});
        } catch (error) {
            return Promise.reject(error);
        }
    }

    return Promise.resolve({message:'Not updating'});
}

// if isCheated property did changed
async function updateJson(examJsonFromBlob, blobPath, cheatedProperty) {
    
    let jsonObject = JSON.parse(examJsonFromBlob);
    try {
        jsonObject.Exam_FMR = cheatedProperty.value
        await UtilsBlob.putFileToContainerJson(examsuserContainer, blobPath, JSON.stringify(jsonObject));
    } catch (error) {
        let messageBody = {
            message: "Error updating cheated property in blob JSON file"
        }
        return Promise.reject(messageBody);
    }
}

async function createNamePath(verifyTokenResponse) {
    let blobNameJson = verifyTokenResponse.ExamVersion_EXTERNAL_ID + ".salt";
    return "salt/" + blobNameJson;
}

const getQuestionsFromDB = async (examId) => {
    try{
        return await Question.find({examId: examId});
    }catch(error){
        let messageBody = {
            message: error
        }
        return Promise.reject(messageBody)
    }
}

const updateDbParams = async (countAnswersResponse,updateProperties) => {

        updatePropertiesNew = [...updateProperties]
        updatePropertiesNew.push(
            {
                name: "correctAnswers",
                value: countAnswersResponse.correctAnswers
            }, 
            {
                name: "wrongAnswers",
                value: countAnswersResponse.wrongAnswers
            }, 
        );
        return updatePropertiesNew;
        
}