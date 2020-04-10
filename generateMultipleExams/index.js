const Exam = require('../models/exam');
const secret_key = process.env.secret_key;
const { connectionToDB, handleMongoConnection } = require('../utils/database');
const { responseErrorJson, responseOkJson, parseJsonArrayToKeyValue } = require('../utils/common');
const { getSpecificDataFromDB } = require('../utils/database');
const examtemplatecontainer = process.env.examtemplatecontainer;
const UtilsBlob = require('../utils/utilsBlob');
const { sendMailgenerateMultipleExams } = require('../utils/sendMailUtils')
const jwt = require('jsonwebtoken');
const uuid =  require('uuid');

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

module.exports = async function (context, req) {

    const dataExam = req.body.data;
    const users = req.body.users;
    
    if (!Array.isArray(users) || users.length<=0) {
        context.res = await responseErrorJson("Error in JSON :  users");
        return;
    } 
    if (!Array.isArray(dataExam) || dataExam.length<=0) {
        context.res = await responseErrorJson("Error in JSON :  Empty Data");
        return;
    } 

    const proctorEmailReceiver =  req.body.proctorEmailReceiver;
    const reactAppBaseUrl = req.body.reactAppBaseUrl;

    try {
        
        await connectionToDB("generateMultipleExams");


        let fieldsDB = [
            'STATUS_EMAIL_HI', 'GEN_Email_Create_1_Sentence', 
            'GEN_Sender_Email_Name', 'GEN_Email_Create_2_Sentence',
            'GEN_Email_Create_Sentence_Valid_1', 'GEN_Email_Create_Sentence_Valid_2',
            'GEN_Email_Create_Signature']
   
        let getDbDataForEmailTemplate = await getSpecificDataFromDB(fieldsDB);
        let parseJsonArrayToKeyValueRes = await parseJsonArrayToKeyValue(getDbDataForEmailTemplate);
                  

        let generateTokenRes = await generateTokens(users, dataExam, proctorEmailReceiver, reactAppBaseUrl, 
                                                    parseJsonArrayToKeyValueRes, fieldsDB)

        let handleMongoConn = await handleMongoConnection()
        
        context.res = await responseOkJson(generateTokenRes, handleMongoConn);

    } catch (error) {
        
        context.res = await responseErrorJson(error);
    }

}


const generateTokens = async (users, dataExam, proctorEmailReceiver, reactAppBaseUrl, parseJsonArrayToKeyValueRes, fieldsDB) => {
    return Promise.all(users.map(user => {
         return prepareGenerationOfToken(user, dataExam, proctorEmailReceiver, reactAppBaseUrl, parseJsonArrayToKeyValueRes, fieldsDB)
        }
    ))
}

const prepareGenerationOfToken = async (user, dataExam, proctorEmailReceiver, reactAppBaseUrl, parseJsonArrayToKeyValueRes, fieldsDB) => {
      return Promise.all(dataExam.map(oneexam => {
            return generateAllExamforOneUser(user, oneexam, proctorEmailReceiver, reactAppBaseUrl, parseJsonArrayToKeyValueRes, fieldsDB)
           }
       ))
}

const generateAllExamforOneUser =  async (user, oneexam, proctorEmailReceiver, 
    reactAppBaseUrl, parseJsonArrayToKeyValueRes, fieldsDB) => {

        let uuidNmb = uuid.v1();

        let generateTokenResponse =  await generateToken(user, oneexam, proctorEmailReceiver, uuidNmb);

        let blobLocation = oneexam.ExamVersion_EXTERNAL_ID+".json";
      
        let getJsonExamBlobResponse = await UtilsBlob.getJsonExamBlob(blobLocation, examtemplatecontainer);
        let getJsonExamBlobResponseParsed = await JSON.parse(getJsonExamBlobResponse);
        
        let ExamVersion_maxPoints = getJsonExamBlobResponseParsed.ExamVersion_maxPoints;
        let ExamVersion_passingPoints = getJsonExamBlobResponseParsed.ExamVersion_passingPoints;
        let Exam_SuccessPercent = getJsonExamBlobResponseParsed.Exam_SuccessPercent;

        let examId = user.Participant_EXTERNAL_ID + "_" +
            oneexam.ExamVersion_EXTERNAL_ID + "_" +
            uuidNmb;
      
        let saveExamInDBResponse = await saveExamInDB(oneexam, user, examId, ExamVersion_maxPoints, 
                ExamVersion_passingPoints, Exam_SuccessPercent, uuidNmb, generateTokenResponse.token);

        let sendMailResponse = await sendMailgenerateMultipleExams(generateTokenResponse.token, generateTokenResponse.data,
             user, proctorEmailReceiver, reactAppBaseUrl, parseJsonArrayToKeyValueRes, fieldsDB);

        return {
            generateTokenResponse,
            saveExamInDBResponse,
            sendMailResponse
        };

}


const generateToken = async (user, dataExam, proctorEmailReceiver, uuidNmb) => {

    let time = Math.floor(new Date().getTime() / 1000);

    let data = {
        Participant_EXTERNAL_ID: user.Participant_EXTERNAL_ID,
        Participant_Firstname: user.Participant_Firstname.trim(),
        Participant_Lastname: user.Participant_Lastname.trim(),
        participantemail: user.participantemail.trim(),
        proctor_email_receiver: proctorEmailReceiver,
        Name_Of_Exam: dataExam.Name_Of_Exam.trim(),
        ExamVersion_EXTERNAL_ID: dataExam.ExamVersion_EXTERNAL_ID,
        BulkEvent_EXTERNAL_ID: dataExam.BulkEvent_EXTERNAL_ID,
        Photo_Time_Interval: dataExam.Photo_Time_Interval,
        Stopping_Time_Photo_Interval: dataExam.Stopping_Time_Photo_Interval,
        fe_endpoint: dataExam.fe_endpoint,
        ExamVersion_plannedDuration: dataExam.ExamVersion_plannedDuration,
        tokenvalidfor: dataExam.tokenvalidfor * 24 * 60 * 60,
        tokenValidFrom: Math.round(new Date(dataExam.tokenValidFrom).getTime()/1000),
        ExamEvent_GenerationTime: time,
        ExamEvent_EXTERNAL_ID: uuidNmb,
        cameraAndCognitoServices: dataExam.cameraAndCognitoServices,
        language: user.language
    }

    return new Promise((resolve,reject) => {
        jwt.sign(data, secret_key, function(err, token) {
            if (err) {
                reject(err)
            } else {
                resolve({token, data})
            }
        });
    })

}

const saveExamInDB = async (generateTokenData, user, examId, ExamVersion_maxPoints, 
                            ExamVersion_passingPoints, Exam_SuccessPercent, uuidNmb, token) => {

    try {

        let dataExamObj = {
            userName: user.Participant_Firstname,
            userLastName: user.Participant_Lastname,
            participantExternalId: user.Participant_EXTERNAL_ID,
            examVersionExternalId: generateTokenData.ExamVersion_EXTERNAL_ID,
            examEventExternalId: uuidNmb,
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
            examssk: examId
        }
        let examInsert = new Exam(dataExamObj);
        return await examInsert.save();

    } catch (error) {
        let messageBody = {
            message: "Error creating Exam"
        }
        return Promise.reject(messageBody)
    }
}


