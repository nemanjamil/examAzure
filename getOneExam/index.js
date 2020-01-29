const Exam = require('../models/exam');
const { connectionToDB, disconectFromDB, readyStateMongoose, closeMongoDbConnection  } = require('../utils/database');
const { verifyToken, responseErrorJson, responseOkJson} = require('../utils/common');
const secret_key = process.env.secret_key;


module.exports = async function (context, req) {

    const examId = req.body.examId;
    const token = req.headers.authorization;

    try {
        await verifyToken(token, secret_key);
        await connectionToDB();
        let getDataResponse = await getDataFromDB(context, examId);

        let disconectFromDBRes = await disconectFromDB();
        let stateOfMongoDb = await readyStateMongoose();
        let closeMongoDbConnectionRes = await closeMongoDbConnection();
    
        
        context.res = await responseOkJson(getDataResponse, {
            "disconectFromDBRes" : disconectFromDBRes,
            "stateOfMongoDb" : stateOfMongoDb,
            "closeMongoDbConnectionResp" : closeMongoDbConnectionRes,
        });

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
            result = "This exam does not exist in our DB "+examId
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

