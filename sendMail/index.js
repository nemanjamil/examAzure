const sgMail = require('@sendgrid/mail');
const {
    responseErrorJson,
    responseOkJson
} = require('../utils/common');

module.exports = async function (context, req) {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: req.body.emailrecipient,
        from: {
            name: 'TEMS',
            email: process.env.SENDGRID_FROM_MAIL
        },
        templateId: 'd-ffaa5661b51743fe8594c2bf5f6ed0cb',
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