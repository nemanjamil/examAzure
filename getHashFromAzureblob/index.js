const { responseErrorJson, responseOkJson } = require('../utils/common');
const examtemplatecontainer = process.env.examtemplatecontainer;
const UtilsBlob = require('../utils/utilsBlob');

module.exports = async function (context, req) {
    
    //let functionKey = req.headers['x-functions-key'];
    let examVersionExternalId = req.body.examVersionExternalId;
    let blobLocation = "salt/"+examVersionExternalId+".salt";

    try {

        await validateData(examVersionExternalId);
        const response = await UtilsBlob.getJsonExamBlob(blobLocation, examtemplatecontainer)
        context.res = await responseOkJson(response);
        
    } catch (error) {
        context.res = await responseErrorJson(error);
    }

};

async function validateData(examVersionExternalId){
    if (!examVersionExternalId) {
        return Promise.reject("No ID");
    }
}