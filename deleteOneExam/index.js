const Exam = require('../models/exam');
const Picture = require('../models/picture');
const Question = require('../models/question');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');

module.exports = async function (context, req) {

    const examId = req.body.examId;

    if (!examId) {
        context.res = await responseErrorJson("ExamID not exist");
        context.done();
    }

    try {
        await connectionToDB();
        //const sharedKey = await findExamAndTakeSharedKey(examId);
        let deleteQuestions = await deleteExamQuestions(examId);
        let deletePictures = await deleteExamPictures(examId);
        let deleteExam = await deleteExamData(examId);

        return  responseOkJson({
            deleteQuestions,
            deletePictures,
            deleteExam
        })

    } catch (error) {
        context.res = await responseErrorJson(error);
    }

}

const findExamAndTakeSharedKey = async (examId) => {
    try{
        const result = await Exam.findOne({examId: examId, examssk : examId });
        return result.examssk;
    }catch(error){
        let messageBody = {
            message: "Error fetching exam"
        }
        return Promise.reject(messageBody)
    }
}


const deleteExamQuestions = async (examId) => {
    try {

        await Question.deleteMany({ questionssk : examId, examId: examId });

    } catch (error) {
        
        let messageBody = {
            message: "Error deleting exam questions"
        }
        return Promise.reject(messageBody)
    }
}


const deleteExamPictures = async (examId) => {
    try {

        await Picture.deleteMany({ picturessk : examId, examId: examId});

    } catch (error) {

        let messageBody = {
            message: "Error deleting exam picture"
        }
        return Promise.reject(messageBody)
    }
}


const deleteExamData = async (examId) => {
    try {

        await Exam.deleteOne({ examssk : examId, examId: examId});

    } catch (error) {

        let messageBody = {
            message: "Error deleting exam"
        }
        return Promise.reject(messageBody)
    }
}

