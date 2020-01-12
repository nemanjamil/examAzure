const sgMail = require('@sendgrid/mail');
const Exam = require('../models/exam');
const secret_key = process.env.secret_key;
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson, parseJsonArrayToKeyValue } = require('../utils/common');
const { getSpecificDataFromDB } = require('../utils/database');
const examtemplatecontainer = process.env.examtemplatecontainer;
const UtilsBlob = require('../utils/utilsBlob');
const examssk = process.env.EXAMSSK;
const jwt = require('jsonwebtoken');
const uuid =  require('uuid');

module.exports = async function (context, req) {

    const generateExamData = req.body.data;
    const participantFirstName = generateExamData.Participant_Firstname;
    const participantEmail = req.body.participantEmail;
    const proctorEmailReceiver =  req.body.proctorEmailReceiver;
    const reactAppBaseUrl = req.body.reactAppBaseUrl;
    const language = req.body.data.language;

    try {
        await connectionToDB();

        let response = {};

        generateExamData.ExamEvent_EXTERNAL_ID = uuid.v1();

        const generateTokenResult = await generateToken(generateExamData);

        response = {
            generateTokenResult: generateTokenResult
        }

        let blobLocation = generateTokenResult.data.ExamVersion_EXTERNAL_ID+".json";

        let getJsonExamBlobResponse = await UtilsBlob.getJsonExamBlob(blobLocation, examtemplatecontainer);

        let getJsonExamBlobResponseParsed = JSON.parse(getJsonExamBlobResponse);

        let ExamVersion_maxPoints = getJsonExamBlobResponseParsed.ExamVersion_maxPoints;
        let ExamVersion_passingPoints = getJsonExamBlobResponseParsed.ExamVersion_passingPoints;
        let Exam_SuccessPercent = getJsonExamBlobResponseParsed.Exam_SuccessPercent;
    
        const examId = generateTokenResult.data.Participant_EXTERNAL_ID + "_" +
            generateTokenResult.data.ExamVersion_EXTERNAL_ID + "_" +
            generateTokenResult.data.ExamEvent_EXTERNAL_ID;

        const saveExamInDBResponse = await saveExamInDB(generateTokenResult.data, examId, ExamVersion_maxPoints, 
                                         ExamVersion_passingPoints, Exam_SuccessPercent, generateTokenResult.token);

        response = {
            ...response,
            saveExamInDBResponse: saveExamInDBResponse
        }
                                        
        const proctorEmailReceiver =  req.body.proctorEmailReceiver;
        const sendMailResponse = await sendMail(generateTokenResult.token, participantFirstName, participantEmail, proctorEmailReceiver, reactAppBaseUrl, language);

        response = {
            ...response,
            sendMailResponse: sendMailResponse
        }

        context.res = await responseOkJson(response);

    } catch (error) {
        console.log(error);
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const generateToken = async (genarateExamData) => {

    const time = Math.floor(new Date().getTime() / 1000);

    const data = {
        Participant_EXTERNAL_ID: genarateExamData.Participant_EXTERNAL_ID,
        Participant_Firstname: genarateExamData.Participant_Firstname.trim(),
        Participant_Lastname: genarateExamData.Participant_Lastname.trim(),
        Name_Of_Exam: genarateExamData.Name_Of_Exam.trim(),
        ExamVersion_EXTERNAL_ID: genarateExamData.ExamVersion_EXTERNAL_ID,
        BulkEvent_EXTERNAL_ID: genarateExamData.BulkEvent_EXTERNAL_ID,
        Photo_Time_Interval: genarateExamData.Photo_Time_Interval,
        Stopping_Time_Photo_Interval: genarateExamData.Stopping_Time_Photo_Interval,
        fe_endpoint: genarateExamData.fe_endpoint,
        ExamVersion_plannedDuration: genarateExamData.ExamVersion_plannedDuration,
        tokenvalidfor: genarateExamData.tokenvalidfor * 24 * 60 * 60,
        ExamEvent_GenerationTime: time,
        ExamEvent_EXTERNAL_ID: genarateExamData.ExamEvent_EXTERNAL_ID,  //uuid.v1(),
        language: genarateExamData.language
    }

    const token = jwt.sign(data, secret_key);

    return {token: token, data: data}
}

const saveExamInDB = async (generateTokenData, examId, ExamVersion_maxPoints, 
                            ExamVersion_passingPoints, Exam_SuccessPercent, token) => {

    try {

        const exam = new Exam({
            userName: generateTokenData.Participant_Firstname,
            userLastName: generateTokenData.Participant_Lastname,
            participantExternalId: generateTokenData.Participant_EXTERNAL_ID,
            examVersionExternalId: generateTokenData.ExamVersion_EXTERNAL_ID,
            examEventExternalId: generateTokenData.ExamEvent_EXTERNAL_ID,
            examVersionMaxPoints : ExamVersion_maxPoints,
            examVersionPassingPoints : ExamVersion_passingPoints,
            examSuccessPercent : Exam_SuccessPercent,
            examDurationTime: generateTokenData.ExamVersion_plannedDuration,
            token: token,
            startTime: new Date(),
            finishTime: null,
            examId: examId,
            started: false,
            finished: false,
            isCheated: null,
            status: 'Prepared',
            nameOfExam: generateTokenData.Name_Of_Exam,
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

const sendMail = async (token, participantFirstName, participantEmail, proctorEmailReceiver, reactAppBaseUrl, language) => {

    let fieldsDB = ['NEW_EXAM_EMAIL_TITLE', 'NEW_EXAM_EMAIL_MESSAGE', 'STATUS_EMAIL_HI'];
    const getDbDataForEmailTemplate = await getSpecificDataFromDB(fieldsDB);
    let parseJsonArrayToKeyValueRes = await parseJsonArrayToKeyValue(getDbDataForEmailTemplate);

    const EMAIL_TITLE = parseJsonArrayToKeyValueRes[fieldsDB[0]][language]; 
    const EMAIL_MESSAGE = parseJsonArrayToKeyValueRes[fieldsDB[1]][language]; 
    const STATUS_EMAIL_HI = parseJsonArrayToKeyValueRes[fieldsDB[2]][language]; 

  //  console.log(EMAIL_MESSAGE);
  //  console.log(STATUS_EMAIL_HI);

    const sendData = {};
    sendData.title = EMAIL_TITLE;
    sendData.message = EMAIL_MESSAGE;
    sendData.firstname = participantFirstName;
    sendData.participantemail = participantEmail;
    sendData.proctor_email_receiver = proctorEmailReceiver;
    sendData.nameofsender = "EXAM";
    sendData.token = `${reactAppBaseUrl}/JwtRedirect?token=${token}`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: sendData.proctor_email_receiver,
        replayTo: sendData.participantemail,
        from: {
            name: sendData.nameofsender,
            email: process.env.SENDGRID_FROM_MAIL
        },
        templateId: process.env.TEMPLATE_ID_SENDGRID,
        dynamic_template_data: {
            hello: STATUS_EMAIL_HI,
            subject: sendData.title,
            status_sentence: sendData.message,
            name: sendData.firstname,
            linktoexam: sendData.token
        },
    };

    try {
        let sendmail = await sgMail.send(msg, function (error, json) {
            if (error) {
                console.error("error", error);
                context.log(error); 
            } 
        });

        return Promise.resolve(sendmail);

    } catch (error) {
        return Promise.reject(error);
    }

}

