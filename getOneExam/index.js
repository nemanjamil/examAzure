
const Question = require('../models/question');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson } = require('../utils/common');


module.exports = async function (context, req) {

    // this endpoint is calling and from exam app and exam admin app
    // exam admin app don't have token property
    // exam have token but is not used here (because admin app don't have token)

    // IMPORTANT: need secure this endpoint FOR USE IN EXAM APP WITHOUT TOKEN

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
        const result = await Question.find({examId: examId});
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
            message: "Error fetching data"
        }
        return Promise.reject(messageBody)
    }
}

    