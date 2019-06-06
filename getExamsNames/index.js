const { responseErrorJson } = require('../utils/common');
const examsTemplateContainer = process.env.examsTemplateContainer;
const UtilsBlob = require('../utils/utilsBlob');


module.exports = async function (context, req) {

    try {
        const response = await UtilsBlob.getContainerFilesDetails(examsTemplateContainer);
        const data = response.entries;
        const examsNames = [];
        for(let key in data){
            const fullBlobName = data[key].name
            const blobName = fullBlobName.substring(0, fullBlobName.indexOf("."));
            examsNames.push(blobName);
        }
        
        context.res = {
            status: 200,
            body: examsNames
        };
        context.done();

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}



