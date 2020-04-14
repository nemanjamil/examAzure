const Exam = require('../models/exam');
const { handleMongoConnection  } = require('../utils/database');
const { verifyToken, responseErrorJson, responseOkJson,  validateIfStringExist } = require('../utils/common');
const secret_key = process.env.secret_key;

    
module.exports = async function (context, req) {

    const examId = req.body.examId;
    const token = req.headers.authorization;

    try {
        await validateIfStringExist(examId)
        await verifyToken(token, secret_key);
        // await connectionToDB("getOneExam");
        let { getDataResponse, examCost }  = await getDataFromDB(context, examId);
        
        let handleMongoConn = await handleMongoConnection()
        
        context.res = await responseOkJson(getDataResponse, {
            "examCost" : examCost,
            "handleMongoConn" : handleMongoConn    
        });

    } catch (error) {
        context.res = await responseErrorJson(error);
    }

}

const getDataFromDB = async (context, examId) => {

    // TODO proverit da li postoji examId
    // takodje staviti na FE da ako dobije error od ove funkcije pokusa ponovo
    // ali da pokusava max 5 puta
    try {
        let result = await Exam.findOne({ examId: examId, examssk : examId });

        let examCost = "";
        if (process.env.EXAM_COST==="true") {
            examCost = await Exam.db.db.command({getLastRequestStatistics:1});
        };

         // Remove sensible information from Exam response data
        if (result) {
            result = result.toObject();
            delete result['_id'];
            delete result['examssk'];
            delete result['correctAnswers'];
            delete result['wrongAnswers'];
            
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
            error : [error.message, error.name],
            stateoferror: 62,
        }
        return Promise.reject(messageBody)
    }
}

