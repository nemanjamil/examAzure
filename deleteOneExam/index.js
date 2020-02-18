const Exam = require('../models/exam');
const Picture = require('../models/picture');
const Question = require('../models/question');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson } = require('../utils/common');

const examssk = process.env.EXAMSSK;


module.exports = async function (context, req) {

    const examId = req.body.examId;

    if (!examId) {
        context.res = await responseErrorJson("ExamID not exist");
        context.done();
    }

    try {
        await connectionToDB();
        //const sharedKey = await findExamAndTakeSharedKey(examId);
        await deleteExamQuestions(examId, examId);
        await deleteExamPictures(examId, examId);
        await deleteExam(examId, examssk);
        context.res = {
            status: 200,
        };
        context.done();
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const findExamAndTakeSharedKey = async (examId) => {
    try{
        const result = await Exam.findOne({examId: examId, examssk : examssk });
        return result.examssk;
    }catch(error){
        let messageBody = {
            message: "Error fetching exam"
        }
        return Promise.reject(messageBody)
    }
}


const deleteExamQuestions = async (examId, examId) => {
    try {

        await Question.deleteMany({ questionssk : examId, examId: examId });

    } catch (error) {
        
        let messageBody = {
            message: "Error deleting exam questions"
        }
        return Promise.reject(messageBody)
    }
}


const deleteExamPictures = async (examId, examId) => {
    try {

        await Picture.deleteMany({ picturessk : examId, examId: examId});

    } catch (error) {

        let messageBody = {
            message: "Error deleting exam picture"
        }
        return Promise.reject(messageBody)
    }
}


const deleteExam = async (examId, sharedKey) => {
    try {

        await Exam.deleteOne({'examssk' : sharedKey, 'examId': examId});

    } catch (error) {

        let messageBody = {
            message: "Error deleting exam"
        }
        return Promise.reject(messageBody)
    }
}

