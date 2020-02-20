const sgMail = require('@sendgrid/mail');

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


const sendMailgenerateMultipleExams = async (token, participantFirstName, participantEmail, 
                                            proctorEmailReceiver, reactAppBaseUrl, language,
                                            parseJsonArrayToKeyValueRes, fieldsDB) => {

    const EMAIL_TITLE = parseJsonArrayToKeyValueRes[fieldsDB[0]][language]; 
    const EMAIL_MESSAGE = parseJsonArrayToKeyValueRes[fieldsDB[1]][language]; 
    const STATUS_EMAIL_HI = parseJsonArrayToKeyValueRes[fieldsDB[2]][language]; 

    const sendData = {};
    sendData.title = EMAIL_TITLE;
    sendData.message = EMAIL_MESSAGE;
    sendData.firstname = participantFirstName;
    sendData.nameofsender = "EXAM";
    sendData.token = `${reactAppBaseUrl}/JwtRedirect?token=${token}`;

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: proctorEmailReceiver,
        replyTo: participantEmail,
        from: {
            name: sendData.nameofsender,
            email: process.env.SENDGRID_FROM_MAIL
        },
        templateId: process.env.TEMPLATE_ID_SENDGRID,
        dynamic_template_data: {
            hello: STATUS_EMAIL_HI,
            subject: sendData.title + " - " + participantFirstName + " - " + participantEmail,
            status_sentence: sendData.message,
            name: sendData.firstname,
            linktoexam: sendData.token
        },
    };
 
    console.log("msg" , msg);
    try {
        //let sendmail = await sgMail.send(msg);
        return Promise.resolve(sendmail);
    } catch (error) {
        return Promise.reject(error);
    }

}
 



module.exports = {
    sendMailUtils,
    sendMailgenerateMultipleExams
}
