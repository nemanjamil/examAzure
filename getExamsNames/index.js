const { responseErrorJson, responseOkJson } = require('../utils/common');
const examstemplatecontainer = process.env.examstemplatecontainer;
const UtilsBlob = require('../utils/utilsBlob');


module.exports = async function (context, req) {

    try {
        const response = await UtilsBlob.getContainerFilesDetails(examstemplatecontainer);
        const data = response.entries;
        const examsNames = [];
        for(let key in data){
            const fullBlobName = data[key].name
            const blobName = fullBlobName.substring(0, fullBlobName.indexOf("."));
            examsNames.push(blobName);
        }
        context.res = await responseOkJson(examsNames);
        
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}



