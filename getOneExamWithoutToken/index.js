const Exam = require('../models/exam');
const { connectionToDB, readyStateMongoose, closeMongoDbConnection  } = require('../utils/database');
const { verifyToken, responseErrorJson, responseOkJson,  validateIfStringExist } = require('../utils/common');
const secret_key = process.env.secret_key;

module.exports = async function (context, req) {

    const examId = req.body.examId;

    console.log(examId);

    try {
        await validateIfStringExist(examId)
        await connectionToDB();
        let { getDataResponse, examCost }  = await getDataFromDB(context, examId);
        let closeMongoDbConnectionRes = await closeMongoDbConnection();
        let stateOfMongoDb = await readyStateMongoose();

        context.res = await responseOkJson(getDataResponse, {
            "stateOfMongoDb" : stateOfMongoDb,
            "examCost" : examCost,
            "closeMongoDbConnectionResp" : closeMongoDbConnectionRes,
        });

    } catch (error) {
        context.res = await responseErrorJson(error);
    }

}

const getDataFromDB = async (context, examId) => {
    try {
        let result = await Exam.findOne({ examId: examId, examssk : examId });
        let examCost = await Exam.db.db.command({getLastRequestStatistics:1});
         // Remove sensible information from Exam response data
        if (result) {
            result = result.toObject();
            delete result['_id'];
            delete result['examssk'];
            return { "getDataResponse" : result, examCost } 
        } else {
            let messageBody = {
                message: "This exam does not exist in our DB "+examId,
                error: result,  
                stateoferror: 61,
            }
            return Promise.reject(messageBody)
        }
       

    } catch (error) {
        let messageBody = {
            message: "Error occurs on find one getOneExam",
            error: error,  
            stateoferror: 62,
        }
        return Promise.reject(messageBody)
    }
}
