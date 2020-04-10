const Exam = require('../models/exam');
const {  responseOkJson, responseErrorJson } = require('../utils/common');
const { connectionToDB, handleMongoConnection } = require('../utils/database');

module.exports = async function (context, req) {
   
    const { exam, rowsToUpdate } = req.body;

    try {
        await connectionToDB("updateExamParamsFromAdminPanel");
        const updateDBResult = await updateExam(exam, rowsToUpdate);

        let handleMongoConn = await handleMongoConnection()
        context.res = await responseOkJson(updateDBResult);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }
};

const updateExam = async (exam, rowsToUpdate) => {

     try {

        let examUpdate = await Exam.findOneAndUpdate(
            { examId: exam.examId, examssk: exam.examId }, 
            {$set: rowsToUpdate}, 
            {new: true}
            );
 
        return examUpdate;
        
    } catch (error) {
        console.log(error);
        let messageBody = {
            message: "Error updating exam"
        }
        return Promise.reject(messageBody)
    }
}