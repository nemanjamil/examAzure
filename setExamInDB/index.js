const Exam = require('../models/exam');
const secret_key = process.env.secret_key;
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson, verifyToken } = require('../utils/common');
const examtemplatecontainer = process.env.examtemplatecontainer;
const UtilsBlob = require('../utils/utilsBlob');
const examssk = process.env.EXAMSSK;

module.exports = async function (context, req) {

    const token = req.headers.authorization;

    try {
        await connectionToDB();
        let verifyTokenResponse = await verifyToken(token, secret_key);

        let blobLocation = verifyTokenResponse.ExamVersion_EXTERNAL_ID+".json";
        let getJsonExamBlobResponse = await UtilsBlob.getJsonExamBlob(blobLocation, examtemplatecontainer);

        let getJsonExamBlobResponseParsed = JSON.parse(getJsonExamBlobResponse);

        let ExamVersion_maxPoints = getJsonExamBlobResponseParsed.ExamVersion_maxPoints;
        let ExamVersion_passingPoints = getJsonExamBlobResponseParsed.ExamVersion_passingPoints;
        let Exam_SuccessPercent = getJsonExamBlobResponseParsed.Exam_SuccessPercent;
    
        const examId = verifyTokenResponse.Participant_EXTERNAL_ID + "_" +
            verifyTokenResponse.ExamVersion_EXTERNAL_ID + "_" +
            verifyTokenResponse.ExamEvent_EXTERNAL_ID;

        const data = await saveExamInDB(verifyTokenResponse, examId, ExamVersion_maxPoints, 
                                        ExamVersion_passingPoints, Exam_SuccessPercent, token);
        context.res = await responseOkJson(data);
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const saveExamInDB = async (verifyTokenResponse, examId, ExamVersion_maxPoints, 
                            ExamVersion_passingPoints, Exam_SuccessPercent, token) => {

    try {

        //const examssk = examId;

        const exam = new Exam({
            userName: verifyTokenResponse.Participant_Firstname,
            userLastName: verifyTokenResponse.Participant_Lastname,
            participantExternalId: verifyTokenResponse.Participant_EXTERNAL_ID,
            examVersionExternalId: verifyTokenResponse.ExamVersion_EXTERNAL_ID,
            examEventExternalId: verifyTokenResponse.ExamEvent_EXTERNAL_ID,
            examVersionMaxPoints : ExamVersion_maxPoints,
            examVersionPassingPoints : ExamVersion_passingPoints,
            examSuccessPercent : Exam_SuccessPercent,
            examDurationTime: verifyTokenResponse.ExamVersion_plannedDuration,
            token: token,
            startTime: null,
            finishTime: null,
            examId: examId,
            started: false,
            finished: false,
            isCheated: null,
            status: 'Prepared',
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










