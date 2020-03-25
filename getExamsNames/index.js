const { responseErrorJson, responseOkJson } = require('../utils/common');
const examtemplatecontainer = process.env.examtemplatecontainer;
const UtilsBlob = require('../utils/utilsBlob');


module.exports = async function (context, req) {

    try {
        const response = await UtilsBlob.getContainerFilesDetails(examtemplatecontainer);
        const data = response.entries;
    
        let arrayOfBlobNames = data.map(el => {
            let fname = UtilsBlob.path.parse(el.name);
            if (fname.dir !== 'salt') {
               return el;
            }
        }).filter(el => {
             if (el) {
                 return el;
             }
        });

        let getDatafromBlobRes = await getDatafromBlob(arrayOfBlobNames)
        context.res = await responseOkJson(getDatafromBlobRes);
        
    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const getDatafromBlob = (arrayOfBlobNames) => {
    return Promise.all(arrayOfBlobNames.map(item => getOneBlobJson(item.name)))
}


const getOneBlobJson = async (name) =>  {
    let blobLocation = name
    let responseFromBlob = await UtilsBlob.getJsonExamBlob(blobLocation, examtemplatecontainer);
    var obj = await JSON.parse(responseFromBlob); 

    return { name : blobLocation, 
             jsonExamName : obj.ExamVersion_Name, 
             customName :  obj.ExamVersion_CustomName,
             plannedDuration: obj.ExamVersion_plannedDuration };
}

