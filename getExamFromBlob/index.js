const Utils = require('../utils/utilsBlob');
const { connectionToDB } = require('../utils/database');
const examsuser = process.env.examsuser;
//const { parse } = require('querystring');
const { responseOkJson, responseErrorJson } = require('../utils/common');

module.exports = async function (context, req) {

    const examName = req.body.examName;
 
    try {

        await connectionToDB();

        let getJsonExamBlobResponse = await Utils.getJsonExamBlob(examName, examsuser);

        const getJsonExamBlobResponseJSON = JSON.parse(getJsonExamBlobResponse);
    
        context.res = await responseOkJson(getJsonExamBlobResponseJSON);
        
    } catch (error) {
          context.res = await responseErrorJson(error);
    }

};



