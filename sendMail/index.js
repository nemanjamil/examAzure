const sgMail = require('@sendgrid/mail');
const { getSpecificDataFromDB } = require('../utils/database');
const { sendMailUtils } = require('../utils/sendMailUtils')
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson, verifyToken,
        parseJsonArrayToKeyValue, validateIfStringExist } = require('../utils/common');
const secret_key = process.env.secret_key;

module.exports = async function (context, req) {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
    try {
        await connectionToDB();

        let tokenUrl = req.body.tokenUrl
        await validateIfStringExist(tokenUrl)

        let tokenExistResponse = req.body.token
        await validateIfStringExist(tokenExistResponse);

        let verifyTokenResponse = await verifyToken(tokenExistResponse, secret_key);

        let fieldsDB = [
         'STATUS_EMAIL_HI', 'GEN_Email_Create_1_Sentence', 
         'GEN_Sender_Email_Name', 'GEN_Email_Create_2_Sentence']

        const getDbDataForEmailTemplate = await getSpecificDataFromDB(fieldsDB);
        let parseJsonArrayToKeyValueRes = await parseJsonArrayToKeyValue(getDbDataForEmailTemplate);

        let rspsendMailUtils = await sendMailUtils(verifyTokenResponse, parseJsonArrayToKeyValueRes, 
            fieldsDB, tokenUrl, req.body.title);
                  
        context.res = await responseOkJson(rspsendMailUtils);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }
};