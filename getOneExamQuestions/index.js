
const Question = require('../models/question');
const { connectionToDB, handleMongoConnection } = require('../utils/database');
const { responseErrorJson, responseOkJson, validateIfStringExist } = require('../utils/common');


module.exports = async function (context, req) {

    const examId = req.body.examId;

    try {
        await validateIfStringExist(examId)
        await connectionToDB("getOneExamQuestion");
        let getDataFromDBResponse = await getDataFromDB(context, examId);

        let handleMongoConn = await handleMongoConnection()
        
        context.res = await responseOkJson(getDataFromDBResponse, handleMongoConn);

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const getDataFromDB = async (context, examId) => {
    try{
        return await Question.find({examId: examId, questionssk : examId });
    }catch(error){
        let messageBody = {
            message: error
        }
        return Promise.reject(messageBody)
    }
}

    