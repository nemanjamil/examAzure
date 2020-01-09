const sgMail = require('@sendgrid/mail');

const sendMailUtils = async (verifyTokenResponse, getDbDataForEmailTemplate) => {

    let STATUS_EMAIL_HI = await JSON.parse(getDbDataForEmailTemplate[0].value); 
    let STATUS_EMAIL_SENTENCE = await JSON.parse(getDbDataForEmailTemplate[1].value); 
    let STATUS_EMAIL_TITLE = await JSON.parse(getDbDataForEmailTemplate[2].value); 

    let language = verifyTokenResponse.language
   
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: verifyTokenResponse.proctor_email_receiver,
        from: {
            name: "TEMS",
            email: process.env.SENDGRID_FROM_MAIL
        },
        templateId: process.env.TEMPLATE_ID_SENDGRID_FOR_EMAIL_STATUS,
        dynamic_template_data: {
            subject: STATUS_EMAIL_TITLE[language],
            hello: STATUS_EMAIL_HI[language],
            status_sentence: STATUS_EMAIL_SENTENCE[language],
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
