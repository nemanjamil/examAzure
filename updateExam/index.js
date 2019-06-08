const Exam = require('../models/exam');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');
const UtilsBlob = require('../utils/utilsBlob');
const examsuserContainer = process.env.examsuser;

module.exports = async function (context, req) {

    // this endpoint is calling and from exam app and exam admin app
    // exam admin app don't have token property
    // exam have token but is not used here (because admin app don't have token)

    // IMPORTANT: need secure this endpoint FOR USE IN EXAM APP WITHOUT TOKEN

    // request input data example
    // examId is required
    // other properties are optional, it's logical to have one property which is updating
    // {
    //     "examId" : "169_123_684",
    //     "isCheated" : false,
    //     "other exam property" : "value" 
    // } 

    const { examId } = req.body;

    let updateProperties = [];

    for (let key in req.body) {
        if (key !== 'examId') {
            updateProperties.push({
                name: key,
                value: req.body[key]
            });
        }
    }

    try {
        await connectionToDB();
        const updateDBResult = await updateExam(examId, updateProperties);
        const updateCheatedJSONResult = await isCheatedPropertyUpdating(examId, updateProperties);

        const response = {
            updateExamDB: updateDBResult,
            isCheatedPropertyUpdating: updateCheatedJSONResult
        }

        context.res = await responseOkJson(response);

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const updateExam = async (examId, updateProperties) => {

    try {
        const exam = await Exam.findOne({ examId: examId });

        for (let key in updateProperties) {
            exam[updateProperties[key].name] = updateProperties[key].value;
        }

        let result = await exam.save();
        result = result.toObject();
        delete result['_id'];
        delete result['examssk'];

        return result;
        
    } catch (error) {
        let messageBody = {
            message: "Error updating exam"
        }
        return Promise.reject(messageBody)
    }
}


// If updating exam DB property is cheated (true or false)
// then update same information in blob JSON
const isCheatedPropertyUpdating = async (examId, updateProperties) => {

    let cheatedProperty = null;
    cheatedProperty = updateProperties.find(el => el.name === 'isCheated');

    if (cheatedProperty) {
        // create blob path from examId: tom_123_sd3-34sd => tom/123/sd3-34sd/tom_123_sd3-34sd_score.json
        const blobName = `${examId}_score.json`;
        const blobPath = `${examId.split('_').join('/')}/${blobName}`;
        try {
            let examJsonFromBlob = await UtilsBlob.getJsonExamBlob(blobPath, examsuserContainer);
            await updateJson(examJsonFromBlob, blobPath, cheatedProperty);
            return Promise.resolve({message: "Cheated property in JSON was updated"});
        } catch (error) {
            return Promise.reject(error);
        }
    }

    return Promise.resolve({message:'Not updating'});
}

// if isCheated property did changed
async function updateJson(examJsonFromBlob, blobPath, cheatedProperty) {
    
    let jsonObject = JSON.parse(examJsonFromBlob);
    try {
        jsonObject.Exam_FMR = cheatedProperty.value
        await UtilsBlob.putFileToContainerJson(examsuserContainer, blobPath, JSON.stringify(jsonObject));
    } catch (error) {
        let messageBody = {
            message: "Error updating cheated property in blob JSON file"
        }
        return Promise.reject(messageBody);
    }
}