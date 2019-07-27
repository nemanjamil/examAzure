const Exam = require('../models/exam');
const secret_key = process.env.secret_key;
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson, verifyToken } = require('../utils/common');


module.exports = async function (context, req) {

    const token = req.headers.authorization;

    try {
        await connectionToDB();
        let verifyTokenResponse = await verifyToken(token, secret_key);

        const examId = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
            verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
            verifyTokenResponse.ExamEvent_EXTERNAL_ID;

        const data = await saveExamInDB(verifyTokenResponse, examId);
        context.res = await responseOkJson(data);
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const saveExamInDB = async (verifyTokenResponse, examId) => {

    try {

        const examssk = examId;

        const exam = new Exam({
            userName: verifyTokenResponse.Participant_Firstname,
            userLastName: verifyTokenResponse.Participant_Lastname,
            participantExternalId: verifyTokenResponse.Participant_EXTERNAL_ID,
            examVersionExternalId: verifyTokenResponse.ExamVersion_EXTERNAL_ID,
            examEventExternalId: verifyTokenResponse.ExamEvent_EXTERNAL_ID,
            startTime: null,
            finishTime: null,
            examId: examId,
            started: false,
            finished: false,
            isCheated: null,
            status: 'Ready',
            examssk: examssk
        });

        const result = await exam.save();
        return result;

    } catch (error) {
        let messageBody = {
            message: "Error creating Exam"
        }
        return Promise.reject(messageBody)
    }
}










