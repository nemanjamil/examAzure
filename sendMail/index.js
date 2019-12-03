const sgMail = require('@sendgrid/mail');
const {
    responseErrorJson,
    responseOkJson
} = require('../utils/common');

module.exports = async function (context, req) {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: req.body.participantemail,
        bcc: [req.body.proctor_email_receiver],
        from: {
            name: req.body.nameofsender,
            email: process.env.SENDGRID_FROM_MAIL
        },
        templateId: process.env.TEMPLATE_ID_SENDGRID,
        dynamic_template_data: {
            subject: req.body.title,
            name: req.body.firstname,
            linktoexam: req.body.token
        },
    };

    try {
        let sendmail = await sgMail.send(msg, function (error, json) {
            if (error) {
                console.error("error", error);
                context.log(error); 
            } 
        });

        console.log(sendmail);
        context.res = await responseOkJson(sendmail);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }


    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // const msg = {
    //     to: req.body.to,
    //     from: {
    //         name: 'TEMS',
    //         email: process.env.SENDGRID_FROM_MAIL
    //     },
    //     subject: req.body.title,
    //     text: req.body.message
    // };
    
    // try {
    //     let sendmail = await sgMail.send(msg, function(err, json){
    //         if(err) { return console.error(err); } 
    //     });
    //     context.res = await responseOkJson("Successfully send");
    // } catch (error) {
    //     context.res = await responseErrorJson(error);
    // }
    // context.done();

    
};