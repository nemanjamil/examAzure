
const Exam = require('../models/exam');
const { connectionToDB } = require('../utils/database');
const { verifyToken, responseErrorJson, responseOkJson} = require('../utils/common');
const secret_key = process.env.secret_key;


module.exports = async function (context, req) {

    const examId = req.body.examId;
    const token = req.headers.authorization;

    try {
        await verifyToken(token, secret_key);
        await connectionToDB();
        let getDataResponse = await getDataFromDB(context, examId);
        context.res = await responseOkJson(getDataResponse);

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const getDataFromDB = async (context, examId) => {
    try {
        let result = await Exam.findOne({ examId: examId });

         // Remove sensible information from Exam response data
        if (result) {
            result = result.toObject();
            delete result['_id'];
            delete result['examssk'];
        } else {
            result = "No Exam in DB "+examId
            return Promise.reject(result)
        }
        return result;

    } catch (error) {
        let messageBody = {
            message: error
        }
        return Promise.reject(messageBody)
    }
}

