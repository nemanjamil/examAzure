const sgMail = require('@sendgrid/mail');

const sendMailUtils = async (verifyTokenResponse, parseJsonArrayToKeyValueRes, fieldsDB) => {

    let language = verifyTokenResponse.language

    let STATUS_EMAIL_HI = parseJsonArrayToKeyValueRes[fieldsDB[0]][language]; 
    let STATUS_EMAIL_SENTENCE = parseJsonArrayToKeyValueRes[fieldsDB[1]][language]; 
    let STATUS_EMAIL_TITLE = parseJsonArrayToKeyValueRes[fieldsDB[2]][language]; 
    let GEN_Sender_Email_Name = parseJsonArrayToKeyValueRes[fieldsDB[3]][language]; 
   
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: verifyTokenResponse.proctor_email_receiver,
        from: {
            name: GEN_Sender_Email_Name,
            email: process.env.SENDGRID_FROM_MAIL
        },
        templateId: process.env.TEMPLATE_ID_SENDGRID_FOR_EMAIL_STATUS,
        dynamic_template_data: {
            subject: STATUS_EMAIL_TITLE,
            hello: STATUS_EMAIL_HI,
            status_sentence: STATUS_EMAIL_SENTENCE,
            name: GEN_Sender_Email_Name,
            date_time: Date(Date.now()).toString(),
            examdetails: JSON.stringify(verifyTokenResponse)
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
 
    try {
        let sendmail = await sgMail.send(msg);
        return Promise.resolve(sendmail);
    } catch (error) {
        return Promise.reject(error);
    }

}
 



module.exports = {
    sendMailUtils,
    sendMailgenerateMultipleExams
}
