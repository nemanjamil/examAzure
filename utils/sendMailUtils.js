const sgMail = require('@sendgrid/mail');
const moment = require('moment');


// CREATE EXAM
const sendMailUtils = async (verifyTokenResponse, parseJsonArrayToKeyValueRes, 
    fieldsDB, tokenUrl, title, valid_from, valid_until) => {

    let language = verifyTokenResponse.language

    let STATUS_EMAIL_HI = parseJsonArrayToKeyValueRes[fieldsDB[0]][language]; 
    let GEN_Email_Create_1_Sentence = parseJsonArrayToKeyValueRes[fieldsDB[1]][language]; 
    let GEN_Sender_Email_Name = parseJsonArrayToKeyValueRes[fieldsDB[2]][language]; 
    let GEN_Email_Create_2_Sentence = parseJsonArrayToKeyValueRes[fieldsDB[3]][language]; 
    let GEN_Email_Create_Sentence_Valid_1 = parseJsonArrayToKeyValueRes[fieldsDB[4]][language]; 
    let GEN_Email_Create_Sentence_Valid_2 = parseJsonArrayToKeyValueRes[fieldsDB[5]][language]; 
    let GEN_Email_Create_Signature = parseJsonArrayToKeyValueRes[fieldsDB[6]][language]; 

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: verifyTokenResponse.proctor_email_receiver,
        from: {
            name: GEN_Sender_Email_Name,
            email: process.env.SENDGRID_FROM_MAIL
        },
        templateId: process.env.TEMPLATE_ID_SENDGRID,  // CREATE EXAM
        dynamic_template_data: {
            subject: title,
            hello: STATUS_EMAIL_HI,
            first_name: verifyTokenResponse.Participant_Firstname,
            last_name: verifyTokenResponse.Participant_Lastname,
            name: GEN_Sender_Email_Name,
            GEN_Email_Create_1_Sentence : GEN_Email_Create_1_Sentence,
            GEN_Email_Create_2_Sentence : GEN_Email_Create_2_Sentence,
            linktoexam: tokenUrl,
            name_of_exam: verifyTokenResponse.Name_Of_Exam,
            GEN_Email_Create_Sentence_Valid_1: GEN_Email_Create_Sentence_Valid_1,
            GEN_Email_Create_Sentence_Valid_2: GEN_Email_Create_Sentence_Valid_2,
            valid_from, valid_from,
            valid_until, valid_until,
            GEN_Email_Create_Signature: GEN_Email_Create_Signature,
            date_time: Date(Date.now()).toString()
            //examdetails: JSON.stringify(verifyTokenResponse)
        },
    };

    try {
       return await sgMail.send(msg);
    } catch (error) {
        return error
    }
}

// STATUS OF EXAM
const sendMailUtilsStatus = async (verifyTokenResponse, parseJsonArrayToKeyValueRes, 
    fieldsDB) => {

    let language = verifyTokenResponse.language

    let STATUS_EMAIL_HI = parseJsonArrayToKeyValueRes[fieldsDB[0]][language]; 
    let GEN_Email_Status_Link_To_Gallery = parseJsonArrayToKeyValueRes[fieldsDB[1]][language]; 
    let GEN_Email_Status_For_Information = parseJsonArrayToKeyValueRes[fieldsDB[2]][language]; 
    let GEN_Email_Status_Ready = parseJsonArrayToKeyValueRes[fieldsDB[3]][language];  // THIS is used also when is started exam GEN_Email_Status_Started_On
    let GEN_Email_Status_The_Exam = parseJsonArrayToKeyValueRes[fieldsDB[4]][language]; 
    let GEN_Sender_Email_Name = parseJsonArrayToKeyValueRes[fieldsDB[5]][language]; 
    let GEN_Email_Status_TITLE = parseJsonArrayToKeyValueRes[fieldsDB[6]][language]; 


    let status_exam_information = GEN_Email_Status_For_Information+" => "+verifyTokenResponse.Participant_Firstname+
     " "+verifyTokenResponse.Participant_Lastname+" => "+GEN_Email_Status_The_Exam+ " \""+
     verifyTokenResponse.Name_Of_Exam+"\" "+GEN_Email_Status_Ready+" "+moment().format('DD-MM-YYYY, HH:mm:ss');  ;
    
    let title = "TEMS - "+GEN_Email_Status_TITLE+" || "+verifyTokenResponse.Name_Of_Exam +" || useremail : "+verifyTokenResponse.participantemail
    
    //let examIdFromJsonBlob = verifyTokenResponse.Participant_EXTERNAL_ID+"_"+verifyTokenResponse.ExamVersion_EXTERNAL_ID+"_"+verifyTokenResponse.ExamEvent_EXTERNAL_ID
    //let href_link_to_gallery = `${process.env.ADMIN_FRONT_END_ENDPOINT}/exam/gallery/${examIdFromJsonBlob}`;
    let href_link_to_gallery = `${process.env.ADMIN_FRONT_END_ENDPOINT}/exams`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: verifyTokenResponse.proctor_email_receiver,
        from: {
            name: GEN_Sender_Email_Name,
            email: process.env.SENDGRID_FROM_MAIL
        },
        templateId: process.env.TEMPLATE_ID_SENDGRID_FOR_EMAIL_STATUS,  // STATUS OF EXAM
        dynamic_template_data: {
            subject: title,
            hello: STATUS_EMAIL_HI,
            href_link_to_gallery: href_link_to_gallery,
            link_to_gallery: GEN_Email_Status_Link_To_Gallery,
            status_exam_information : status_exam_information,
            date_time: Date(Date.now()).toString()
            
        },
    };

    try {
       return await sgMail.send(msg);
    } catch (error) {
        return error
    }
}


// MULTIPLE EXAMS
const sendMailgenerateMultipleExams = async (token, dataExam,
    user, proctor_email_receiver, reactAppBaseUrl, parseJsonArrayToKeyValueRes, fieldsDB) => {

        let language = user.language;

        let STATUS_EMAIL_HI = parseJsonArrayToKeyValueRes[fieldsDB[0]][language]; 
        let GEN_Email_Create_1_Sentence = parseJsonArrayToKeyValueRes[fieldsDB[1]][language]; 
        let GEN_Sender_Email_Name = parseJsonArrayToKeyValueRes[fieldsDB[2]][language]; 
        let GEN_Email_Create_2_Sentence = parseJsonArrayToKeyValueRes[fieldsDB[3]][language]; 
        let GEN_Email_Create_Sentence_Valid_1 = parseJsonArrayToKeyValueRes[fieldsDB[4]][language]; 
        let GEN_Email_Create_Sentence_Valid_2 = parseJsonArrayToKeyValueRes[fieldsDB[5]][language]; 
        let GEN_Email_Create_Signature = parseJsonArrayToKeyValueRes[fieldsDB[6]][language]; 

        let title = "TEMS - "+ dataExam.Name_Of_Exam +" || userEmail : "+user.participantemail
        let tokenUrl = `${reactAppBaseUrl}/JwtRedirect?token=${token}`;

        let valid_from  = moment.unix(dataExam.ExamEvent_GenerationTime).format("DD/MM/YYYY");
        let valid_until  = moment.unix(dataExam.ExamEvent_GenerationTime + dataExam.tokenvalidfor).format("DD/MM/YYYY"); 
    
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        let msg = {
            to: proctor_email_receiver,
            from: {
                name: GEN_Sender_Email_Name,
                email: process.env.SENDGRID_FROM_MAIL
            },
            templateId: process.env.TEMPLATE_ID_SENDGRID,  // CREATE EXAM TEMPLATE
            dynamic_template_data: {
                subject: title,
                hello: STATUS_EMAIL_HI,
                first_name: user.Participant_Firstname,
                last_name: user.Participant_Lastname,
                name: GEN_Sender_Email_Name,
                GEN_Email_Create_1_Sentence : GEN_Email_Create_1_Sentence,
                GEN_Email_Create_2_Sentence : GEN_Email_Create_2_Sentence,
                linktoexam: tokenUrl,
                name_of_exam: dataExam.Name_Of_Exam,
                GEN_Email_Create_Sentence_Valid_1: GEN_Email_Create_Sentence_Valid_1,
                GEN_Email_Create_Sentence_Valid_2: GEN_Email_Create_Sentence_Valid_2,
                valid_from, valid_from,
                valid_until, valid_until,
                GEN_Email_Create_Signature: GEN_Email_Create_Signature,
                date_time: Date(Date.now()).toString()
                //examdetails: JSON.stringify(verifyTokenResponse)
            },
        }; 

    try {
        let sendmail = await sgMail.send(msg);
        return Promise.resolve(sendmail);
    } catch (error) {
        return Promise.reject(error);
    }

}
 



module.exports = {
    sendMailUtils,
    sendMailUtilsStatus,
    sendMailgenerateMultipleExams
}
