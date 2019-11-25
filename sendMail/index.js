const sgMail = require('@sendgrid/mail');
const { responseErrorJson, responseOkJson} = require('../utils/common');

module.exports = async function (context, req) {
    
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: req.body.to,
        from: process.env.SENDGRID_FROM_MAIL,
        subject: req.body.title,
        text: req.body.message
        //html: '<strong>and easy to do anywhere, even with Node.js HTML </strong>',
    };
    
    try {
        let sendmail = await sgMail.send(msg, function(err, json){
            if(err) { return console.error(err); } 
        });
        context.res = await responseOkJson("Successfully send");
    } catch (error) {
        context.res = await responseErrorJson(error);
    }
    context.done();
};