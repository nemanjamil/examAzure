const sgMail = require('@sendgrid/mail');

const sendMailUtils = async (verifyTokenResponse, parseJsonArrayToKeyValueRes, fieldsDB) => {

    let language = verifyTokenResponse.language

    let STATUS_EMAIL_HI = parseJsonArrayToKeyValueRes[fieldsDB[0]][language]; 
    let STATUS_EMAIL_SENTENCE = parseJsonArrayToKeyValueRes[fieldsDB[1]][language]; 
    let STATUS_EMAIL_TITLE = parseJsonArrayToKeyValueRes[fieldsDB[2]][language]; 
   
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: verifyTokenResponse.proctor_email_receiver,
        from: {
            name: "TEMS",
            email: process.env.SENDGRID_FROM_MAIL
        },
        templateId: process.env.TEMPLATE_ID_SENDGRID_FOR_EMAIL_STATUS,
        dynamic_template_data: {
            subject: STATUS_EMAIL_TITLE,
            hello: STATUS_EMAIL_HI,
            status_sentence: STATUS_EMAIL_SENTENCE,
            name: "TEMS",
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
   

module.exports = {
    sendMailUtils,
}
