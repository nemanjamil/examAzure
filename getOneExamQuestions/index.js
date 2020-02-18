
const Question = require('../models/question');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson } = require('../utils/common');

module.exports = async function (context, req) {

    const examId = req.body.examId;

    try {
        // examId = "222_123_444";
        await connectionToDB();
        await getDataFromDB(context, examId);
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const getDataFromDB = async (context, examId) => {
    try{
        const result = await Question.find({examId: examId, questionssk : examId });
        context.res = {
            status: 200,
            body: result
            // headers: {
            //     // 'Location': redirect
            // },
        };
        context.done();
    }catch(error){
        let messageBody = {
            message: error
        }
        return Promise.reject(messageBody)
    }
}

    