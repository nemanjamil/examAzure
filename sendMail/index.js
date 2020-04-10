const sgMail = require('@sendgrid/mail');
const { getSpecificDataFromDB } = require('../utils/database');
const { sendMailUtils } = require('../utils/sendMailUtils')
const { connectionToDB, handleMongoConnection } = require('../utils/database');
const { responseErrorJson, responseOkJson, verifyToken,
        parseJsonArrayToKeyValue, validateIfStringExist } = require('../utils/common');
var moment = require('moment');
const secret_key = process.env.secret_key;

module.exports = async function (context, req) {

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   
    try {
        await connectionToDB("SendMail");

        let tokenUrl = req.body.tokenUrl
        await validateIfStringExist(tokenUrl)

        let tokenExistResponse = req.body.token
        await validateIfStringExist(tokenExistResponse);

        let verifyTokenResponse = await verifyToken(tokenExistResponse, secret_key);

        let valid_from  = moment.unix(verifyTokenResponse.iat).format("DD/MM/YYYY");
        let valid_until  = moment.unix(verifyTokenResponse.iat + verifyTokenResponse.tokenvalidfor).format("DD/MM/YYYY"); 

        let fieldsDB = [
         'STATUS_EMAIL_HI', 'GEN_Email_Create_1_Sentence', 
         'GEN_Sender_Email_Name', 'GEN_Email_Create_2_Sentence',
         'GEN_Email_Create_Sentence_Valid_1', 'GEN_Email_Create_Sentence_Valid_2',
         'GEN_Email_Create_Signature']

        const getDbDataForEmailTemplate = await getSpecificDataFromDB(fieldsDB);
        let parseJsonArrayToKeyValueRes = await parseJsonArrayToKeyValue(getDbDataForEmailTemplate);

        let rspsendMailUtils = await sendMailUtils(verifyTokenResponse, parseJsonArrayToKeyValueRes, 
            fieldsDB, tokenUrl, req.body.title, valid_from, valid_until);
        
        let handleMongoConn = await handleMongoConnection()
        context.res = await responseOkJson(rspsendMailUtils);

    } catch (error) {
        context.res = await responseErrorJson(error);
    }
};