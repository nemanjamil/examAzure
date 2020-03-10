const { responseErrorJson, responseOkJson, 
    validateIfStringExist, verifyToken, createSaltExamPath } = require('../utils/common');
const examsuser = process.env.examsuser;
const UtilsBlob = require('../utils/utilsBlob');
const secret_key = process.env.secret_key;
//const path = require('path');


module.exports = async function (context, req) {
    
    //let functionKey = req.headers['x-functions-key'];
    //let examVersionExternalId = path.basename(req.body.examVersionExternalId,".json");
    const token = req.headers.authorization;

    try {

        let tokenExistResponse = await validateIfStringExist(token);
        let verifyTokenResponse = await verifyToken(tokenExistResponse, secret_key);
        
        let examVersionExternalId = verifyTokenResponse.ExamVersion_EXTERNAL_ID;
        let checkIfStringExist = await validateIfStringExist(examVersionExternalId);

        let blobLocationSaltCopy = createSaltExamPath(verifyTokenResponse);
        const response = await UtilsBlob.getJsonExamBlob(blobLocationSaltCopy, examsuser)
        context.res = await responseOkJson(response);
        
    } catch (error) {
       
        context.res = await responseErrorJson(error);
    }

};

