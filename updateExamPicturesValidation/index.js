
const Picture = require('../models/picture');
const { connectionToDB } = require('../utils/database');
const { responseErrorJson, responseOkJson } = require('../utils/common');
const picturessk = process.env.PICTURESSK;

/**
 * This function is used in Gallery to switch status of exam all pictures 
 */
module.exports = async function (context, req) {

    const examId = req.body.examId;
    const validationType = req.body.validationType;
    const picturesIds = req.body.picturesIds;

    try {

        let updateAllExamPicturesColor = null;

        if(examId && picturesIds){

            await connectionToDB();

            updateAllExamPicturesColor = await updateAllExamPictures(context, examId, picturesIds, validationType);

        }else{
            updateAllExamPicturesColor = {
                message: `Error updating pictures data. 
                        ${examId ? "" : "ExamId has null value. "} 
                        ${picturesIds.length === 0 ? "" : "Pictures Ids are not defined."}`
            }
        }

        context.res = await responseOkJson(updateAllExamPicturesColor);

    } catch (error) {
        context.res = await responseErrorJson(error);
        context.done();
    }

}

const updateAllExamPictures = async (context, examId, picturesIds, validationType) => {

    try {

        let stateOfPicture = 1;

        switch(validationType){
            case 'validPicture': stateOfPicture = 1; break;
            case 'noFacePicture': stateOfPicture = 0; break;
            case 'moreThenOnePersons': stateOfPicture = 2; break;
            default: stateOfPicture = 1;
        }

        const result = await Picture.updateMany(
                {'picturessk' : picturessk, "examId" : examId, "pictureId": { $in: picturesIds }},
                {"$set":{"stateOfPicture" : stateOfPicture}}, 
                {"multi": true}, 
                (err, writeResult) => {
                    if(err){
                        console.log(err);
                    }else if(writeResult){
                        console.log(writeResult);
                    }               
                });

        return result;

    } catch (error) {

        let messageBody = {
            message: "Error updating pictures data"
        }
        return Promise.reject(messageBody);
    }
}